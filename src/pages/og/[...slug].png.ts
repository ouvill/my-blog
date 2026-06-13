import type { APIRoute } from "astro"
import { getAllPosts } from "@lib/posts"
import { blogEntryIdToSlug } from "@lib/slug"
import { resolveCoverOrNull } from "@lib/cover"
import { renderOgCard } from "@lib/og/card"

export async function getStaticPaths() {
  const posts = await getAllPosts()
  return posts
    .filter((post) => resolveCoverOrNull(post) === null)
    .map((post) => ({
      params: { slug: blogEntryIdToSlug(post.id) },
      props: {
        title: post.data.title,
        tags: [
          ...(post.data.tags ?? []),
          ...(post.data.tag ?? []),
        ].slice(0, 3),
      },
    }))
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard(props as { title: string; tags: string[] })
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
