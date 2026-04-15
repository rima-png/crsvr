'use client'

import { formatCurrency } from '@/lib/format'

interface StatCardsProps {
  crossoverMonth: number | null
  totalEorCost: number
  totalEntityCost: number
  totalSavings: number
  currency: string
}

export function StatCards({
  crossoverMonth,
  totalEorCost,
  totalEntityCost,
  totalSavings,
  currency,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <p className="font-sans text-gray-500 text-sm mb-1">Crossover Month</p>
        <p className="font-heading font-bold text-black text-xl text-forest">
          {crossoverMonth ? `Month ${crossoverMonth}` : 'Not within 3 years'}
        </p>
      </div>
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <p className="font-sans text-gray-500 text-sm mb-1">3-Year EOR Cost</p>
        <p className="font-heading font-bold text-teamed-red text-xl">
          {formatCurrency(totalEorCost, currency)}
        </p>
      </div>
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <p className="font-sans text-gray-500 text-sm mb-1">3-Year Entity Cost</p>
        <p className="font-heading font-bold text-forest text-xl">
          {formatCurrency(totalEntityCost, currency)}
        </p>
      </div>
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <p className="font-sans text-gray-500 text-sm mb-1">3-Year Savings</p>
        <p
          className={`font-heading font-bold text-xl ${
            totalSavings >= 0 ? 'text-forest' : 'text-teamed-red'
          }`}
        >
          {formatCurrency(Math.abs(totalSavings), currency)}
          {totalSavings >= 0 ? ' saved' : ' more with EOR'}
        </p>
      </div>
    </div>
  )
}
