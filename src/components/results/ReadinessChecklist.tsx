'use client'

import type { ReadinessItem } from '@/lib/types'

interface ReadinessChecklistProps {
  items: ReadinessItem[]
}

const DOT_CLASSES: Record<ReadinessItem['status'], string> = {
  green: 'bg-success ring-success/25',
  amber: 'bg-warning ring-warning/25',
  red: 'bg-sienna-700 ring-sienna-700/25',
}

export function ReadinessChecklist({ items }: ReadinessChecklistProps) {
  return (
    <div className="bg-white rounded-card border border-parchment-300 p-6 shadow-card">
      <h3 className="font-heading font-bold text-forest-700 text-lg mb-4">
        Your transition readiness
      </h3>

      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4">
            <span
              aria-hidden
              className={`block w-4 h-4 rounded-full shrink-0 mt-1.5 ring-4 ${DOT_CLASSES[item.status]}`}
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
