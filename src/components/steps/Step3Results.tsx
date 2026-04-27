'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { StatCards } from '@/components/results/StatCards'
import { CountryIntelPanel } from '@/components/results/CountryIntelPanel'
import { ReadinessChecklist } from '@/components/results/ReadinessChecklist'
import { NextSteps } from '@/components/results/NextSteps'
import { trackEvent } from '@/lib/analytics'
import { changesInWindow, formatReviewedDate } from '@/lib/freshness'
import type { UserInputs, CalculationResult, LeadData } from '@/lib/types'

const CrossoverChartDynamic = dynamic(
  () => import('@/components/results/CrossoverChart').then((m) => ({ default: m.CrossoverChart })),
  { ssr: false }
)

interface Step3ResultsProps {
  inputs: UserInputs
  result: CalculationResult
  lead: LeadData | null
  pdfBase64: string | null
  onReset: () => void
}

export function Step3Results({
  inputs,
  result,
  lead,
  pdfBase64,
  onReset,
}: Step3ResultsProps) {
  const country = inputs.country!

  // Material upcoming changes (those that move the threshold or cost) within the
  // 36-month planning horizon. Pure-informational items don't trigger the banner.
  const materialUpcoming = changesInWindow(country.upcomingChanges, 36).filter(
    (c) => c.impact !== 'informational'
  )

  useEffect(() => {
    trackEvent('step_3_view')
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <div>
        <p className="font-sans text-gray-500 text-sm mb-1">Your EOR vs Entity Analysis</p>
        <h1 className="font-heading font-bold text-black text-2xl">
          Here&apos;s your crossover model, {lead?.firstName || 'there'}
        </h1>
        <p className="font-sans text-gray-500 mt-2">
          {country.flag} {country.name} · {inputs.currentHeadcount} employees today ·{' '}
          {inputs.plannedHeadcount} planned in 12 months
        </p>
      </div>

      {/* Section A — CrossoverChart */}
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <CrossoverChartDynamic
          dataPoints={result.dataPoints}
          crossoverMonth={result.crossoverMonth}
          currency={country.currency}
          country={country}
        />
      </div>

      {/* Margin-of-error warning when low/high variants flip the recommendation */}
      {result.marginFlag && (
        <div className="bg-red-50 border-l-4 border-teamed-red rounded-card p-4">
          <p className="font-sans text-sm text-red-900">
            <span className="font-bold">Recommendation is directional only.</span> The setup-cost
            range straddles the decision point — the low and high scenarios give opposite answers.
            Refine with a local advisor before committing to a path.
          </p>
        </div>
      )}

      {/* Planning-window warning when a material regulatory change lands inside the 3-year horizon */}
      {materialUpcoming.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-amber-500 rounded-card p-4">
          <p className="font-sans text-sm text-amber-900">
            <span className="font-bold">Heads-up: regulatory change inside your planning window.</span>{' '}
            {materialUpcoming.length === 1 ? (
              <>
                {materialUpcoming[0].title} takes effect{' '}
                {formatReviewedDate(materialUpcoming[0].effectiveDate)}. See &quot;What&apos;s
                changing ahead&quot; below for the impact on your Crossover Point.
              </>
            ) : (
              <>
                {materialUpcoming.length} legislated changes take effect inside the next 3 years
                (earliest:{' '}
                {formatReviewedDate(materialUpcoming[0].effectiveDate)}). See &quot;What&apos;s
                changing ahead&quot; below.
              </>
            )}
          </p>
        </div>
      )}

      {/* Section B — StatCards */}
      <StatCards
        crossoverMonth={result.crossoverMonth}
        totalEorCost={result.totalEorCost}
        totalEntityCost={result.totalEntityCost}
        totalSavings={result.totalSavings}
        currency={country.currency}
      />

      {/* Section C — CountryIntelPanel */}
      <CountryIntelPanel country={country} threshold={result.threshold} />

      {/* Section D — ReadinessChecklist */}
      <ReadinessChecklist items={result.readinessItems} score={result.readinessScore} />

      {/* Section E — NextSteps */}
      <NextSteps
        inputs={inputs}
        result={result}
        country={country}
        lead={lead}
        pdfBase64={pdfBase64}
        onReset={onReset}
      />
    </div>
  )
}
