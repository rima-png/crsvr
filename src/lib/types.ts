/** Geographic filter bucket for the country picker (not GEMO tier). */
export type CountryMacroRegion =
  | 'europe'
  | 'americas'
  | 'asia_pacific'
  | 'middle_east_africa'

/** Confidence tier for per-country economics. */
export type DataConfidence = 'verified' | 'baseline' | 'tier_default'

export interface Country {
  code: string
  name: string
  flag: string
  /** UN-style macro region for UX filters (Europe includes selected transcontinental codes). */
  macroRegion: CountryMacroRegion
  tier: 1 | 2 | 3
  complexityLabel: 'Straightforward' | 'Moderate' | 'Complex'
  thresholdNative: number
  thresholdNonNative: number
  setupCostLow: number
  setupCostHigh: number
  ongoingCostPerEmployeePerYear: number
  setupMonthsLow: number
  setupMonthsHigh: number
  eorMarketRateMonthly: number
  currency: string
  complexityFactors: string[]
  redFlags: string[]
  languageBufferApplies: boolean
  /** One-sentence reason the threshold is what it is for this market. Shown as footnote in PDF + results UI. */
  thresholdJustification?: string
  /** Estimated cost per employee to wind down the entity at ~3-year tenure (in local currency). */
  terminationCostPerEmployee?: number
  /** Short note describing what's included in the termination estimate. */
  terminationBasisNote?: string
  /** USD per 1 unit of local currency, from the FX snapshot. */
  fxToUsd?: number
  /** Confidence level of the per-country economics (verified by advisor, baseline from public sources, or tier template). */
  dataConfidence: DataConfidence
}

export interface UserInputs {
  country: Country | null
  currentHeadcount: number
  plannedHeadcount: number
  operatesInLocalLanguage: boolean
  eorFeePerMonth: number
}

export interface MonthlyDataPoint {
  month: number
  eorCumulative: number
  entityCumulative: number
  eorMonthly: number
  entityMonthly: number
  headcount: number
}

export interface CalculationResult {
  dataPoints: MonthlyDataPoint[]
  crossoverMonth: number | null
  totalEorCost: number
  totalEntityCost: number
  totalSavings: number
  status: 'BELOW_THRESHOLD' | 'NEAR_THRESHOLD' | 'ABOVE_THRESHOLD'
  readinessScore: number
  readinessItems: ReadinessItem[]
  setupCostUsed: number
  threshold: number
  /** Entity cost using setupCostLow — best-case for entity. */
  totalEntityCostLow: number
  /** Entity cost using setupCostHigh — worst-case for entity. */
  totalEntityCostHigh: number
  /** Savings when the entity setup lands at the high end. */
  totalSavingsLow: number
  /** Savings when the entity setup lands at the low end. */
  totalSavingsHigh: number
  crossoverMonthLow: number | null
  crossoverMonthHigh: number | null
  /** True when low/high variants disagree on the sign of 3-year savings — recommendation is directional only. */
  marginFlag: boolean
  /** Totals expressed in USD using country.fxToUsd; null when no FX data. */
  usdTotalEorCost: number | null
  usdTotalEntityCost: number | null
  usdTotalSavings: number | null
  /** ISO date (YYYY-MM-DD) of the FX snapshot used, or null if no conversion applied. */
  fxSnapshotDate: string | null
}

export interface ReadinessItem {
  criterion: string
  question: string
  status: 'green' | 'amber' | 'red'
  detail: string
}

export interface LeadData {
  firstName: string
  email: string
  companyName: string
  currentProvider: string
}
