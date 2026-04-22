import { getCountryData } from 'countries-list'
import type { CountryMacroRegion } from './types'

/** Transcontinental / policy: show under Europe filter in the picker. */
const EUROPE_PICKER_CODES = new Set([
  'RU',
  'BY',
  'UA',
  'MD',
  'GE',
  'AM',
  'AZ',
  'KZ',
  'KG',
  'TJ',
  'TM',
  'UZ',
  'XK',
])

/** Western Asia + North Africa style grouping for the MEA filter (ISO2). */
const MIDDLE_EAST_PICKER_CODES = new Set([
  'AE',
  'BH',
  'IL',
  'IQ',
  'IR',
  'JO',
  'KW',
  'LB',
  'OM',
  'PS',
  'QA',
  'SA',
  'SY',
  'YE',
  'TR',
])

/**
 * Map ISO2 to a coarse macro region for dropdown filters.
 * Uses annexare/countries-list continent codes (EU, AS, AF, NA, SA, OC, AN).
 */
export function macroRegionFromCountryCode(code: string): CountryMacroRegion {
  const upper = code.toUpperCase()
  if (EUROPE_PICKER_CODES.has(upper)) return 'europe'
  if (MIDDLE_EAST_PICKER_CODES.has(upper)) return 'middle_east_africa'

  try {
    const data = getCountryData(upper as Parameters<typeof getCountryData>[0])
    const cont = data.continent
    if (cont === 'AF') return 'middle_east_africa'
    if (cont === 'NA' || cont === 'SA') return 'americas'
    if (cont === 'EU') return 'europe'
    if (cont === 'OC' || cont === 'AN') return 'asia_pacific'
    if (cont === 'AS') return 'asia_pacific'
  } catch {
    // Unknown / user-assigned edge case
  }
  return 'asia_pacific'
}

export const MACRO_REGION_OPTIONS: {
  id: 'all' | CountryMacroRegion
  label: string
}[] = [
  { id: 'all', label: 'All regions' },
  { id: 'europe', label: 'Europe & Central Asia' },
  { id: 'americas', label: 'Americas' },
  { id: 'asia_pacific', label: 'Asia–Pacific' },
  { id: 'middle_east_africa', label: 'Middle East & Africa' },
]
