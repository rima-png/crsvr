import type { Country } from './types'

/** Teamed GEMO Framework v2.0 (Nov 2024) — Country Concentration & Entity Transition */
export const GEMO_FRAMEWORK_NAME =
  'Country Concentration & Entity Transition Framework (GEMO Framework)'

export const GEMO_FULL_NAME = 'Global Entity Management Operations (GEMO)'

/**
 * Tier thresholds. May 2026 recalibration: every default lowered so the
 * calculator triggers a planning conversation at the headcount where it is
 * actually worth having, rather than the academic operational-readiness
 * ceiling. Per-country overrides in src/data/country-overrides.ts can pin a
 * specific number for an individual market.
 */
export const GEMO_TIER_THRESHOLDS = {
  1: {
    thresholdNative: 6,
    thresholdNonNative: 10,
    setupMonthsLow: 2,
    setupMonthsHigh: 4,
    complexityLabel: 'Straightforward' as const,
  },
  2: {
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupMonthsLow: 4,
    setupMonthsHigh: 6,
    complexityLabel: 'Moderate' as const,
  },
  3: {
    thresholdNative: 15,
    thresholdNonNative: 22,
    setupMonthsLow: 6,
    setupMonthsHigh: 12,
    complexityLabel: 'Complex' as const,
  },
} as const

export type CountrySeed = Omit<
  Country,
  'thresholdNative' | 'thresholdNonNative' | 'setupMonthsLow' | 'setupMonthsHigh' | 'complexityLabel'
> & {
  tier: 1 | 2 | 3
  thresholdNative?: number
  thresholdNonNative?: number
  setupMonthsLow?: number
  setupMonthsHigh?: number
}

export function buildCountryFromGemo(seed: CountrySeed): Country {
  const t = GEMO_TIER_THRESHOLDS[seed.tier]
  return {
    ...seed,
    complexityLabel: t.complexityLabel,
    thresholdNative: seed.thresholdNative ?? t.thresholdNative,
    thresholdNonNative: seed.thresholdNonNative ?? t.thresholdNonNative,
    setupMonthsLow: seed.setupMonthsLow ?? t.setupMonthsLow,
    setupMonthsHigh: seed.setupMonthsHigh ?? t.setupMonthsHigh,
  }
}
