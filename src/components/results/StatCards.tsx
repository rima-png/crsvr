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
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <p className="font-sans text-gray-500 text-sm mb-1">3-Year EOR Cost</p>
        <p className="font-heading font-bold text-black text-xl">
          {formatCurrency(totalEorCost, currency)}
        </p>
      </div>
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <p className="font-sans text-gray-500 text-sm mb-1">3-Year Entity Cost</p>
        <p className="font-heading font-bold text-black text-xl">
          {formatCurrency(totalEntityCost, currency)}
        </p>
      </div>
    </div>
  )
}
