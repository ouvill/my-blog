import type { BlogPost } from "./posts"

export interface TaxonomyItem {
  name: string
  count: number
  href: string
}

export interface RelatedPost {
  post: BlogPost
  score: number
  matchedTags: string[]
  matchedCategory: string | null
}

const TAG_DISPLAY_NAMES = new Map<string, string>([
  ["ai", "AI"],
  ["app", "App"],
  ["c", "C"],
  ["c#", "C#"],
  ["c++", "C++"],
  ["cloudflare", "Cloudflare"],
  ["css", "CSS"],
  ["dart", "Dart"],
  ["desktop", "Desktop"],
  ["docker", "Docker"],
  ["firefox", "Firefox"],
  ["flutter", "Flutter"],
  ["fs", "FS"],
  ["gatsbyjs", "GatsbyJS"],
  ["git", "Git"],
  ["go", "Go"],
  ["gpg", "GPG"],
  ["ios", "iOS"],
  ["java", "Java"],
  ["javascript", "JavaScript"],
  ["js", "JavaScript"],
  ["k8s", "Kubernetes"],
  ["kubernetes", "Kubernetes"],
  ["line", "LINE"],
  ["linux", "Linux"],
  ["lvm", "LVM"],
  ["nginx", "Nginx"],
  ["php", "PHP"],
  ["python", "Python"],
  ["react", "React"],
  ["ruby", "Ruby"],
  ["rust", "Rust"],
  ["sass", "Sass"],
  ["scss", "SCSS"],
  ["shortcut", "Shortcut"],
  ["ssh", "SSH"],
  ["typescript", "TypeScript"],
  ["tool", "Tool"],
  ["ubuntu", "Ubuntu"],
  ["wsl", "WSL"],
  ["xml", "XML"],
  ["yubikey", "YubiKey"],
])

const CATEGORY_DISPLAY_NAMES = new Map<string, string>([
  ["develop", "Develop"],
  ["diary", "Diary"],
  ["game", "Game"],
  ["it", "IT"],
  ["security", "Security"],
])

function normalizeTaxonomyName(name: string): string {
  return name.trim().replace(/\s+/g, " ")
}

export function normalizeTagName(tag: string): string {
  const normalized = normalizeTaxonomyName(tag)
  const key = normalized.toLocaleLowerCase()
  return TAG_DISPLAY_NAMES.get(key) ?? normalized
}

export function normalizeCategoryName(category: string): string {
  const normalized = normalizeTaxonomyName(category)
  const key = normalized.toLocaleLowerCase()
  return CATEGORY_DISPLAY_NAMES.get(key) ?? normalized
}

export function getPostTags(post: BlogPost): string[] {
  const tags = [...(post.data.tags ?? []), ...(post.data.tag ?? [])]
  return Array.from(
    new Set(
      tags
        .filter((tag) => tag.trim().length > 0)
        .map((tag) => normalizeTagName(tag))
    )
  )
}

export function getPostCategory(post: BlogPost): string | null {
  const category = post.data.category
    ? normalizeCategoryName(post.data.category)
    : null
  return category && category.length > 0 ? category : null
}

export function taxonomyPath(
  type: "categories" | "tags",
  name: string
): string {
  return `/${type}/${encodeURIComponent(name)}/`
}

export function decodeTaxonomyParam(value: string | undefined): string {
  return decodeURIComponent(value ?? "")
}

export function getPostRawTags(post: BlogPost): string[] {
  const tags = [...(post.data.tags ?? []), ...(post.data.tag ?? [])]
  return Array.from(
    new Set(tags.map(normalizeTaxonomyName).filter((tag) => tag.length > 0))
  )
}

export function getPostRawCategory(post: BlogPost): string | null {
  const category = post.data.category
    ? normalizeTaxonomyName(post.data.category)
    : null
  return category && category.length > 0 ? category : null
}

export function collectTaxonomyRouteNames(
  posts: BlogPost[],
  type: "categories" | "tags"
): string[] {
  const routeNames = new Set<string>()

  for (const post of posts) {
    const names =
      type === "categories"
        ? [getPostRawCategory(post), getPostCategory(post)]
        : [...getPostRawTags(post), ...getPostTags(post)]

    for (const name of names) {
      if (name !== null && name.length > 0) {
        routeNames.add(name)
      }
    }
  }

  return Array.from(routeNames)
}

export function collectTaxonomyItems(
  posts: BlogPost[],
  type: "categories" | "tags"
): TaxonomyItem[] {
  const counts = new Map<string, number>()

  for (const post of posts) {
    const names =
      type === "categories"
        ? [getPostCategory(post)].filter(
            (name): name is string => name !== null
          )
        : getPostTags(post)

    for (const name of names) {
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      href: taxonomyPath(type, name),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"))
}

export function filterPostsByTaxonomy(
  posts: BlogPost[],
  type: "categories" | "tags",
  name: string
): BlogPost[] {
  const normalizedName =
    type === "categories" ? normalizeCategoryName(name) : normalizeTagName(name)

  return posts.filter((post) => {
    if (type === "categories") {
      return getPostCategory(post) === normalizedName
    }
    return getPostTags(post).includes(normalizedName)
  })
}

export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit = 4
): RelatedPost[] {
  const currentTags = new Set(getPostTags(currentPost))
  const currentCategory = getPostCategory(currentPost)

  return posts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      const matchedTags = getPostTags(post).filter((tag) =>
        currentTags.has(tag)
      )
      const postCategory = getPostCategory(post)
      const matchedCategory =
        currentCategory !== null && postCategory === currentCategory
          ? currentCategory
          : null
      const score = matchedTags.length * 3 + (matchedCategory ? 1 : 0)

      return {
        post,
        score,
        matchedTags,
        matchedCategory,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.post.data.date.getTime() - a.post.data.date.getTime()
    })
    .slice(0, limit)
}
