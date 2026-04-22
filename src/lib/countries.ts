import { buildTierCountries } from './build-tier-countries'

/** All markets from `src/data/gemo-country-tiers.json`, with GEMO tier thresholds and tier-based economics templates. */
export const COUNTRIES = buildTierCountries()
