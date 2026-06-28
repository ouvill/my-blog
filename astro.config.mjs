import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

import mdx from "@astrojs/mdx"

// https://astro.build/config
export default defineConfig({
  site: "https://blog.ouvill.net",
  integrations: [sitemap(), mdx()],
  // Preserve trailing slash behavior to match Gatsby
  trailingSlash: "always",
  // Serve static assets
  publicDir: "public",
  // Output to dist (matching Astro default)
  outDir: "dist",
  // Markdown configuration
  markdown: {
    shikiConfig: {
      themes: {
        light: "one-light",
        dark: "one-dark-pro",
      },
    },
  },
})
