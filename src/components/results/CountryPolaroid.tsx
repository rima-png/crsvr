'use client'

/**
 * CountryPolaroid — the one editorial signature on the calculator.
 *
 * Echoes the Polaroid signature from the new Teamed brand kit
 * (https://teamed-website-platform.vercel.app/brand-kit): a real-looking
 * Polaroid with a "Classic Film" fade on the photo, 4% film grain overlay,
 * and a Sharpie-feel hand-written caption in sienna-900 deep sepia on the
 * white border below the photo, slightly tilted to feel hand-scrawled.
 *
 * Presentation-only.
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

// Subtle film treatment — approximates the brand kit "Classic Film" preset.
// Slight sepia, reduced saturation and contrast for a faded vintage feel.
const PHOTO_FILTER = 'sepia(0.18) saturate(0.82) contrast(0.94) brightness(0.98)'

export function CountryPolaroid({ country, status, crossoverMonth }: CountryPolaroidProps) {
  const landmark = getLandmark(country.code)

  return (
    <div className="flex justify-center">
      <div
        className="relative bg-white border border-parchment-300 shadow-card px-4 pt-10 pb-7 w-[260px] sm:w-[280px]"
        style={{ transform: 'rotate(-1.5deg)' }}
      >
        {/* Washi tape */}
        <div
          aria-hidden
          className="absolute top-[-10px] left-1/2 w-24 h-5 bg-amber-300/70"
          style={{ transform: 'translate(-50%, 0) rotate(-3deg)' }}
        />

        {/* Photo area — faded film treatment, grain overlay */}
        <div className="relative w-full aspect-square overflow-hidden bg-parchment-100">
          {landmark.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={landmark.src}
              alt={landmark.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
              style={{ filter: PHOTO_FILTER }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl leading-none" aria-hidden>
                {country.flag}
              </span>
            </div>
          )}
          {/* 4% film-grain overlay per the brand kit */}
          <div aria-hidden className="grain absolute inset-0 pointer-events-none" />
        </div>

        {/* Hand-written annotations on the white bottom border.
            Slight tilts make it feel scrawled, not typeset. */}
        <p
          className="font-marker text-sienna-900 text-center mt-4 text-xl leading-tight"
          style={{ transform: 'rotate(-0.8deg)' }}
        >
          {country.name}
        </p>
        <p
          className="font-marker text-sienna-900 text-center mt-2 text-5xl leading-none"
          style={{ transform: 'rotate(1.2deg)' }}
          aria-label={`Recommendation: ${CAPTIONS[status]}`}
        >
          {CAPTIONS[status]}
        </p>
        <p className="font-sans text-parchment-600 text-center text-[11px] uppercase tracking-wider mt-3">
          {subCaption(status, crossoverMonth)}
        </p>
      </div>
    </div>
  )
}
