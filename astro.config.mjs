import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://blog.ouvill.net",
  integrations: [sitemap()],
  // Preserve trailing slash behavior to match Gatsby
  trailingSlash: "always",
  // Serve static assets
  publicDir: "public",
  // Output to dist (matching Astro default)
  outDir: "dist",
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: "solarized-light",
      // Default languages
      langs: [],
    },
  },
})
