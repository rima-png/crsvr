'use client'

import { useState } from 'react'
import type { Country } from '@/lib/types'
import {
  changesInWindow,
  formatReviewedDate,
  isStale,
} from '@/lib/freshness'

interface CountryIntelPanelProps {
  country: Country
  threshold: number
  operatesInLocalLanguage: boolean
  /** US-only context: false means the team is distributed across multiple
   *  states, which surfaces a state-complexity flag in the panel. */
  singleStateConcentration?: boolean
}

export function CountryIntelPanel({
  country,
  threshold,
  operatesInLocalLanguage,
  singleStateConcentration,
}: CountryIntelPanelProps) {
  const [redFlagsOpen, setRedFlagsOpen] = useState(false)

  const complexityColor =
    country.complexityLabel === 'Straightforward'
      ? 'bg-sage-100 text-sage-700'
      : country.complexityLabel === 'Moderate'
        ? 'bg-amber-100 text-warning'
        : 'bg-sienna-100 text-sienna-700'

  const stale = isStale(country.lastReviewedDate)

  // Stale verified data drops to amber so the badge tells the truth.
  const confidenceBadge =
    country.dataConfidence === 'verified'
      ? stale
        ? {
            label: 'Advisor-verified — refresh due',
            classes: 'bg-amber-100 text-warning',
          }
        : { label: 'Advisor-verified figures', classes: 'bg-sage-100 text-sage-700' }
      : country.dataConfidence === 'baseline'
        ? {
            label: stale
              ? 'Baseline estimates — refresh due'
              : 'Baseline estimates — contact Teamed to verify',
            classes: 'bg-amber-100 text-warning',
          }
        : {
            label: 'Regional tier averages — contact Teamed for country-specific figures',
            classes: 'bg-parchment-100 text-parchment-700',
          }

  const upcoming = changesInWindow(country.upcomingChanges, 36)

  return (
    <div className="bg-white rounded-card border border-parchment-300 p-6 shadow-card">
      <h3 className="font-heading font-bold text-forest-700 text-lg mb-4">
        What you need to know about {country.name}
      </h3>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${confidenceBadge.classes}`}
          >
            {confidenceBadge.label}
          </span>
          {country.lastReviewedDate && (
            <span className="font-sans text-xs text-parchment-600">
              Last reviewed {formatReviewedDate(country.lastReviewedDate)}
            </span>
          )}
        </div>

        <div>
          <p className="font-sans text-parchment-600 text-sm mb-1">Setup complexity</p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${complexityColor}`}
          >
            {country.complexityLabel}
          </span>
        </div>

        <p className="font-sans text-forest-700">
          Under the <span className="font-medium">Graduation Model</span>, Teamed recommends
          considering an entity from <span className="font-bold">{threshold}</span> employees
          in {country.name} (a {country.complexityLabel.toLowerCase()} market).
        </p>

        <p className="font-sans text-forest-700">
          <span className="font-bold">
            {country.setupMonthsLow}–{country.setupMonthsHigh} months
          </span>{' '}
          to establish a legal entity.
        </p>

        <div className="rounded-input border border-parchment-300 bg-parchment-100/60 p-3">
          <p className="font-sans text-sm text-forest-700">
            <span className="font-medium">Operating language:</span>{' '}
            {operatesInLocalLanguage
              ? `your team operates in ${country.name}'s local language, which eases day-to-day compliance and direct engagement with authorities.`
              : `your team operates in English or another non-local language. Expect added complications around employment paperwork, translation, and authority engagement.`}
          </p>
        </div>

        {country.code === 'US' && singleStateConcentration === false && (
          <div className="rounded-input border border-warning/40 bg-amber-100/60 p-3">
            <p className="font-sans text-sm text-forest-700">
              <span className="font-semibold text-warning">Multi-state flag.</span>{' '}
              You&apos;re hiring across more than one US state. Each state adds its own
              registration, tax filings, and compliance overhead. Operational complexity
              scales with each state you add.
            </p>
          </div>
        )}

        <div>
          <p className="font-sans font-medium text-forest-700 mb-2">Key factors</p>
          <ul className="list-disc list-inside space-y-1 font-sans text-forest-700 text-sm">
            {country.complexityFactors.slice(0, 5).map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>

        {upcoming.length > 0 && (
          <div className="border-t border-parchment-300 pt-4">
            <p className="font-sans font-medium text-forest-700 mb-2">
              What&apos;s changing ahead
            </p>
            <ul className="space-y-3">
              {upcoming.map((change, i) => (
                <li key={i} className="font-sans text-sm">
                  <p className="font-medium text-forest-700">
                    <span className="text-parchment-600 font-normal">
                      {formatReviewedDate(change.effectiveDate)} —{' '}
                    </span>
                    {change.title}
                  </p>
                  <p className="text-parchment-700 mt-1">{change.summary}</p>
                  {change.source && (
                    <a
                      href={change.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sienna-700 hover:underline mt-1 inline-block"
                    >
                      Source
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => setRedFlagsOpen(!redFlagsOpen)}
            className="font-sans font-medium text-sienna-700 hover:underline flex items-center gap-2"
          >
            {redFlagsOpen ? '−' : '+'} Red flags to review before you decide
          </button>
          {redFlagsOpen && (
            <ul className="list-disc list-inside space-y-1 font-sans text-forest-700 text-sm mt-2 pl-2">
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
