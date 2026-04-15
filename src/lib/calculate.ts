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
  const totalSavings = totalEntityCost - totalEorCost

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
    totalSavings
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
  totalSavings: number
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

  const economicsStatus =
    crossoverMonth !== null && crossoverMonth <= 18
      ? 'green'
      : crossoverMonth !== null
        ? 'amber'
        : 'red'

  const controlStatus: 'amber' = 'amber'

  const readinessStatus =
    country.tier === 1 ? 'green' : country.tier === 2 ? 'amber' : 'red'

  return [
    {
      criterion: 'Concentration',
      question: `Do you have or expect ${threshold}+ employees concentrated in ${country.name}?`,
      status: concentrationStatus,
      detail:
        concentrationStatus === 'green'
          ? `You're at or above the threshold for considering an entity.`
          : concentrationStatus === 'amber'
            ? `You're within 20% of the threshold — start planning.`
            : `Stay on EOR until you're closer to ${threshold} employees.`,
    },
    {
      criterion: 'Commitment',
      question: 'Is your headcount in this country growing or stable?',
      status: commitmentStatus,
      detail:
        commitmentStatus === 'green'
          ? 'Growing headcount supports entity investment.'
          : commitmentStatus === 'amber'
            ? 'Flat headcount — ensure entity payback fits your timeline.'
            : 'Declining headcount makes entity less attractive.',
    },
    {
      criterion: 'Economics',
      question: 'Does the crossover fall within 18 months?',
      status: economicsStatus,
      detail:
        economicsStatus === 'green'
          ? 'Fast payback — entity makes strong economic sense.'
          : economicsStatus === 'amber'
            ? 'Payback beyond 18 months — plan accordingly.'
            : 'EOR remains more cost-effective for the 3-year window.',
    },
    {
      criterion: 'Control',
      question: 'Do you need direct local contracts, IP protection, or bank accounts?',
      status: controlStatus,
      detail:
        'Only you can answer this — entity gives full control; EOR keeps it with the provider.',
    },
    {
      criterion: 'Readiness',
      question: `How complex is entity setup in ${country.name}?`,
      status: readinessStatus,
      detail:
        readinessStatus === 'green'
          ? 'Straightforward setup — minimal barriers.'
          : readinessStatus === 'amber'
            ? 'Moderate complexity — plan for local support.'
            : 'Complex jurisdiction — factor in time and expert support.',
    },
  ]
}
