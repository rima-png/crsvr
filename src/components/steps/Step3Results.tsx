'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { StatCards } from '@/components/results/StatCards'
import { CountryIntelPanel } from '@/components/results/CountryIntelPanel'
import { ReadinessChecklist } from '@/components/results/ReadinessChecklist'
import { Recommendation } from '@/components/results/Recommendation'
import { NextSteps } from '@/components/results/NextSteps'
import { CountryPolaroid } from '@/components/results/CountryPolaroid'
import { trackEvent } from '@/lib/analytics'
import { convertCurrency } from '@/lib/fx'
import { changesInWindow, formatReviewedDate } from '@/lib/freshness'
import type { UserInputs, CalculationResult, LeadData } from '@/lib/types'

const RESERVE_CURRENCIES = ['USD', 'GBP', 'EUR'] as const

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

  const [displayCurrency, setDisplayCurrency] = useState(inputs.eorFeeCurrency)

  const currencyOptions = useMemo(() => {
    const local = country.currency
    if ((RESERVE_CURRENCIES as readonly string[]).includes(local)) {
      return [...RESERVE_CURRENCIES]
    }
    return [local, ...RESERVE_CURRENCIES]
  }, [country.currency])

  const displayResult = useMemo<CalculationResult>(() => {
    const fx = (n: number) => convertCurrency(n, country.currency, displayCurrency)
    return {
      ...result,
      totalEorCost: fx(result.totalEorCost),
      totalEntityCost: fx(result.totalEntityCost),
      totalSavings: fx(result.totalSavings),
      totalEntityCostLow: fx(result.totalEntityCostLow),
      totalEntityCostHigh: fx(result.totalEntityCostHigh),
      totalSavingsLow: fx(result.totalSavingsLow),
      totalSavingsHigh: fx(result.totalSavingsHigh),
      dataPoints: result.dataPoints.map((p) => ({
        ...p,
        eorCumulative: fx(p.eorCumulative),
        entityCumulative: fx(p.entityCumulative),
        eorMonthly: fx(p.eorMonthly),
        entityMonthly: fx(p.entityMonthly),
      })),
    }
  }, [result, displayCurrency, country.currency])

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-sans text-parchment-600 text-sm mb-1">Your EOR vs Entity Analysis</p>
          <h1 className="font-heading font-bold text-forest-700 text-2xl">
            Here&apos;s your crossover model, {lead?.firstName || 'there'}
          </h1>
          <p className="font-sans text-parchment-600 mt-2">
            {country.flag} {country.name} · {inputs.currentHeadcount} employees today ·{' '}
            {inputs.plannedHeadcount} planned in 12 months
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="display-currency"
            className="font-sans text-sm text-parchment-600 whitespace-nowrap"
          >
            Display in
          </label>
          <select
            id="display-currency"
            value={displayCurrency}
            onChange={(e) => setDisplayCurrency(e.target.value)}
            className="border border-parchment-300 rounded-input px-3 py-2 font-sans font-medium text-forest-700 focus:outline-none focus:ring-2 focus:ring-sienna-500 bg-white cursor-pointer"
            aria-label="Display currency"
          >
            {currencyOptions.map((code) => (
              <option key={code} value={code}>
                {code}
                {code === country.currency ? ' (local)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Polaroid signature — warm anchor before the analytical content */}
      <CountryPolaroid
        country={country}
        status={result.status}
        crossoverMonth={result.crossoverMonth}
      />

      {/* Recommendation — moved to top so the headline answer leads */}
      <Recommendation
        inputs={inputs}
        result={displayResult}
        country={country}
        lead={lead}
        displayCurrency={displayCurrency}
      />

      {/* Section A — CrossoverChart */}
      <div className="bg-white rounded-card border border-parchment-300 p-6 shadow-card">
        <CrossoverChartDynamic
          dataPoints={displayResult.dataPoints}
          crossoverMonth={displayResult.crossoverMonth}
          currency={displayCurrency}
          country={country}
          threshold={result.threshold}
        />
      </div>

      {/* Margin-of-error warning when low/high variants flip the recommendation */}
      {result.marginFlag && (
        <div className="bg-sienna-100 border-l-4 border-sienna-700 rounded-card p-4">
          <p className="font-sans text-sm text-sienna-900">
            <span className="font-bold">Recommendation is directional only.</span> The setup-cost
            range straddles the decision point. The low and high scenarios give opposite answers.
            Refine with a local advisor before committing to a path.
          </p>
        </div>
      )}

      {/* Planning-window warning when a material regulatory change lands inside the 3-year horizon */}
      {materialUpcoming.length > 0 && (
        <div className="bg-amber-100 border-l-4 border-warning rounded-card p-4">
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
        totalEorCost={displayResult.totalEorCost}
        totalEntityCost={displayResult.totalEntityCost}
        currency={displayCurrency}
      />

      {/* Section C — CountryIntelPanel (anchor target for "Learn more about why" CTA) */}
      <div id="why" className="scroll-mt-8">
        <CountryIntelPanel
          country={country}
          threshold={result.threshold}
          operatesInLocalLanguage={inputs.operatesInLocalLanguage}
        />
      </div>

      {/* Section D — ReadinessChecklist */}
      <ReadinessChecklist items={result.readinessItems} />

      {/* Section E — NextSteps (tools footer) */}
      <NextSteps
        inputs={inputs}
        result={displayResult}
        country={country}
        lead={lead}
        pdfBase64={pdfBase64}
        onReset={onReset}
      />
    </div>
  )
}
