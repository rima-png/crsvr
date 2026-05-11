'use client'

import { formatCurrency } from '@/lib/format'

interface StatCardsProps {
  totalEorCost: number
  totalEntityCost: number
  currency: string
}

export function StatCards({ totalEorCost, totalEntityCost, currency }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-parchment-100 rounded-card border border-parchment-300 p-6 shadow-card">
        <p className="font-sans text-parchment-600 text-sm mb-1">3-Year EOR Cost</p>
        <p className="font-heading font-bold text-forest-700 text-xl">
          {formatCurrency(totalEorCost, currency)}
        </p>
      </div>
      <div className="bg-parchment-100 rounded-card border border-parchment-300 p-6 shadow-card">
        <p className="font-sans text-parchment-600 text-sm mb-1">3-Year Entity Cost</p>
        <p className="font-heading font-bold text-forest-700 text-xl">
          {formatCurrency(totalEntityCost, currency)}
        </p>
      </div>
    </div>
  )
}
