'use client'

import type { ReadinessItem } from '@/lib/types'

interface ReadinessChecklistProps {
  items: ReadinessItem[]
  score: number
}

export function ReadinessChecklist({ items, score }: ReadinessChecklistProps) {
  const scoreNum = Math.round(score)
  const summaryText =
    score >= 4
      ? 'You look ready to move.'
      : score >= 2
        ? "You're getting closer — a few things to address."
        : 'Not yet — stay on EOR and review when you grow.'

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

      <p className="font-sans text-black mt-6">
        You meet <span className="font-bold">{score}/5</span> transition criteria. {summaryText}
      </p>
    </div>
  )
}
