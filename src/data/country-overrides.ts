/**
 * Per-country overrides to the GEMO tier-template economics.
 *
 * Keyed by ISO-3166 alpha-2 code. Keys missing from this map inherit tier defaults.
 *
 * Confidence model (drives the badge on the results page + PDF memo):
 * - `verified: true`  → signed off against advisor-grade data (green badge).
 * - `verified: false` → drafted from public sources, pending advisor review (amber).
 * - No entry          → tier defaults only (grey "regional averages" disclaimer).
 *
 * Numeric fields here are denominated in the country's **local currency** (BRL, INR, etc.).
 * Tier-template defaults in build-tier-countries.ts are USD-equivalent and get FX-converted
 * to local currency at build time before any override is merged. So:
 *   - When you have local-source data, override.
 *   - When you don't, the FX-converted tier default is a reasonable conservative fallback.
 *   - You only need an `ongoingCostPerEmployeePerYear` override if the FX-converted default
 *     diverges meaningfully from local advisor-quoted costs (typically only matters when
 *     local labour rates for accountants/payroll deviate sharply from US rates).
 *
 * Wave 1 (verified): BR, US.
 * Wave 2 (baseline): GB, DE, FR, ES, NL, IN, PL, MX.
 * Wave 3 will flip Wave-2 entries to `verified: true` as advisors sign off, country by country.
 *
 * Copy voice: plain English, no legal-jargon walls. Keep dates, percentages, amounts,
 * and statute names intact, but pair them with concrete consequences a buyer can
 * read in one pass. Local-language terms (Kündigungsschutzgesetz, rupture
 * conventionnelle, etc.) stay because they're searchable, but every one is
 * introduced via its English meaning first.
 */

import type { ThresholdJustification, UpcomingChange } from '@/lib/types'

export interface CountryOverride {
  verified: boolean
  /** ISO date (YYYY-MM-DD) when this entry was last reviewed against source data or an advisor.
   *  Surfaced in the memo + UI; auto-flags as "refresh due" when >12 months old. */
  lastReviewedDate: string
  thresholdNative?: number
  thresholdNonNative?: number
  setupCostLow?: number
  setupCostHigh?: number
  ongoingCostPerEmployeePerYear?: number
  terminationCostPerEmployee?: number
  terminationBasisNote?: string
  /** Plain string for short notes, or structured shape (summary + sections) for rich breakdowns. */
  thresholdJustification?: string | ThresholdJustification
  /** Legislated-or-confirmed regulatory changes that have not yet taken effect.
   *  Past-effective items belong in the prose above, not here. */
  upcomingChanges?: UpcomingChange[]
}

export const COUNTRY_OVERRIDES: Record<string, CountryOverride> = {
  AR: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    thresholdJustification:
      'We pitch Argentina at 12 (local language) and 18 (other languages). The LATAM mid-market rarely scales beyond 10 to 15 employees inside a single country, so the conversation about EOR-versus-entity needs to start there, not at the academic 30 ceiling. Sales experience puts useful conversations as low as 7. Tier 3 economics still apply (heavy payroll tax load, FX exposure, complex termination regime), so a planning conversation matters more than a hard switch.',
  },
  BR: {
    verified: true,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupCostLow: 50000,
    setupCostHigh: 120000,
    terminationCostPerEmployee: 50000,
    terminationBasisNote:
      'A typical 3-year exit blends an FGTS 40% penalty, accrued holiday plus the one-third holiday bonus, the proportional 13th-month salary, and notice pay. Advisor estimate in BRL. Confirm with local counsel before any decision.',
    thresholdJustification:
      'We pitch Brazil at 12 (local language) and 18 (other languages). The payroll tax load is heavy: FGTS, INSS, and the 13th-month salary add up to roughly 70% on top of gross pay, so the ongoing entity cost lands earlier than a generic Tier 3 template assumes. The crossover comes forward by 6 to 9 months, which is part of why the conversation is worth opening at smaller headcount than the old academic ceiling.',
  },
  CO: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    thresholdJustification:
      'We pitch Colombia at 12 (local language) and 18 (other languages). Like the rest of LATAM, growth-stage teams typically operate with 8 to 15 employees inside a single country, so opening the conversation at 12 catches the buyers EOR economics are actually starting to bite for. Tier 3 economics apply: meaningful payroll load, multi-state complexity is absent, and the academic 30-employee ceiling sat well above where most mid-market buyers ever hit.',
  },
  MX: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupCostLow: 70000,
    setupCostHigh: 160000,
    terminationCostPerEmployee: 200000,
    terminationBasisNote:
      'An unjustified dismissal under Article 48 of the Federal Labour Act (Ley Federal del Trabajo, "LFT") costs the constitutional indemnity of 3 months of integrated daily salary (SDI), plus 20 days per year of service (re-affirmed in the 24 December 2024 LFT reform for indefinite-term contracts), plus a seniority premium of 12 days per year (capped at twice the UMA or minimum wage per day), plus a proportional 15-day Christmas bonus (aguinaldo), plus proportional holiday and the 25% holiday bonus (prima vacacional). Figure based on a mid-level role at around MXN 40,000 per month gross at 3 years of service: around MXN 120k constitutional indemnity, MXN 80k for the 20-day accrual, MXN 5k seniority premium, plus accruals. Most Mexican exits settle with a resignation plus a negotiated finiquito, or a mutual termination registered with the Junta de Conciliación, to avoid the new Tribunal Laboral procedure (the 2019 labour reform rolled out state by state through 2022). Pre-2022 Junta de Conciliación cases are still being wound down, and the new conciliation-first rule adds 45 days before any labour-court filing.',
    thresholdJustification: {
      summary:
        'We pitch Mexico at 12 (local language) and 18 (other languages). Setup costs sit above the tier template because notary fees and registrations are real, the employer load is among the heaviest in Latin America, and union-contract obligations land just above the threshold.',
      sections: [
        {
          heading: 'Setup',
          body: 'SA de CV or S. de R.L. de C.V. formation costs more than the tier template. Notary MXN 17k to 20k, public-registry fees MXN 1.5k to 5k (varies by state), legal counsel MXN 5k to 20k, plus RFC, IMSS, INFONAVIT, and SAT registrations and the first-year accountant retainer. End-to-end usually lands MXN 70k to 160k (around $3.5k to $8k).',
        },
        {
          heading: 'Ongoing cost',
          body: 'Per-employee admin overhead inherits the Tier 2 default of around MXN 76k per year (around $4.5k), which fits SA de CV with a monthly accountant retainer, IMSS and SAT filings, and quarterly provisional taxes. Employer statutory load is among the heaviest in Latin America at 30% to 40% of integrated base salary (SBC): IMSS around 20% to 25%, INFONAVIT 5%, SAR retirement 2%, state payroll tax (ISN) 1% to 3% varying by state. Plus the mandatory Christmas bonus (aguinaldo, 15-day minimum), holiday bonus (prima vacacional, 25% on holiday), and profit-sharing (PTU), the last capped at 3 months\' salary or the 3-year average under the 2021 outsourcing reform (the Supreme Court upheld the cap as constitutional in April 2024).',
        },
        {
          heading: 'Compliance triggers',
          body: 'Compliance obligations cluster above the threshold. Union-contract (Contrato Colectivo) obligations become a live question at 20+ employees post the 2019 reform. Internal committees (Comisión Mixta de Seguridad e Higiene, Comisión Mixta de Capacitación) apply from 1 employee but scale in complexity at 50+.',
        },
        {
          heading: 'State variation',
          body: 'Mexican labour law is federal, not state-based. Spreading hiring across CDMX, Nuevo León, or Jalisco does not fragment the core regulatory picture. Only the state payroll tax rate (ISN, 1% to 3%) varies meaningfully by location.',
        },
      ],
    },
  },
  TR: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    thresholdJustification:
      'We pitch Turkey at 12 (local language) and 18 (other languages). Like the rest of the Tier 3 group, the old 30 / 43 ceiling sat above where the conversation actually starts to matter for tech and services hiring concentrated in a single country. Tier 3 economics still apply: meaningful employer social-security load, FX exposure, and a complex severance regime. Confirm with local counsel before any decision.',
  },
  US: {
    verified: true,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 10,
    thresholdNonNative: 14,
    thresholdJustification:
      'We pitch the US at the Tier 1 default of 10 (local language) and 14 (other languages). The earlier 25 / 35 figure was correct for the academic operational-readiness ceiling assuming hiring spread across multiple states, but it gated the largest lead pool against the calculator. State complexity is real (each state adds registration, tax filings, and compliance overhead) but it should sit as a flag on the result, not as a threshold raiser. If you are hiring across multiple states, expect operational complexity and cost to land closer to 40 to 50 employees before the entity case fully closes.',
  },
  AU: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 6,
    thresholdNonNative: 10,
    thresholdJustification:
      'We pitch Australia at 6 (local language) and 10 (other languages). The pure cost crossover for a Tier 1 market sits around 6 to 8 employees. The number isn\'t "switch today", it\'s "start the conversation now while the maths is calm and you have time to plan the move properly."',
  },
  GB: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 6,
    thresholdNonNative: 10,
    setupCostLow: 5000,
    setupCostHigh: 15000,
    terminationCostPerEmployee: 6000,
    terminationBasisNote:
      'Redundancy pay (capped at £751 per week from 6 April 2026, up to £22,530 after 20 years of service), notice pay, and any unused holiday. Senior contracts with payment-in-lieu-of-notice or longer notice periods cost more. From 1 January 2027 the rules tighten. Workers will be able to claim unfair dismissal after 6 months of service instead of 2 years, and the legal cap on tribunal payouts (£118,223 today, going to £123,543 in April 2026) is removed entirely. Any disputed exit after a worker\'s first 6 months becomes uncapped risk. Based on GOV.UK and ACAS guidance; confirm with local counsel.',
    thresholdJustification: {
      summary:
        'The UK is a Tier 1 market: fast, cheap to set up, and the pure cost crossover lands at around 6 to 8 employees. We recommend opening the planning conversation at 6 (local language) and 10 (other languages), at or just below the cost crossover. From 2027, new dismissal rules push that conversation 2 to 3 employees higher.',
      sections: [
        {
          heading: 'Setup',
          body: 'Companies House registers a new company the same day (£100 fee from 1 February 2026), PAYE registration is free, and end-to-end setup (accountant, payroll, banking, employment handbook) usually lands £5k to £15k. That is below the Tier 1 default range.',
        },
        {
          heading: 'Ongoing cost',
          body: 'Employer National Insurance sits at 15% on earnings above £5,000, frozen until the 2030 to 2031 tax year. Material, but the same load applies inside EOR fees, so it does not shift the break-even.',
        },
        {
          heading: 'Why 6 or 10',
          body: 'The pure cost crossover sits at 6 to 8 employees. We pitch the threshold at 6 (local language) and 10 (other languages), at or just below the cost crossover. The number isn\'t "switch today", it\'s "start mapping the move now, while the maths is still calm". A planned transition costs less than a reactive one.',
        },
        {
          heading: 'Post-2027 risk',
          body: 'From 1 January 2027, workers can claim unfair dismissal after 6 months of service, not 2 years, and the legal cap on tribunal payouts is removed. Anyone hired from around July 2026 onwards will clear the new 6-month bar by January 2027, so from month 7 each one becomes an uncapped tribunal risk. EOR providers absorb that risk for you. If you run your own entity, you carry it. Expect the threshold to drift 2 to 3 employees higher as entities price the new risk in.',
        },
      ],
    },
    upcomingChanges: [
      {
        effectiveDate: '2027-01-01',
        title: 'Employment Rights Act 2025: shorter qualifying period, no payout cap',
        summary:
          'From 1 January 2027, two big UK rules change together. Workers can claim unfair dismissal after 6 months of service instead of 2 years. And the legal cap on tribunal payouts is removed (today £118,223, rising to £123,543 in April 2026, or 52 weeks\' pay if lower). For an entity, every disputed exit after a worker\'s first 6 months becomes uncapped risk. EOR providers carry this exposure for you. If you run your own entity, you carry it yourself. Expect the UK threshold to drift 2 to 3 employees higher as the new risk gets priced in.',
        impact: 'raises_threshold',
        source: 'https://www.gov.uk/government/publications/employment-rights-bill',
      },
    ],
  },
  DE: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupCostLow: 10000,
    setupCostHigh: 20000,
    terminationCostPerEmployee: 18000,
    terminationBasisNote:
      'A typical 3-year exit settles around 0.5 months of gross salary per year of service, rising to about 1 month per year if the dismissal is contested under unfair-dismissal protection (Kündigungsschutzgesetz, "KSchG"). On top of that you pay statutory notice (1 month at 2+ years of service, 2 months at 5+) and accrued holiday. Based on a mid-level role at around €5,500 per month gross. There is no automatic severance for an ordinary dismissal if you follow due process, but KSchG protection kicks in after 6 months of tenure once the workplace has more than 10 FTE-weighted employees (part-timers count as 0.5, 0.75 or 1.0 at up to 20 hours, 20 to 30 hours, and over 30 hours). In practice almost every contested termination settles. Confirm with local counsel before any decision.',
    thresholdJustification: {
      summary:
        'We pitch Germany at 12 (local language) and 18 (other languages). Setup is mid-weight; the heavier factor is German employment-law density, which arrives well before the cost crossover.',
      sections: [
        {
          heading: 'Setup',
          body: 'GmbH formation runs through a notary and is reliable. Expect 4 to 8 weeks. Notary €800 to €1,500, commercial register €150, trade licence €15 to €65. End-to-end setup with an accountant, payroll registration, banking, and a handbook typically lands €10k to €20k. That sits below the Tier 2 default range.',
        },
        {
          heading: 'Capital',
          body: 'GmbH requires €25,000 minimum share capital. It is a refundable deposit, not a sunk cost, but it does tie up working capital.',
        },
        {
          heading: 'Employment-law triggers',
          body: 'Unfair-dismissal protection (Kündigungsschutzgesetz, "KSchG") kicks in after 6 months of service once you have more than 10 regular employees (FTE-weighted). A works council (Betriebsrat) can be triggered in any workplace with 5 or more permanent staff. So a real compliance burden arrives well before the cost crossover.',
        },
        {
          heading: 'Ongoing cost',
          body: 'Employer social-security contributions run around 21% of gross pay (pension 9.3%, health 7.3% plus around 1.45% supplemental, long-term care 1.8%, unemployment 1.3%, accident insurance 1.2% to 3%). The same load sits inside EOR fees, so does not shift the break-even. The 2026 contribution ceilings rise to €5,812.50 per month for health and €8,450 per month for pension, which raises the cost cap on senior hires.',
        },
      ],
    },
  },
  FR: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupCostLow: 8000,
    setupCostHigh: 18000,
    terminationCostPerEmployee: 15000,
    terminationBasisNote:
      'Most French exits go through a mutual-termination agreement (rupture conventionnelle). The minimum legal indemnity is 0.25 months of gross salary per year of service for the first 10 years, then 0.33 thereafter. For a 3-year tenure that floor lands at around 0.75 months. In practice, settlements for managerial staff commonly run 1 to 3 months of salary plus negotiated uplifts. The 2026 Social Security Financing Act (LFSS) raised the employer charge on rupture conventionnelle payouts from 30% to 40%, so the true cost is now higher. Figure based on a mid-level role at around €5,500 per month gross: base indemnity, negotiated uplift, 40% employer contribution, and accrued paid holiday (congés payés). Confirm with local counsel before any decision.',
    thresholdJustification: {
      summary:
        'We pitch France at 12 (local language) and 18 (other languages). Setup is cheap on paper but lands at €8k to €18k all-in. The heavier factor is the 42% to 45% employer social load, and the 11-employee works-council trigger arrives just below the threshold.',
      sections: [
        {
          heading: 'Setup',
          body: 'SAS or SASU formation is cheap on paper (around €260 in mandatory admin fees, no real minimum share capital, €1 is enough). The honest end-to-end cost with an accountant, URSSAF registration, banking, identifying your collective bargaining agreement (convention collective), and a handbook typically lands €8k to €18k. That is below the Tier 2 default range.',
        },
        {
          heading: 'Ongoing cost',
          body: 'Employer social charges run 42% to 45% of gross pay (health 13%, old-age pension 8.55% up to €3,666 per month, family allowances around 5.25%, plus unemployment and work-accident contributions of 0.77%+). The same load sits inside EOR fees, so it does not shift the break-even, it just makes France expensive to hire in either way.',
        },
        {
          heading: 'Compliance trigger to watch',
          body: 'A Social and Economic Committee (Comité Social et Économique, "CSE") becomes mandatory once you sustain 11 FTE for 12 consecutive months. That lands before the 18-employee recommendation, so any entity that crosses 11 heads picks up CSE election and consultation obligations well before the economic crossover.',
        },
        {
          heading: 'Post-2026 risk',
          body: 'The 2026 Social Security Financing Act (LFSS) raised the employer charge on rupture conventionnelle payouts from 30% to 40%, quietly pushing up the cost of post-probation exits for entities. EOR providers centralise and price this in. Expect the effective threshold to drift up by 1 to 2 employees as entities price the new exit cost in.',
        },
      ],
    },
  },
  ES: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupCostLow: 6000,
    setupCostHigh: 14000,
    terminationCostPerEmployee: 12000,
    terminationBasisNote:
      'Spanish dismissals split into two paths. A fair objective dismissal (despido procedente) pays 20 days of salary per year of service, capped at 12 months. An unfair dismissal (despido improcedente) pays 33 days per year for service since 12 February 2012, capped at 24 months, plus 45 days per year for any tenure before then. In practice, a large share of dismissals get challenged and reclassified as improcedente at conciliation, so plan around the 33-day rate. Figure based on a mid-level role at around €3,500 per month gross at 3 years of service: a blended indemnity, 15 days of notice pay (objective dismissal), and accrued holiday. Confirm with local counsel before any decision.',
    thresholdJustification: {
      summary:
        'We pitch Spain at 12 (local language) and 18 (other languages). Setup is mid-weight; the ongoing social-security load is the heavier factor and sits equally inside EOR fees. The 11-employee delegate-election obligation lands just below the threshold.',
      sections: [
        {
          heading: 'Setup',
          body: 'Sociedad Limitada (SL) formation is mid-weight. Notary plus commercial registry plus name certificate total around €380 in mandatory fees. Legal and formation services typically add €3k to €5k. Since Law 18/2022 the legal minimum share capital is €1 (down from €3,000), though €3,000 is still the recommended practical level. End-to-end setup with an accountant, payroll, Social Security registration, and a handbook lands €6k to €14k. That is below the Tier 2 default range.',
        },
        {
          heading: 'Ongoing cost',
          body: 'Employer Social Security contributions run 30% to 36% of gross pay (general rate 30.57% plus FOGASA 0.20%, training 0.10%, and a 1.5%+ occupational-accident contribution that varies by risk class). The same load sits inside EOR fees, so does not shift the break-even.',
        },
        {
          heading: 'Compliance trigger to watch',
          body: 'Elected employee delegates (delegados de personal) become mandatory in workplaces of 11 or more employees (1 delegate at 11 to 30, 3 at 31 to 49). A full works committee (comité de empresa) only arrives at 50+. So the 11-employee delegate-election obligation lands before the 18-employee recommendation, and entity-track teams need an election protocol well before the economic crossover.',
        },
        {
          heading: 'Post-2026 risk',
          body: 'The Additional Solidarity Contribution (ASC) now applies to employer contributions on earnings above the maximum Social Security base (bases are rising around 4% in 2026). This raises the cost of senior hires for entities and EOR providers alike, so it is roughly neutral to the threshold, but worth flagging for high-salary hiring plans.',
        },
      ],
    },
  },
  IE: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 6,
    thresholdNonNative: 10,
    thresholdJustification:
      'We pitch Ireland at 6 (local language) and 10 (other languages). Tier 1 economics: pure cost crossover sits around 6 to 8 employees, and the conversation is worth opening at or just below that. The 6 / 10 number isn\'t "switch today", it\'s "start mapping the move now". A planned transition costs less than a reactive one.',
  },
  NL: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupCostLow: 5000,
    setupCostHigh: 12000,
    terminationCostPerEmployee: 9000,
    terminationBasisNote:
      'The statutory transition payment (transitievergoeding) is one-third of monthly salary per year of service, counted from day one of employment, and includes the 8% holiday allowance (vakantiegeld) plus any averaged variable pay. Figure based on a mid-level role at around €5,000 per month gross at 3 years of service: a statutory transition payment of roughly €5,000, 1 month of notice pay (the standard at 0 to 5 years of service, minus 1 week if you go via the UWV permit route), and accrued holiday allowance. Most Dutch exits settle through a mutual-termination agreement (vaststellingsovereenkomst) at 1.5 to 2 times the statutory minimum, in exchange for a clean release. Dismissals for business or economic reasons or long-term illness need a prior UWV permit (valid for 4 weeks once granted). Performance-based dismissals go through the subdistrict court (kantonrechter). Confirm with local counsel before any decision.',
    thresholdJustification: {
      summary:
        'We pitch the Netherlands at 12 (local language) and 18 (other languages). Setup is fast and cheap, but Dutch employment-law density (a representation body becomes mandatory at 10 employees) and the 2026 UWV change for entities crossing 25 heads mean the planning conversation belongs above the Tier 1 default.',
      sections: [
        {
          heading: 'Setup',
          body: 'BV formation is fast and cheap by Tier 1 standards. Notary €500 to €1,500, KVK registration €85.15, plus articles-of-association drafting. End-to-end setup with an accountant, payroll, banking, and tax-authority registration usually lands €5k to €12k, below the Tier 1 default range. Minimum share capital is €0.01, so no meaningful capital lockup.',
        },
        {
          heading: 'Ongoing cost',
          body: 'Employer social-security contributions run around 23.59% of gross pay (WIA and WAO 6.27% to 7.63%, WHK 0.38% to 6.08%, plus ZVW and WW-Awf). The load is capped at an annual salary of €79,409, a harder ceiling than most EU markets. The same costs sit inside EOR fees, so do not shift the break-even.',
        },
        {
          heading: 'Compliance trigger to watch',
          body: 'At 10 or more employees, a personnel representation body (Personeelsvertegenwoordiging, "PVT") becomes required. At 50+, a full works council (Ondernemingsraad) is mandatory under the Works Councils Act. The 10-employee PVT trigger lands exactly at the Tier 1 threshold, so the compliance layer arrives at the same moment the economic case converges.',
        },
        {
          heading: 'Post-July-2026 risk',
          body: 'A government proposal would restrict UWV reimbursement of transition payments (transitievergoeding) to employers with fewer than 25 employees from 1 July 2026. Once an entity crosses 25 heads, that exit cost is no longer recoverable from UWV, raising the true cost of dismissals for mid-sized entities. Expect the effective threshold to drift up by 1 to 2 employees from July 2026.',
        },
      ],
    },
    upcomingChanges: [
      {
        effectiveDate: '2026-07-01',
        title: 'UWV transition-payment reimbursement restricted to under 25 employees',
        summary:
          'From 1 July 2026, a government proposal would restrict UWV reimbursement of statutory transition payments (transitievergoeding) to employers with fewer than 25 employees. Once an entity crosses 25 heads, that exit cost is no longer recoverable from UWV, raising the true cost of dismissals for mid-sized entities. Expect the threshold for the Netherlands to drift 1 to 2 employees higher from July 2026.',
        impact: 'raises_threshold',
        source: 'https://www.uwv.nl/werkgevers',
      },
    ],
  },
  IN: {
    verified: false,
    lastReviewedDate: '2026-05-11',
    thresholdNative: 12,
    thresholdNonNative: 18,
    setupCostLow: 300000,
    setupCostHigh: 700000,
    terminationCostPerEmployee: 350000,
    terminationBasisNote:
      'A typical exit blends retrenchment compensation, gratuity, notice pay, and leave encashment. Retrenchment is 15 days of average pay per completed year of service under the Industrial Disputes Act or the new Industrial Relations Code 2020. Gratuity eligibility is in flux. The Payment of Gratuity Act 1972 required 5 years of continuous service in workplaces with 10+ employees. The new Code on Social Security 2020 (in force from 21 November 2025, with the Central Rules still in draft consultation as of Q1 2026) entitles workers to gratuity after just 1 year. Figure based on a mid-level role at around ₹75,000 per month gross at 3 years of service, assuming the new 1-year gratuity rule applies: retrenchment around ₹1.3 lakh, gratuity around ₹1.3 lakh, 1 month notice, and accrued leave. Hiring across multiple states adds settlement variability (Maharashtra, Karnataka, Tamil Nadu, and Delhi each run distinct regimes). Confirm with local counsel before any decision.',
    thresholdJustification: {
      summary:
        'We pitch India at 12 (local language) and 18 (other languages). The EOR-fee-to-salary ratio is much higher than in European Tier 3 markets, so the cost crossover lands at smaller headcount. Sales experience puts useful conversations even lower. Single-state hiring assumed.',
      sections: [
        {
          heading: 'Why lower than the tier default',
          body: 'A $599 EOR fee sits at roughly 60% to 70% of a mid-level Indian gross salary, compared to around 10% in the UK. So the per-month EOR-versus-entity arithmetic converges at smaller headcount than the European Tier 3 template assumes.',
        },
        {
          heading: 'Setup',
          body: 'Private Limited Company formation is cheap on paper (MCA filing free up to ₹15 lakh authorised capital, name reservation ₹1,000, digital signature around ₹1,500 per director, DIN ₹500). A realistic end-to-end cost with a Chartered Accountant, legal, company secretary, state-level Shops and Establishments registration, Professional Tax, and Labour Welfare Fund typically lands ₹3 to ₹7 lakh (around $3,600 to $8,400).',
        },
        {
          heading: 'Ongoing cost',
          body: 'Employer statutory load is around 13% to 14% of gross pay. EPF is 12% of basic plus dearness allowance, with 8.33% of the employer share routed to EPS and capped at ₹1,250 per month. ESIC at 3.25% (employer only) applies below ₹21,000 per month, which rarely covers white-collar roles. Plus state Professional Tax and Labour Welfare Fund. Materially lighter than European markets.',
        },
        {
          heading: 'Compliance trigger to watch',
          body: 'A works committee only becomes mandatory at 100+ workers under the Industrial Relations Code, so internal-representation burden lands well above the threshold.',
        },
        {
          heading: 'Regulatory context',
          body: 'The four Labour Codes (Wages, Industrial Relations, Social Security, OSH) came into force on 21 November 2025. Draft Central Rules were issued on 30 December 2025 with 30 to 45 day comment windows. Procedural detail is still settling.',
        },
        {
          heading: 'State variation',
          body: 'Hiring across two or more states usually pushes the effective complexity higher. The 12 and 18 recommendation assumes concentration in a single state, most commonly Karnataka, Maharashtra, or Telangana for tech hiring.',
        },
      ],
    },
  },
  PL: {
    verified: false,
    lastReviewedDate: '2026-04-27',
    setupCostLow: 5000,
    setupCostHigh: 20000,
    terminationCostPerEmployee: 30000,
    terminationBasisNote:
      'A typical 3-year exit pays 3 months of statutory notice (Kodeks pracy, for tenure over 3 years) plus a negotiated settlement. Statutory severance (odprawa) only kicks in for employers with 20 or more employees, and only on economic or redundancy grounds. The base is 2 months of salary at 2 to 8 years of service, capped at 15 times the minimum monthly wage (PLN 69,990 from January 2025, around €16,400). Performance-based dismissals carry no statutory odprawa, but they usually settle with an agreed payout to avoid a labour-court claim (workers have 21 days to appeal to the labour court, sąd pracy). Figure based on a mid-level salary at around PLN 12,000 per month gross: around PLN 36k notice pay, plus a typical settlement top-up or a modest odprawa once you cross 20 heads. Polish labour courts tend to side with workers on whether a dismissal was justified, which pushes negotiated exits higher than the statutory floor.',
    thresholdJustification: {
      summary:
        'We apply the Tier 2 default of 18 (local language) and 25 (other languages). Poland is among the cheapest EU Tier 2 markets to incorporate, and the employer social load is lighter than France or Germany. Statutory severance only kicks in at 20+ employees, after the threshold.',
      sections: [
        {
          heading: 'Setup',
          body: 'Sp. z o.o. via the online S24 registry incorporates in 24 hours for around PLN 350 in court fees, plus PLN 5,000 minimum share capital that stays with the company. End-to-end setup with a Polish accountant, bank account, JPK and ZUS registration, and legal handholding typically lands PLN 5k to PLN 20k (around €1,200 to €4,700). Well under the Tier 2 default range. The KRS Court Monitor fee (PLN 100) was abolished on 29 November 2025, a small additional saving.',
        },
        {
          heading: 'Ongoing cost',
          body: 'Employer ZUS contributions run around 19% to 22% of gross pay (pension employer share 9.76%, disability 6.5%, accident around 1.67% typical, Labour Fund 2.45%, FGSP 0.1%). Materially lighter than Germany or France, which pulls the economic break-even very slightly forward versus the template. Not enough to override the 18 and 25 default.',
        },
        {
          heading: 'Compliance triggers',
          body: 'Compliance obligations cluster above the threshold. A workplace council (rada pracowników) only becomes mandatory at 50+ employees. Statutory severance (odprawa) only applies to employers with 20+ employees. Mandatory work regulations (regulamin pracy, regulamin wynagradzania) kick in at 50+.',
        },
        {
          heading: 'State variation',
          body: 'Polish labour law is national, not regional. Spreading hires across Warsaw, Kraków, or Wrocław does not change the regulatory picture or the threshold.',
        },
      ],
    },
  },
}
