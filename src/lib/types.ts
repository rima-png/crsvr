/** Geographic filter bucket for the country picker (not GEMO tier). */
export type CountryMacroRegion =
  | 'europe'
  | 'americas'
  | 'asia_pacific'
  | 'middle_east_africa'

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
