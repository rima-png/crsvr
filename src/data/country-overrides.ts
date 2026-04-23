/**
 * Per-country overrides to the GEMO tier-template economics.
 *
 * Keyed by ISO-3166 alpha-2 code. Keys missing from this map inherit tier defaults.
 *
 * `verified: true` → signed off against advisor-grade data (green confidence badge).
 * `verified: false` → drafted from public sources, pending advisor review (amber badge).
 * No entry → `tier_default` (grey "regional averages" disclaimer).
 */

export interface CountryOverride {
  verified: boolean
  thresholdNative?: number
  thresholdNonNative?: number
  setupCostLow?: number
  setupCostHigh?: number
  ongoingCostPerEmployeePerYear?: number
  terminationCostPerEmployee?: number
  terminationBasisNote?: string
  thresholdJustification?: string
}

export const COUNTRY_OVERRIDES: Record<string, CountryOverride> = {
  BR: {
    verified: true,
    thresholdNative: 18,
    thresholdNonNative: 25,
    setupCostLow: 50000,
    setupCostHigh: 120000,
    terminationCostPerEmployee: 50000,
    terminationBasisNote:
      'FGTS 40% fine + accrued vacation (1/3) + 13th salary + notice period at ~3 years tenure. Advisor estimate in BRL — confirm with local counsel before any decision.',
    thresholdJustification:
      'Tier 3 default is 30; Brazil lowered to 18 (native) / 25 (non-native) because payroll tax load (FGTS + INSS + 13th salary, ~70% on gross) front-loads the ongoing entity cost, bringing crossover forward by roughly 6–9 months vs the tier template.',
  },
  US: {
    verified: true,
    thresholdNative: 25,
    thresholdNonNative: 35,
    thresholdJustification:
      'US thresholds are state-dependent. 25 assumes concentration in a single state with straightforward payroll setup. Distributed hiring across multiple states (e.g. California + Texas + New York) adds per-state registration, tax, and compliance overhead and typically pushes break-even to 40–50+ employees.',
  },
}
