'use client'

import type { ReadinessItem } from '@/lib/types'

interface ReadinessChecklistProps {
  items: ReadinessItem[]
}

export function ReadinessChecklist({ items }: ReadinessChecklistProps) {
  return (
    <div className="bg-white rounded-card border border-parchment-300 p-6 shadow-card">
      <h3 className="font-heading font-bold text-forest-700 text-lg mb-4">
        Your transition readiness
      </h3>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                item.status === 'green'
                  ? 'bg-sage-500'
                  : item.status === 'amber'
                    ? 'bg-warning'
                    : 'bg-sienna-700'
              }`}
            />
            <div>
              <p className="font-heading font-bold text-forest-700">{item.criterion}</p>
              <p className="font-sans text-parchment-600 text-sm">{item.question}</p>
              <p className="font-sans text-forest-700 text-sm mt-1">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
