import { COUNTRIES } from '../src/lib/countries'

const out = COUNTRIES.map((c) => ({
  code: c.code,
  name: c.name,
  flag: c.flag,
  tier: c.tier,
  complexityLabel: c.complexityLabel,
  thresholdNative: c.thresholdNative,
  thresholdNonNative: c.thresholdNonNative,
  setupMonthsLow: c.setupMonthsLow,
  setupMonthsHigh: c.setupMonthsHigh,
}))

console.log(JSON.stringify(out, null, 2))
