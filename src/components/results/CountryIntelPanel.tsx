'use client'

import { useState } from 'react'
import type { Country } from '@/lib/types'

interface CountryIntelPanelProps {
  country: Country
  threshold: number
}

export function CountryIntelPanel({ country, threshold }: CountryIntelPanelProps) {
  const [redFlagsOpen, setRedFlagsOpen] = useState(false)

  const complexityColor =
    country.complexityLabel === 'Straightforward'
      ? 'bg-forest/10 text-forest'
      : country.complexityLabel === 'Moderate'
        ? 'bg-yellow-400/20 text-amber-700'
        : 'bg-teamed-red/10 text-teamed-red'

  return (
    <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
      <h3 className="font-heading font-bold text-black text-lg mb-4">
        What you need to know about {country.name}
      </h3>

      <div className="space-y-4">
        <div>
          <p className="font-sans text-gray-500 text-sm mb-1">Setup complexity</p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${complexityColor}`}
          >
            {country.complexityLabel}
          </span>
        </div>

        <p className="font-sans text-black">
          Teamed recommends considering an entity from{' '}
          <span className="font-bold">{threshold}</span> employees in {country.name}.
        </p>

        <p className="font-sans text-black">
          <span className="font-bold">
            {country.setupMonthsLow}–{country.setupMonthsHigh} months
          </span>{' '}
          to establish a legal entity.
        </p>

        <div>
          <p className="font-sans font-medium text-black mb-2">Key factors</p>
          <ul className="list-disc list-inside space-y-1 font-sans text-black text-sm">
            {country.complexityFactors.slice(0, 5).map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setRedFlagsOpen(!redFlagsOpen)}
            className="font-sans font-medium text-forest hover:underline flex items-center gap-2"
          >
            {redFlagsOpen ? '−' : '+'} Red flags to review before you decide
          </button>
          {redFlagsOpen && (
            <ul className="list-disc list-inside space-y-1 font-sans text-black text-sm mt-2 pl-2">
              {country.redFlags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
