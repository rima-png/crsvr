/** Geographic filter bucket for the country picker (not GEMO tier). */
export type CountryMacroRegion =
  | 'europe'
  | 'americas'
  | 'asia_pacific'
  | 'middle_east_africa'

/** Confidence tier for per-country economics. */
export type DataConfidence = 'verified' | 'baseline' | 'tier_default'

/** Direction in which a known regulatory change is expected to move the threshold or cost. */
export type ChangeImpact =
  | 'raises_threshold'
  | 'lowers_threshold'
  | 'raises_cost'
  | 'lowers_cost'
  | 'informational'

/** Structured form of the threshold-justification block.
 *  Plain strings still work — both shapes are accepted. */
export interface ThresholdJustification {
  /** 1-sentence punchline rendered prominently as the lead. */
  summary: string
  /** Optional structured breakdown — short heading + body per topic. */
  sections?: { heading: string; body: string }[]
}

/** A legislated-or-confirmed regulatory change that has not yet taken effect. */
export interface UpcomingChange {
  /** ISO date (YYYY-MM-DD) when the change becomes effective. */
  effectiveDate: string
  /** Short label, e.g. "Employment Rights Act 2025 cap abolition". */
  title: string
  /** 1–2 sentence explanation of what changes and the practical impact. */
  summary: string
  impact: ChangeImpact
  /** Optional URL or reference for provenance. */
  source?: string
}

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
  /** Reason the threshold is what it is for this market. Plain string for short notes,
   *  or structured ThresholdJustification (summary + sections) for richer breakdowns.
   *  Shown in the country-intel panel + PDF memo. */
  thresholdJustification?: string | ThresholdJustification
  /** Estimated cost per employee to wind down the entity at ~3-year tenure (in local currency). */
  terminationCostPerEmployee?: number
  /** Short note describing what's included in the termination estimate. */
  terminationBasisNote?: string
  /** USD per 1 unit of local currency, from the FX snapshot. */
  fxToUsd?: number
  /** Confidence level of the per-country economics (verified by advisor, baseline from public sources, or tier template). */
  dataConfidence: DataConfidence
  /** ISO date (YYYY-MM-DD) when the per-country override data was last reviewed. Drives "refresh due" amber state when >12 months stale. */
  lastReviewedDate?: string
  /** Legislated-or-confirmed regulatory changes that have not yet taken effect. Drives the regulatory-calendar block + planning-window banner. */
  upcomingChanges?: UpcomingChange[]
}

export interface UserInputs {
  country: Country | null
  currentHeadcount: number
  plannedHeadcount: number
  operatesInLocalLanguage: boolean
  /** EOR fee per employee per month, stored in the country's **local** currency.
   *  The user may enter the value in a different currency via `eorFeeCurrency`;
   *  we convert at input time so this field is always canonical-local. */
  eorFeePerMonth: number
  /** Currency the user is typing the EOR fee in. Defaults to country.currency
   *  on country select; the user can override to USD / GBP / EUR via the picker.
   *  Display-only — calculations always use eorFeePerMonth in local currency. */
  eorFeeCurrency: string
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
