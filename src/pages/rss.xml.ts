import rss from "@astrojs/rss"
import { getAllPosts } from "@lib/posts"
import { blogEntryIdToSlug, blogUrlPath } from "@lib/slug"
import { SITE_CONFIG } from "@lib/site"

export async function GET() {
  const posts = await getAllPosts()
  return rss({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    site: SITE_CONFIG.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? post.data.subTitle ?? undefined,
      link: `${SITE_CONFIG.url}${blogUrlPath(blogEntryIdToSlug(post.id))}`,
    })),
  })
}
