/**
 * Compute a URL slug from a content entry ID, mirroring Gatsby's createFilePath.
 *
 * In Astro content collections `type: "content"`, the entry `id` is the path
 * relative to the collection directory, including the `.md` extension.
 *
 * - `"dir/index.md"`  → `"dir"`       (index.md files)
 * - `"dir/file.md"`   → `"dir/file"`  (non-index .md files)
 */
export function entryIdToSlug(id: string): string {
  // Strip the .md extension if present
  const base = id.endsWith(".md") ? id.slice(0, -3) : id
  // For index.md files, remove the trailing "/index"
  if (base.endsWith("/index")) {
    return base.slice(0, -6)
  }
  return base
}



/** Build the canonical blog URL path: /blog/<slug>/ */
export function blogUrlPath(slug: string): string {
  return `/blog/${slug}/`
}

/** Build the canonical page URL path: /pages/<slug>/ */
export function pageUrlPath(slug: string): string {
  return `/pages/${slug}/`
}
