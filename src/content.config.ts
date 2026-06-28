import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import { glob } from "astro/loaders"

/**
 * Normalize a date-like value to a Date object.
 * Handles strings "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss", ISO formats,
 * and Date objects (which YAML may pre-parse from date-like strings).
 */
function normalizeDate(input: unknown): Date {
  if (input instanceof Date && !isNaN(input.getTime())) {
    return input
  }
  const str = String(input).replace(" ", "T")
  const d = new Date(str)
  if (isNaN(d.getTime())) {
    return new Date(0) // fallback for truly invalid dates
  }
  return d
}

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    // Required fields
    title: z.string(),
    date: z.union([z.string(), z.date()]).transform(normalizeDate),
    // Optional fields (nullable for empty YAML values like `cover:`)
    category: z.string().optional().nullable(),
    tags: z
      .array(z.string().nullable())
      .optional()
      .nullable()
      .transform(
        (arr) => arr?.filter((t): t is string => t != null) ?? undefined
      ),
    tag: z
      .array(z.string().nullable())
      .optional()
      .nullable()
      .transform(
        (arr) => arr?.filter((t): t is string => t != null) ?? undefined
      ),
    description: z.string().optional().nullable(),
    subTitle: z.string().optional().nullable(),
    cover: z.string().optional().nullable(),
    published: z.boolean().optional(),
  }),
})

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    category: z.string().optional(),
  }),
})

export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
}
