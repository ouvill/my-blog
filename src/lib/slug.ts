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

/**
 * Compute a blog-specific URL slug from a content entry ID.
 *
 * Applies the same logic as entryIdToSlug, then transforms the first
 * path segment: if it starts with a date prefix `YYYY-MM-DD-` and the
 * separator between date and slug is a *single* `-`, it is replaced
 * with `--`.  If the separator is already `--` (i.e. the slug was
 * already migrated or manually created with the double-dash convention),
 * it is left unchanged.
 *
 * This preserves the existing Gatsby-era URL convention where date
 * prefixes use a double-dash separator.
 *
 * Examples:
 *   "2018-03-10-agreement_github_personal/agreement_github_personal.md"
 *   → "2018-03-10--agreement_github_personal/agreement_github_personal"
 *
 *   "2026-06-12--my-new-post/index.md"
 *   → "2026-06-12--my-new-post"   (already `--`, unchanged)
 *
 *   "hello-world/index.md"
 *   → "hello-world"  (no date prefix, unchanged)
 */
export function blogEntryIdToSlug(id: string): string {
  const slug = entryIdToSlug(id)
  // Negative lookahead (?!-) ensures we only match a single dash,
  // leaving content that already has `--` untouched.
  return slug.replace(/^(\d{4}-\d{2}-\d{2})-(?!-)(.+)$/, "$1--$2")
}

/** Build the canonical blog URL path: /blog/<slug>/ */
export function blogUrlPath(slug: string): string {
  return `/blog/${slug}/`
}

/** Build the canonical page URL path: /pages/<slug>/ */
export function pageUrlPath(slug: string): string {
  return `/pages/${slug}/`
}
