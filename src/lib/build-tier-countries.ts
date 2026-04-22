import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'
import { getAllInfoByISO } from 'iso-country-currency'
import tierData from '@/data/gemo-country-tiers.json'
import { getEmojiFlag } from 'countries-list'
import type { Country } from './types'
import { buildCountryFromGemo, type CountrySeed } from './gemo'
import { macroRegionFromCountryCode } from './macro-region'

countries.registerLocale(en)

/** Map your labels → English names recognised by i18n-iso-countries. */
const LOOKUP_NAME: Record<string, string> = {
  'Hong Kong (SAR)': 'Hong Kong',
  'China (Mainland)': 'China',
  'Korea, South': 'South Korea',
  'Korea, North': 'North Korea',
  'Congo (Republic)': 'Republic of the Congo',
  'Congo (Democratic Republic)': 'Democratic Republic of the Congo',
  'Eswatini (Swaziland)': 'Eswatini',
  'Taiwan (ROC)': 'Taiwan',
  'Palestine (State of)': 'Palestine',
  Micronesia: 'Micronesia, Federated States of',
  Brunei: 'Brunei Darussalam',
  'Cabo Verde': 'Cape Verde',
  Moldova: 'Moldova, Republic of',
  Laos: "Lao People's Democratic Republic",
  Syria: 'Syrian Arab Republic',
  'São Tomé and Príncipe': 'Sao Tome and Principe',
}

/** ISO2 → currency when iso-country-currency has no row (political / edge cases). */
const CURRENCY_MANUAL: Record<string, string> = {
  HK: 'HKD',
  TW: 'TWD',
  PS: 'USD',
}

const TIER_ECONOMICS = {
  1: {
    setupCostLow: 18000,
    setupCostHigh: 32000,
    ongoingCostPerEmployeePerYear: 3800,
    eorMarketRateMonthly: 599,
  },
  2: {
    setupCostLow: 20000,
    setupCostHigh: 40000,
    ongoingCostPerEmployeePerYear: 4500,
    eorMarketRateMonthly: 599,
  },
  3: {
    setupCostLow: 28000,
    setupCostHigh: 52000,
    ongoingCostPerEmployeePerYear: 5500,
    eorMarketRateMonthly: 699,
  },
} as const

function resolveAlpha2(displayName: string): string {
  const primary = LOOKUP_NAME[displayName] ?? displayName
  let code = countries.getAlpha2Code(primary, 'en')
  if (!code) {
    const stripped = displayName.replace(/\s*\([^)]*\)\s*/, '').trim()
    code = countries.getAlpha2Code(stripped, 'en')
  }
  if (!code) {
    throw new Error(
      `[countries] Could not resolve ISO code for "${displayName}". Add a LOOKUP_NAME alias in build-tier-countries.ts.`
    )
  }
  return code
}

function currencyForCode(code: string): string {
  const upper = code.toUpperCase()
  if (CURRENCY_MANUAL[upper]) return CURRENCY_MANUAL[upper]
  try {
    return getAllInfoByISO(upper).currency
  } catch {
    return 'USD'
  }
}

function seedFromTierRow(displayName: string, tier: 1 | 2 | 3): CountrySeed {
  const code = resolveAlpha2(displayName)
  const econ = TIER_ECONOMICS[tier]
  const tierLabel = tier === 1 ? 'low' : tier === 2 ? 'moderate' : 'high'
  return {
    code,
    name: displayName,
    flag: getEmojiFlag(code as Parameters<typeof getEmojiFlag>[0]),
    macroRegion: macroRegionFromCountryCode(code),
    tier,
    setupCostLow: econ.setupCostLow,
    setupCostHigh: econ.setupCostHigh,
    ongoingCostPerEmployeePerYear: econ.ongoingCostPerEmployeePerYear,
    eorMarketRateMonthly: econ.eorMarketRateMonthly,
    currency: currencyForCode(code),
    complexityFactors: [
      `GEMO Tier ${tier} (${tierLabel} complexity): thresholds and timelines follow the Country Concentration & Entity Transition Framework.`,
      'Operating language vs local language affects the concentration threshold (Language Buffer Rule).',
      'Model uses tier-typical setup and ongoing cost bands — refine with local quotes before decisions.',
    ],
    redFlags: [
      'Political, regulatory, or FX instability in your planning window?',
      'Below threshold, market-testing phase, or dispersed micro-teams across many countries?',
      'Missing local HR, payroll, tax, and legal capacity (or budget for outsourced GEMO-style support)?',
    ],
    languageBufferApplies: tier !== 1,
  }
}

export function buildTierCountries(): Country[] {
  const byCode = new Map<string, Country>()

  const rows: Array<{ tier: 1 | 2 | 3; name: string }> = [
    ...tierData.tier_1_countries.map((name) => ({ tier: 1 as const, name })),
    ...tierData.tier_2_countries.map((name) => ({ tier: 2 as const, name })),
    ...tierData.tier_3_countries.map((name) => ({ tier: 3 as const, name })),
  ]

  for (const { tier, name } of rows) {
    const seed = seedFromTierRow(name, tier)
    byCode.set(seed.code, buildCountryFromGemo(seed))
  }

  return Array.from(byCode.values()).sort((a, b) => a.name.localeCompare(b.name))
}
