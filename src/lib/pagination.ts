import { POSTS_PER_PAGE } from "./site"

export interface PaginationInfo {
  /** Current page number (0-indexed) */
  current: number
  /** Total number of pages */
  total: number
  /** Previous page number, or null if on first page */
  prev: number | null
  /** Next page number, or null if on last page */
  next: number | null
}

/**
 * Compute pagination info given total number of items and current page.
 * Page numbers are 0-indexed.
 */
export function getPaginationInfo(
  totalItems: number,
  currentPage: number
): PaginationInfo {
  const total = Math.max(1, Math.ceil(totalItems / POSTS_PER_PAGE))
  return {
    current: currentPage,
    total,
    prev: currentPage > 0 ? currentPage - 1 : null,
    next: currentPage < total - 1 ? currentPage + 1 : null,
  }
}

/**
 * Get the slice of items for a given page.
 */
export function getPageSlice<T>(items: T[], page: number): T[] {
  const start = page * POSTS_PER_PAGE
  return items.slice(start, start + POSTS_PER_PAGE)
}
