const DEFAULT_EXCERPT_LENGTH = 118

export function toExcerpt(
  body: string,
  maxLength = DEFAULT_EXCERPT_LENGTH
): string {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "")
    .replace(/[#>*_`-]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
}

export function descriptionOrExcerpt(
  description: string | null | undefined,
  body: string
): string {
  const normalizedDescription = description?.trim()

  if (normalizedDescription) {
    return normalizedDescription
  }

  return toExcerpt(body)
}
