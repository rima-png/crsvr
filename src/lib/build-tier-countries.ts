import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'
import { getAllInfoByISO } from 'iso-country-currency'
import tierData from '@/data/gemo-country-tiers.json'
import fxSnapshot from '@/data/fx-snapshot.json'
import { getEmojiFlag } from 'countries-list'
import type { Country, DataConfidence } from './types'
import { buildCountryFromGemo, type CountrySeed } from './gemo'
import { macroRegionFromCountryCode } from './macro-region'
import { COUNTRY_OVERRIDES } from '@/data/country-overrides'

/** Date stamp of the committed FX snapshot — surfaced in the memo's "Your assumptions" block. */
export const FX_SNAPSHOT_DATE: string = fxSnapshot.snapshotDate

function fxToUsdFor(currency: string): number | undefined {
  const rates = fxSnapshot.rates as Record<string, number>
  return rates[currency.toUpperCase()]
}

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

/**
 * Tier defaults expressed as **USD-equivalent** values. These get converted to each
 * country's local currency at build time (using the FX snapshot) before any
 * per-country override is applied. Without that conversion the templates render as
 * raw local-currency numbers — fine for USD/GBP/EUR, but absurd for INR (₹28k ≈ $336)
 * or MXN (MX$20k ≈ $1,180). See `applyFxToTierEcon` below.
 */
const TIER_ECONOMICS_USD = {
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

/**
 * Convert the USD-denominated tier-default economics into a country's local currency.
 * `fxToUsd` is "USD per 1 unit of local currency" — to go USD → local we divide.
 * Falls back to USD-equivalent when no FX rate is available (better than rendering
 * a raw USD number as if it were local currency).
 */
function applyFxToTierEcon(tier: 1 | 2 | 3, fxToUsd: number | undefined) {
  const usd = TIER_ECONOMICS_USD[tier]
  const rate = fxToUsd ?? 1.0
  return {
    setupCostLow: Math.round(usd.setupCostLow / rate),
    setupCostHigh: Math.round(usd.setupCostHigh / rate),
    ongoingCostPerEmployeePerYear: Math.round(usd.ongoingCostPerEmployeePerYear / rate),
    eorMarketRateMonthly: Math.round(usd.eorMarketRateMonthly / rate),
  }
}

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
  const tierLabel = tier === 1 ? 'low' : tier === 2 ? 'moderate' : 'high'
  const currency = currencyForCode(code)
  const fxToUsd = fxToUsdFor(currency)
  // FX-converted tier defaults; per-country overrides win on top of these.
  const econ = applyFxToTierEcon(tier, fxToUsd)
  const override = COUNTRY_OVERRIDES[code]
  const dataConfidence: DataConfidence = override
    ? override.verified
      ? 'verified'
      : 'baseline'
    : 'tier_default'

  return {
    code,
    name: displayName,
    flag: getEmojiFlag(code as Parameters<typeof getEmojiFlag>[0]),
    macroRegion: macroRegionFromCountryCode(code),
    tier,
    setupCostLow: override?.setupCostLow ?? econ.setupCostLow,
    setupCostHigh: override?.setupCostHigh ?? econ.setupCostHigh,
    ongoingCostPerEmployeePerYear:
      override?.ongoingCostPerEmployeePerYear ?? econ.ongoingCostPerEmployeePerYear,
    eorMarketRateMonthly: econ.eorMarketRateMonthly,
    currency,
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
    thresholdNative: override?.thresholdNative,
    thresholdNonNative: override?.thresholdNonNative,
    thresholdJustification: override?.thresholdJustification,
    terminationCostPerEmployee: override?.terminationCostPerEmployee,
    terminationBasisNote: override?.terminationBasisNote,
    fxToUsd,
    dataConfidence,
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
