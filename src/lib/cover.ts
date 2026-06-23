import type { CollectionEntry } from "astro:content"

/** A resolved image module from import.meta.glob for an asset image. */
interface ImageModule {
  default: { src: string; width: number; height: number; format: string }
}

/**
 * All image files under src/content/blog/, keyed by their absolute path
 * from the project root (e.g., "/src/content/blog/2022-10-18-cover/cover.png").
 */
const blogImages: Record<string, ImageModule> = import.meta.glob(
  "/src/content/blog/**/*.{png,jpg,jpeg,gif,webp}",
  { eager: true }
)

/**
 * Standard default cover image URL (served from public/).
 * This file exists at public/site-header.jpg and will be copied verbatim.
 */
export const DEFAULT_COVER = "/site-header.jpg"

/**
 * Given a post's entry ID (e.g. "2018-11-27-gitlab_gitbook/index.md"),
 * return the project-root absolute directory path for the post.
 *
 * @example
 *   getPostDir("2018-11-27-gitlab_gitbook/index.md")
 *   // => "/src/content/blog/2018-11-27-gitlab_gitbook/"
 */
function getPostDir(entryId: string): string {
  const slashIndex = entryId.lastIndexOf("/")
  const dir = slashIndex >= 0 ? entryId.slice(0, slashIndex + 1) : ""
  return `/src/content/blog/${dir}`
}

/** Candidate fallback filenames to try when the specified cover doesn't exist. */
const FALLBACK_COVERS = ["thumb.jpg", "cover.jpg", "cover.png"]

/**
 * Resolve the frontmatter `cover` to a built asset URL string, or return
 * `null` if no real cover image is found (i.e. this post has no cover).
 *
 * The algorithm:
 * 1. If `cover` is empty/null/undefined, skip to fallbacks.
 * 2. Otherwise resolve the relative cover path against the post's directory
 *    and look it up in the `import.meta.glob` result.
 * 3. If not found in glob, also try fallback filenames (thumb.jpg, etc.).
 * 4. If nothing matches, return null.
 *
 * @returns An absolute URL path (e.g., "/_astro/cover.hash.png") or null.
 */
export function resolveCoverOrNull(
  post: CollectionEntry<"blog">
): string | null {
  const postDir = getPostDir(post.id)
  const rawCover = post.data.cover

  // Try the specified cover path first
  if (rawCover && rawCover.trim().length > 0) {
    // Strip leading "./" to get the relative component
    const relativeFile = rawCover.startsWith("./")
      ? rawCover.slice(2)
      : rawCover
    const candidatePath = `${postDir}${relativeFile}`
    const image = blogImages[candidatePath]
    if (image) {
      return image.default.src
    }
  }

  // Fallback: try well-known filenames in the post directory
  for (const fallback of FALLBACK_COVERS) {
    const candidatePath = `${postDir}${fallback}`
    const image = blogImages[candidatePath]
    if (image) {
      return image.default.src
    }
  }

  return null
}

/**
 * Resolve the frontmatter `cover` string to a built asset URL string.
 *
 * @returns An absolute URL path (e.g., "/_astro/cover.hash.png" or "/site-header.jpg").
 */
export function resolveCover(post: CollectionEntry<"blog">): string {
  return resolveCoverOrNull(post) ?? DEFAULT_COVER
}
