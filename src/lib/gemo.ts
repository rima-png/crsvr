import type { Country } from './types'

/** Teamed GEMO Framework v2.0 (Nov 2024) — Country Concentration & Entity Transition */
export const GEMO_FRAMEWORK_NAME =
  'Country Concentration & Entity Transition Framework (GEMO Framework)'

export const GEMO_FULL_NAME = 'Global Entity Management Operations (GEMO)'

/** Tier thresholds: native vs non-native (Language Buffer Rule: +30–50% on thresholds when non-native). */
export const GEMO_TIER_THRESHOLDS = {
  1: {
    thresholdNative: 10,
    thresholdNonNative: 14,
    setupMonthsLow: 2,
    setupMonthsHigh: 4,
    complexityLabel: 'Straightforward' as const,
  },
  2: {
    thresholdNative: 18,
    thresholdNonNative: 25,
    setupMonthsLow: 4,
    setupMonthsHigh: 6,
    complexityLabel: 'Moderate' as const,
  },
  3: {
    thresholdNative: 30,
    thresholdNonNative: 43,
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
