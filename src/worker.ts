/**
 * Cloudflare Worker entry point.
 *
 * Routes requests to either the existing contact API handler, legacy
 * redirect rules, or the static-assets binding that serves the Astro
 * build output (`dist/`).
 *
 * - `POST /api/contact` or `/api/contact/` → delegated to `onRequest`.
 * - Exact-match legacy redirect source              → 301 redirect.
 * - `/sw.js` or `/service-worker.js`                → SW unregistration JS
 *                                                (temporary migration — drops
 *                                                old Gatsby SW on legacy clients
 *                                                during the Astro transition).
 * - Everything else                                  → `ASSETS` static binding.
 */

import { onRequest } from "../functions/api/contact.ts"
import type { ContactEnv } from "../functions/api/contact.ts"
import { findRedirect } from "./redirects.ts"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Minimal shape of the Cloudflare Static Assets `fetch` binding.
 *
 * The runtime binding is a `Fetcher`; only the `fetch` method is used here,
 * so we declare just that to avoid pulling in `@cloudflare/workers-types`.
 */
interface AssetsBinding {
  fetch(request: Request): Promise<Response>
}

/** Full set of bindings / environment variables for this Worker. */
export interface Env extends ContactEnv {
  readonly ASSETS: AssetsBinding
}

/** Shape of the context object passed to `onRequest` by this Worker. */
interface WorkerFunctionContext {
  readonly request: Request
  readonly env: Env
}

// ---------------------------------------------------------------------------
// Service Worker unregistration script  (temporary migration code)
//
// During the Gatsby → Astro migration period, old clients may still have
// the Gatsby service worker registered.  This script unregisters it so
// that those clients fall back to plain HTTP loading.
//
// Once enough time has passed (i.e. most visitors have received this
// script and had their SW unregistered), both the script and the routes
// in wrangler.toml (`run_worker_first`) can be removed.
// ---------------------------------------------------------------------------

/**
 * JavaScript served at `/sw.js` and `/service-worker.js` that unregisters any
 * stale service worker (typically the Gatsby SW from the previous blog) and
 * purges all caches.
 *
 * This is a temporary migration measure — for the duration of the Gatsby →
 * Astro transition, the Worker serves this script so that legacy clients
 * gracefully clean up their old SW registration without manual intervention.
 */
const SW_UNREGISTER_SCRIPT = `
self.addEventListener("install", (event) => {
  // Take over immediately without waiting for page refresh.
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // 1. Wipe every previously cached resource.
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))

      // 2. Unregister this service worker entirely.
      await self.registration.unregister()

      // 3. Reload every open window/tab that is still controlled by this SW,
      //    so they load fresh without any SW interference.
      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      await Promise.all(
        windowClients.map((client) => client.navigate(client.url)),
      )
    })(),
  )
})
`

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const { pathname } = url

    // 1. Contact API — accept both with and without trailing slash.
    if (pathname === "/api/contact" || pathname === "/api/contact/") {
      // The contact handler only needs `request` + `env`; `Env` is a strict
      // superset of `ContactEnv`, so this is a safe structural assignment.
      const context: WorkerFunctionContext = { request, env }
      return onRequest(context)
    }

    // 2. Legacy redirects — exact match on source path.
    const redirect = findRedirect(pathname)
    if (redirect) {
      // Preserve the original query string when present.
      const target =
        url.search.length > 0
          ? `${redirect.target}${url.search}`
          : redirect.target
      return new Response(null, {
        status: redirect.status,
        headers: { Location: new URL(target, request.url).href },
      })
    }

    // 3. Service Worker unregistration — return JS that wipes the old SW.
    if (pathname === "/sw.js" || pathname === "/service-worker.js") {
      return new Response(SW_UNREGISTER_SCRIPT, {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Service-Worker-Allowed": "/",
        },
      })
    }

    // 4. Static assets fallback.
    return env.ASSETS.fetch(request)
  },
}
