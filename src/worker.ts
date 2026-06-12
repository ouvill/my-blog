/**
 * Cloudflare Worker entry point.
 *
 * Routes requests to either the existing contact API handler, legacy
 * redirect rules, or the static-assets binding that serves the Astro
 * build output (`dist/`).
 *
 * - `POST /api/contact` or `/api/contact/` → delegated to `onRequest`.
 * - Exact-match legacy redirect source              → 301 redirect.
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

    // 3. Static assets fallback.
    return env.ASSETS.fetch(request)
  },
}
