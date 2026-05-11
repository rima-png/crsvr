'use client'

/**
 * CountryPolaroid — the one editorial signature on the calculator.
 *
 * Echoes the Polaroid-with-hand-written-caption visual signature from the new
 * Teamed site (https://teamed-website-platform.vercel.app/). Sits above the
 * Recommendation on step 3 as a warm anchor before the analytical content.
 *
 * Presentation-only: takes country, status, and crossover month, renders a
 * tilted white card with washi tape, a landmark photo for the country, and a
 * Permanent Marker caption underneath. No data fetching, no state.
 */

import type { Country, CalculationStatus } from '@/lib/types'
import { getLandmark } from '@/lib/landmarks'

interface CountryPolaroidProps {
  country: Country
  status: CalculationStatus
  crossoverMonth: number | null
}

const CAPTIONS: Record<CalculationStatus, string> = {
  BELOW_THRESHOLD: 'wait.',
  NEAR_THRESHOLD: 'plan.',
  ABOVE_THRESHOLD: 'act.',
}

function subCaption(status: CalculationStatus, crossoverMonth: number | null): string {
  if (status === 'ABOVE_THRESHOLD') {
    return crossoverMonth ? `crossed at month ${crossoverMonth}` : 'past your crossover'
  }
  if (status === 'NEAR_THRESHOLD') {
    return crossoverMonth ? `crossover at month ${crossoverMonth}` : 'crossover within reach'
  }
  return crossoverMonth ? `crossover at month ${crossoverMonth}` : 'no crossover in 3 years'
}

export function CountryPolaroid({ country, status, crossoverMonth }: CountryPolaroidProps) {
  const landmark = getLandmark(country.code)

  return (
    <div className="flex justify-center">
      <div
        className="relative bg-white border border-parchment-300 shadow-card px-4 pt-10 pb-5 w-[260px] sm:w-[280px]"
        style={{ transform: 'rotate(-1.5deg)' }}
      >
        {/* Washi tape */}
        <div
          aria-hidden
          className="absolute top-[-10px] left-1/2 w-24 h-5 bg-amber-300/70"
          style={{ transform: 'translate(-50%, 0) rotate(-3deg)' }}
        />

        {/* Landmark photo — square crop, parchment fallback if missing */}
        <div className="relative w-full aspect-square overflow-hidden bg-parchment-100">
          {landmark.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={landmark.src}
              alt={landmark.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl leading-none" aria-hidden>
                {country.flag}
              </span>
            </div>
          )}
        </div>

        {/* Country name + secondary detail */}
        <p className="font-heading font-bold text-forest-700 text-center mt-4 text-base">
          {country.flag} {country.name}
        </p>
        <p className="font-sans text-parchment-600 text-center text-xs mt-1">
          {subCaption(status, crossoverMonth)}
        </p>

        {/* Hand-written caption */}
        <p
          className="font-marker text-sienna-900 text-center mt-3 text-3xl leading-none"
          aria-label={`Recommendation: ${CAPTIONS[status]}`}
        >
          {CAPTIONS[status]}
        </p>
      </div>
    </div>
  )
}
