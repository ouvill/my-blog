import { getCollection } from "astro:content"
import type { CollectionEntry } from "astro:content"
import { blogEntryIdToSlug } from "./slug"

export type BlogPost = CollectionEntry<"blog">

/**
 * Load all blog posts, filtering out unpublished posts
 * (`published: false` in frontmatter), sorted by date descending
 * (most recent first).
 * Each post's `slug` is computed from its entry `id`.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog")
  return posts
    .filter((post: BlogPost) => post.data.published !== false)
    .sort(
      (a: BlogPost, b: BlogPost) =>
        b.data.date.getTime() - a.data.date.getTime()
    )
}

/**
 * Load a single blog post by its URL slug.
 * The slug is the path after `/blog/` and before the trailing `/`.
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await getAllPosts()
  return posts.find((p) => blogEntryIdToSlug(p.id) === slug)
}

/**
 * Load all static pages.
 */
export async function getAllPages(): Promise<CollectionEntry<"pages">[]> {
  return await getCollection("pages")
}
