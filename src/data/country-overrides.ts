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
  GB: {
    verified: false,
    setupCostLow: 5000,
    setupCostHigh: 15000,
    terminationCostPerEmployee: 6000,
    terminationBasisNote:
      'Statutory redundancy pay (weekly cap £751 from 6 April 2026, max £22,530 at 20 years) + statutory notice + accrued holiday at ~3 years tenure. Contractual PILON and extended notice periods push this higher for senior roles. Employment Rights Act 2025 reduces the unfair-dismissal qualifying period from 2 years to 6 months from 1 January 2027 — post-2027 terminations will carry higher risk and cost. Based on GOV.UK and ACAS guidance — confirm with local counsel.',
    thresholdJustification:
      'UK setup is fast and relatively cheap for a Tier 1 market: Companies House digital incorporation is same-day (fee £100 from 1 February 2026), PAYE registration is free, and end-to-end setup (accountant, payroll, banking, employment handbook) typically lands at £5k–£15k — below the Tier 1 default range. Employer NI sits at 15% on earnings above £5,000 (frozen until 2030–31), material but equally applied to EOR fees. The 10-employee (native) / 14-employee (non-native) threshold applies a commitment and operational-readiness buffer on top of the pure economic crossover (~6–8 employees). Post-2027 risk note: the Employment Rights Act 2025 drops the unfair-dismissal qualifying period from 2 years to 6 months from 1 January 2027. Hires made after 1 July 2026 will clear probation under the new rule — each becomes a tribunal exposure from month 7 (compensation capped at 52 weeks\' pay or ~£115k), which EOR providers absorb but entities do not. Expect the effective threshold to drift upward by 2–3 employees post-2027 as entities price in that risk.',
  },
  DE: {
    verified: false,
    setupCostLow: 10000,
    setupCostHigh: 20000,
    terminationCostPerEmployee: 18000,
    terminationBasisNote:
      'Customary settlement severance ~0.5 months\' gross salary per year of service at ~3 years tenure (higher in contested Kündigungsschutzgesetz claims — courts often award up to 1 month per year) + notice period pay (1 month end-of-month at 2+ years tenure, rising to 2 months at 5+ years) + accrued holiday. Based on a mid-level role at ~€5.5k monthly gross. No statutory severance for ordinary dismissal if due process is followed, but KSchG protection applies after 6 months tenure once the establishment exceeds 10 FTE-weighted employees (part-timers count 0.5/0.75/1.0 at ≤20/20–30/>30 hrs) — so contested terminations almost always settle. Confirm with local counsel before any decision.',
    thresholdJustification:
      'Tier 2 default (18 native / 25 non-native) applies. GmbH formation is notary-led and reliable (4–8 weeks, notary €800–1,500 + commercial register €150 + trade licence €15–65); end-to-end setup including accountant, payroll registration, banking, and handbook typically lands €10k–€20k, below the Tier 2 default range. The €25,000 minimum share capital is a refundable capital deposit (not a sunk expense), though it does tie up working capital. The larger consideration is employment-law density: Kündigungsschutzgesetz (KSchG) protection kicks in after 6 months of tenure once a business exceeds 10 regular employees (FTE-weighted), and Betriebsrat (works council) formation can be triggered by employees in any workplace with 5+ permanent staff — meaning a material compliance burden arrives well before the pure-economic crossover. Employer social security at ~21% of gross (pension 9.3%, health 7.3% + ~1.45% avg supplemental, long-term care 1.8%, unemployment 1.3%, statutory accident 1.2–3%) applies equally to EOR margins, so does not shift break-even — though new 2026 ceilings (€5,812.50/mo health, €8,450/mo pension) raise the cap on senior hires. The 18/25 threshold reflects the operational readiness needed to run a German entity compliantly, not a pure cost crossover.',
  },
}
