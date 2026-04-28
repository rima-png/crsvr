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
}

export function CountryIntelPanel({ country, threshold }: CountryIntelPanelProps) {
  const [redFlagsOpen, setRedFlagsOpen] = useState(false)

  const complexityColor =
    country.complexityLabel === 'Straightforward'
      ? 'bg-forest/10 text-forest'
      : country.complexityLabel === 'Moderate'
        ? 'bg-yellow-400/20 text-amber-700'
        : 'bg-teamed-red/10 text-teamed-red'

  const stale = isStale(country.lastReviewedDate)

  // Stale verified data drops to amber so the badge tells the truth.
  const confidenceBadge =
    country.dataConfidence === 'verified'
      ? stale
        ? {
            label: 'Advisor-verified — refresh due',
            classes: 'bg-yellow-400/20 text-amber-700',
          }
        : { label: 'Advisor-verified figures', classes: 'bg-forest/10 text-forest' }
      : country.dataConfidence === 'baseline'
        ? {
            label: stale
              ? 'Baseline estimates — refresh due'
              : 'Baseline estimates — contact Teamed to verify',
            classes: 'bg-yellow-400/20 text-amber-700',
          }
        : {
            label: 'Regional tier averages — contact Teamed for country-specific figures',
            classes: 'bg-grey-light text-gray-600',
          }

  const upcoming = changesInWindow(country.upcomingChanges, 36)

  return (
    <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
      <h3 className="font-heading font-bold text-black text-lg mb-4">
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
            <span className="font-sans text-xs text-gray-500">
              Last reviewed {formatReviewedDate(country.lastReviewedDate)}
            </span>
          )}
        </div>

        <div>
          <p className="font-sans text-gray-500 text-sm mb-1">Setup complexity</p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${complexityColor}`}
          >
            {country.complexityLabel}
          </span>
        </div>

        <p className="font-sans text-black">
          Under the <span className="font-medium">GEMO Framework</span> (Country Concentration
          &amp; Entity Transition), Teamed recommends considering an entity from{' '}
          <span className="font-bold">{threshold}</span> employees in {country.name} (Tier{' '}
          {country.tier}, accounting for your language selection).
        </p>

        {country.thresholdJustification &&
          (typeof country.thresholdJustification === 'string' ? (
            <p className="font-sans text-gray-700 text-sm leading-relaxed">
              {country.thresholdJustification}
            </p>
          ) : (
            <div className="space-y-3">
              <p className="font-sans text-black text-sm leading-relaxed font-medium">
                {country.thresholdJustification.summary}
              </p>
              {country.thresholdJustification.sections &&
                country.thresholdJustification.sections.length > 0 && (
                  <dl className="space-y-2">
                    {country.thresholdJustification.sections.map((section, i) => (
                      <div key={i} className="font-sans text-sm leading-relaxed">
                        <dt className="inline font-semibold text-black">
                          {section.heading}
                          <span className="font-normal text-gray-400"> — </span>
                        </dt>
                        <dd className="inline text-gray-700">{section.body}</dd>
                      </div>
                    ))}
                  </dl>
                )}
            </div>
          ))}

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

        {upcoming.length > 0 && (
          <div className="border-t border-grey-mid pt-4">
            <p className="font-sans font-medium text-black mb-2">
              What&apos;s changing ahead
            </p>
            <ul className="space-y-3">
              {upcoming.map((change, i) => (
                <li key={i} className="font-sans text-sm">
                  <p className="font-medium text-black">
                    <span className="text-gray-500 font-normal">
                      {formatReviewedDate(change.effectiveDate)} —{' '}
                    </span>
                    {change.title}
                  </p>
                  <p className="text-gray-600 mt-1">{change.summary}</p>
                  {change.source && (
                    <a
                      href={change.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-forest hover:underline mt-1 inline-block"
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
