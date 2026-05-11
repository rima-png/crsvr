'use client'

import type { ReadinessItem } from '@/lib/types'

interface ReadinessChecklistProps {
  items: ReadinessItem[]
}

export function ReadinessChecklist({ items }: ReadinessChecklistProps) {
  return (
    <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
      <h3 className="font-heading font-bold text-black text-lg mb-4">
        Your transition readiness
      </h3>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                item.status === 'green'
                  ? 'bg-forest'
                  : item.status === 'amber'
                    ? 'bg-yellow-400'
                    : 'bg-teamed-red'
              }`}
            />
            <div>
              <p className="font-heading font-bold text-black">{item.criterion}</p>
              <p className="font-sans text-gray-500 text-sm">{item.question}</p>
              <p className="font-sans text-black text-sm mt-1">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
