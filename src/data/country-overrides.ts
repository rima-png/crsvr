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
  FR: {
    verified: false,
    setupCostLow: 8000,
    setupCostHigh: 18000,
    terminationCostPerEmployee: 15000,
    terminationBasisNote:
      'Rupture conventionnelle (mutual termination) is the dominant exit path. Statutory indemnity is 0.25 months\' gross salary per year of service for the first 10 years (0.33 thereafter) — a 3-year tenure yields ~0.75 months as a floor, but settlements for managerial staff commonly land at 1–3 months\' salary plus negotiated uplifts. The 2026 Social Security Financing Act (LFSS) raised the employer contribution on rupture conventionnelle indemnities from 30% to 40%, materially lifting the true exit cost. Figure based on a ~€5.5k/month mid-level role at ~3 years tenure: base indemnity + negotiated uplift + 40% employer contribution + accrued congés payés. Confirm with local counsel before any decision.',
    thresholdJustification:
      'Tier 2 default (18 native / 25 non-native) applies. SAS/SASU formation is cheap on paper (~€260 in mandatory admin fees, no minimum share capital — €1 symbolic is permissible) but end-to-end setup with accountant, URSSAF registration, banking, convention collective identification, and handbook typically lands €8k–€18k — below the Tier 2 default range. The heavier factor is ongoing: employer social charges run ~42–45% of gross (health 13%, old-age 8.55% up to €3,666/mo, family allowances ~5.25%, unemployment, work accident 0.77%+), applied equally to EOR margins so not shifting break-even. Compliance trigger to watch: Comité Social et Économique (CSE) becomes mandatory at 11 FTE sustained for 12 consecutive months — which lands before the 18/25 recommendation, so entity-track teams crossing 11 heads take on a CSE election and consultation obligation well before the economic crossover. 2026 risk note: LFSS raised the employer contribution on rupture conventionnelle from 30% to 40%, quietly pushing up the cost of post-probation terminations for entity-holders; EOR providers centralise and price this in. Expect the effective threshold to drift upward by 1–2 employees as entities price in the new exit cost.',
  },
  ES: {
    verified: false,
    setupCostLow: 6000,
    setupCostHigh: 14000,
    terminationCostPerEmployee: 12000,
    terminationBasisNote:
      'Spanish dismissals split into despido procedente (fair objective dismissal — 20 days\' salary per year of service, capped 12 months) and despido improcedente (unfair — 33 days per year for post-12-February-2012 seniority, capped 24 months; 45 days per year for pre-2012 tenure). A high share of terminations are challenged and reclassified as improcedente at conciliation, so the practical planning figure sits closer to the 33-day rate. Figure based on a ~€3,500/month mid-level role at ~3 years tenure: blended indemnity across procedente/improcedente outcomes + 15 days\' notice pay (objective dismissal) + accrued holiday. Confirm with local counsel before any decision.',
    thresholdJustification:
      'Tier 2 default (18 native / 25 non-native) applies. Sociedad Limitada (SL) formation is mid-weight: notary + commercial registry + name certificate total ~€380 in mandatory fees, with legal/formation services typically adding €3k–€5k. Since Law 18/2022 the legal minimum share capital is €1 (previously €3,000), though €3,000 remains the recommended practical level. End-to-end setup with accountant, payroll, Social Security registration, and handbook lands €6k–€14k — below the Tier 2 default range. The heavier factor is ongoing: employer Social Security contributions run ~30–36% of gross (general rate 30.57% + FOGASA 0.20% + training 0.10% + 1.5%+ occupational accident, varying by risk class), applied equally to EOR margins so not shifting break-even. Compliance trigger to watch: elected employee delegates (delegados de personal) become mandatory in workplaces of 11+ employees (1 delegate at 11–30, 3 at 31–49); the formal comité de empresa only arrives at 50+. So the 11-employee delegate-election obligation lands before the 18/25 recommendation, and entity-track teams need an election protocol well before the economic crossover. 2026 risk note: the Additional Solidarity Contribution (ASC) now applies to employer contributions on earnings above the maximum Social Security base (bases rising ~4% in 2026), raising the cost of senior hires for entities and EOR providers alike — roughly neutral to the threshold but worth flagging for high-salary hiring plans.',
  },
  NL: {
    verified: false,
    setupCostLow: 5000,
    setupCostHigh: 12000,
    terminationCostPerEmployee: 9000,
    terminationBasisNote:
      'Transitievergoeding (statutory transition payment) is 1/3 of monthly salary per year of service from day one of employment, including 8% vakantiegeld and averaged variable pay. Figure based on a ~€5,000/month mid-level role at ~3 years tenure: statutory transition payment (~€5,000) + notice period pay (1 month at 0–5 years tenure, minus 1 week if the UWV route is used) + accrued holiday allowance. Most Dutch exits settle via vaststellingsovereenkomst (mutual termination agreement) which typically lands 1.5–2× the statutory minimum to secure a clean release. Dismissals for business-economic reasons or long-term illness require prior UWV permit (4-week validity once granted); performance-based dismissals go via the kantonrechter (subdistrict court). Confirm with local counsel before any decision.',
    thresholdJustification:
      'Tier 1 default (10 native / 14 non-native) applies. BV formation is fast and cheap for a Tier 1 market: notary €500–€1,500 + KVK registration €85.15 + articles-of-association drafting, with total end-to-end setup (accountant, payroll, banking, tax authority registration) landing €5k–€12k — below the Tier 1 default range. Minimum share capital is €0.01, so no meaningful capital lockup. Employer social security at ~23.59% of gross (WIA/WAO 6.27–7.63%, WHK 0.38–6.08%, ZVW, WW-Awf) is capped at a €79,409 annual salary — a harder ceiling than most EU markets — and applies equally to EOR margins, so does not shift break-even. Compliance trigger to watch: at 10+ employees a Personeelsvertegenwoordiging (PVT) representation body becomes required, and at 50+ a full Ondernemingsraad (works council) is mandatory under the Works Councils Act. The 10-employee PVT requirement coincides exactly with the Tier 1 threshold — entity-track teams hit that compliance layer at the same moment the economic case converges. 2026 risk note: a government proposal would restrict UWV compensation for transitievergoedingen to employers with fewer than 25 employees from 1 July 2026 — once an entity crosses 25 heads, the transition-payment cost is no longer recoverable from UWV, effectively raising the true exit cost for mid-sized entities. Post-July-2026 expect the effective threshold to drift upward by 1–2 employees.',
  },
  IN: {
    verified: false,
    thresholdNative: 22,
    thresholdNonNative: 28,
    setupCostLow: 300000,
    setupCostHigh: 700000,
    terminationCostPerEmployee: 350000,
    terminationBasisNote:
      'Retrenchment compensation (15 days\' average pay per completed year, Industrial Disputes Act / Industrial Relations Code 2020) + gratuity + notice pay + leave encashment. Gratuity eligibility is in flux: the Payment of Gratuity Act 1972 requires 5 years\' continuous service in establishments of 10+ employees; the Code on Social Security 2020 (implemented 21 November 2025; Central Rules still in draft comment as of Q1 2026) entitles employees to gratuity after 1 year. Figure based on a mid-level role at ~₹75,000/month gross at ~3 years tenure assuming the Code\'s 1-year gratuity rule applies: retrenchment ~₹1.3 lakh + gratuity ~₹1.3 lakh + 1 month notice + leave encashment. Multi-state hires add state-level settlement variability (Maharashtra, Karnataka, Tamil Nadu and Delhi each have distinct regimes). Confirm with local counsel before any decision.',
    thresholdJustification:
      'Tier 3 default is 30 (native) / 43 (non-native); India lowered to 22 / 28 because the EOR-fee-to-salary ratio is materially higher than in European Tier 3 markets — a $599/month EOR fee sits at ~60–70% of a mid-level Indian gross salary (vs ~10% in UK), so the monthly EOR-vs-entity arithmetic converges at smaller headcount. Private Limited Company formation is cheap by government fee (MCA filing ₹0 up to ₹15 lakh authorised capital, name reservation ₹1,000, DSC ~₹1,500/director, DIN ₹500) but realistic end-to-end setup with Chartered Accountant, legal, company secretary, state-level Shops & Establishments registration, Professional Tax, and Labour Welfare Fund typically lands ₹3–7 lakh (~$3,600–$8,400). Employer statutory load is ~13–14% of gross (EPF 12% of basic+DA with 8.33% employer share directed to EPS capped at ₹1,250/month; ESIC 3.25% employer only applies below ₹21,000/month wages so rarely for white-collar; state PT and LWF), materially lighter than EU markets. Works committee only becomes mandatory at 100+ workers under the Industrial Relations Code, so internal-rep burden lands well above the threshold. 2026 regulatory note: the four Labour Codes (Wages, Industrial Relations, Social Security, OSH) were implemented 21 November 2025; draft Central Rules issued 30 December 2025 with 30–45 day comment windows, so procedural detail is still settling. State variation is the real caveat: distributed hiring across 2+ states typically pushes the effective threshold back toward the Tier 3 default — the 22/28 recommendation assumes concentration in a single state (most commonly Karnataka, Maharashtra or Telangana for tech hiring).',
  },
}
