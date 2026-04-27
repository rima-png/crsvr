import type { UpcomingChange } from './types'

/**
 * True when the per-country override was last reviewed more than `monthThreshold`
 * months ago. Drives the "refresh due" amber state on the data-confidence badge.
 *
 * Returns false when no date is provided (tier-default countries shouldn't read as stale).
 */
export function isStale(
  lastReviewedDate: string | undefined,
  monthThreshold = 12
): boolean {
  if (!lastReviewedDate) return false
  const reviewed = new Date(lastReviewedDate)
  if (isNaN(reviewed.getTime())) return false
  const now = new Date()
  const monthsAgo =
    (now.getTime() - reviewed.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  return monthsAgo > monthThreshold
}

/**
 * Returns the subset of upcoming changes whose `effectiveDate` falls inside the
 * planning window: from now through `windowMonths` months ahead, sorted ascending.
 *
 * Past-effective items are filtered out — they belong in the prose justification,
 * not the regulatory-calendar block. A 36-month window matches the 3-year
 * Crossover horizon used elsewhere in the model.
 */
export function changesInWindow(
  changes: UpcomingChange[] | undefined,
  windowMonths = 36
): UpcomingChange[] {
  if (!changes || changes.length === 0) return []
  const now = new Date()
  const cutoff = new Date(now)
  cutoff.setMonth(cutoff.getMonth() + windowMonths)
  return changes
    .filter((c) => {
      const eff = new Date(c.effectiveDate)
      return !isNaN(eff.getTime()) && eff >= now && eff <= cutoff
    })
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate))
}

/**
 * True when the planning window contains at least one change whose impact would
 * shift the recommendation (raises/lowers threshold or cost). Pure-informational
 * changes don't trigger the planning-window banner.
 */
export function hasMaterialChangeInWindow(
  changes: UpcomingChange[] | undefined,
  windowMonths = 36
): boolean {
  return changesInWindow(changes, windowMonths).some(
    (c) => c.impact !== 'informational'
  )
}

/** Format a YYYY-MM-DD ISO date for human display, e.g. "27 April 2026". */
export function formatReviewedDate(date: string | undefined): string {
  if (!date) return 'date unknown'
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
