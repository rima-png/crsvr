import type { Country, UserInputs, CalculationResult, MonthlyDataPoint, ReadinessItem } from './types'

export function calculateCrossover(inputs: UserInputs, country: Country): CalculationResult {
  const threshold = inputs.operatesInLocalLanguage ? country.thresholdNative : country.thresholdNonNative
  const setupCostMidpoint = (country.setupCostLow + country.setupCostHigh) / 2
  const dataPoints: MonthlyDataPoint[] = []
  let eorCumulative = 0
  let entityCumulative = 0
  let crossoverMonth: number | null = null

  for (let month = 1; month <= 36; month++) {
    const headcount =
      month <= 12
        ? Math.round(
            inputs.currentHeadcount +
              ((inputs.plannedHeadcount - inputs.currentHeadcount) / 12) * month
          )
        : inputs.plannedHeadcount

    const eorMonthly = headcount * inputs.eorFeePerMonth
    const entityMonthly =
      (month === 1 ? setupCostMidpoint : 0) + headcount * (country.ongoingCostPerEmployeePerYear / 12)

    eorCumulative += eorMonthly
    entityCumulative += entityMonthly

    dataPoints.push({
      month,
      eorCumulative,
      entityCumulative,
      eorMonthly,
      entityMonthly,
      headcount,
    })

    if (crossoverMonth === null && entityCumulative < eorCumulative) {
      crossoverMonth = month
    }
  }

  const totalEorCost = eorCumulative
  const totalEntityCost = entityCumulative
  /** Positive = entity path is cheaper over 3 years (EOR spend minus entity spend). */
  const totalSavings = totalEorCost - totalEntityCost

  let status: CalculationResult['status']
  if (inputs.currentHeadcount >= threshold) {
    status = 'ABOVE_THRESHOLD'
  } else if (inputs.currentHeadcount >= threshold * 0.8) {
    status = 'NEAR_THRESHOLD'
  } else {
    status = 'BELOW_THRESHOLD'
  }

  const readinessItems = buildReadinessItems(
    inputs,
    country,
    threshold,
    crossoverMonth,
    totalEorCost,
    totalEntityCost
  )
  const readinessScore = Math.round(
    readinessItems.reduce((sum, item) => {
      if (item.status === 'green') return sum + 1
      if (item.status === 'amber') return sum + 0.5
      return sum
    }, 0) * 10
  ) / 10

  return {
    dataPoints,
    crossoverMonth,
    totalEorCost,
    totalEntityCost,
    totalSavings,
    status,
    readinessScore,
    readinessItems,
    setupCostUsed: setupCostMidpoint,
    threshold,
  }
}

function buildReadinessItems(
  inputs: UserInputs,
  country: Country,
  threshold: number,
  crossoverMonth: number | null,
  totalEorCost: number,
  totalEntityCost: number
): ReadinessItem[] {
  const concentrationStatus =
    inputs.currentHeadcount >= threshold
      ? 'green'
      : inputs.currentHeadcount >= threshold * 0.8
        ? 'amber'
        : 'red'

  const commitmentStatus =
    inputs.plannedHeadcount > inputs.currentHeadcount
      ? 'green'
      : inputs.plannedHeadcount === inputs.currentHeadcount
        ? 'amber'
        : 'red'

  /** GEMO criterion 3: 3-year EOR cost vs entity cost (same window as the model). */
  const entityEconomicallyViable = totalEorCost > totalEntityCost
  const economicsStatus = entityEconomicallyViable
    ? 'green'
    : crossoverMonth !== null
      ? 'amber'
      : 'red'

  const controlStatus: 'amber' = 'amber'

  const readinessStatus =
    country.tier === 1 ? 'green' : country.tier === 2 ? 'amber' : 'red'

  return [
    {
      criterion: 'Employee concentration',
      question: `Have you reached or exceeded the GEMO threshold (${threshold} employees) for ${country.name}, accounting for local-language operation?`,
      status: concentrationStatus,
      detail:
        concentrationStatus === 'green'
          ? `At or above the Tier ${country.tier} threshold — entity concentration criteria are met.`
          : concentrationStatus === 'amber'
            ? `Within 20% of threshold — flag for review per GEMO (e.g. 8+ in Tier 1).`
            : `Below threshold — GEMO recommends staying on EOR until closer to ${threshold} employees.`,
    },
    {
      criterion: 'Long-term commitment',
      question:
        'Are you planning a 3+ year presence in this market with stable or growing headcount?',
      status: commitmentStatus,
      detail:
        commitmentStatus === 'green'
          ? 'Growing headcount supports amortising entity setup (GEMO criterion 2).'
          : commitmentStatus === 'amber'
            ? 'Flat headcount — ensure multi-year payback still works for entity setup.'
            : 'Declining headcount — GEMO suggests EOR may remain the better fit.',
    },
    {
      criterion: 'Economic viability',
      question:
        'Over 3 years, do total EOR costs exceed entity setup plus ongoing entity costs in this model?',
      status: economicsStatus,
      detail: entityEconomicallyViable
        ? 'Three-year projection favours entity — aligns with GEMO cost comparison.'
        : crossoverMonth !== null
          ? 'Monthly crossover appears before 36 months, but 3-year totals still favour EOR — validate inputs and setup assumptions.'
          : 'EOR remains cheaper on a 3-year cumulative view — GEMO suggests staying on EOR unless other drivers apply.',
    },
    {
      criterion: 'Control requirements',
      question:
        'Do you need direct control over local operations, IP protection, or customer contracts that require a local entity?',
      status: controlStatus,
      detail:
        'GEMO criterion 4 — only you can confirm. Entity enables direct contracts and bank accounts; EOR keeps the employment relationship with the provider.',
    },
    {
      criterion: 'Operational readiness',
      question:
        'Do you have HR and legal resources (internal or outsourced) capable of managing local compliance?',
      status: readinessStatus,
      detail:
        readinessStatus === 'green'
          ? `Tier ${country.tier} (${country.complexityLabel}): allow ${country.setupMonthsLow}–${country.setupMonthsHigh} months for establishment per GEMO.`
          : readinessStatus === 'amber'
            ? `Tier ${country.tier}: plan for local payroll, accounting, and HR advisory — typically ${country.setupMonthsLow}–${country.setupMonthsHigh} months to establish.`
            : `Tier ${country.tier} (high complexity): budget ${country.setupMonthsLow}–${country.setupMonthsHigh} months and specialist in-country support.`,
    },
  ]
}
