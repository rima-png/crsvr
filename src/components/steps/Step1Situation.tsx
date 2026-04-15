'use client'

import { useState, useRef, useEffect } from 'react'
import { COUNTRIES } from '@/lib/countries'
import { calculateCrossover } from '@/lib/calculate'
import { getCurrencySymbol } from '@/lib/format'
import { trackEvent } from '@/lib/analytics'
import type { UserInputs, Country } from '@/lib/types'

interface Step1SituationProps {
  inputs: UserInputs
  setInputs: (inputs: UserInputs) => void
  onComplete: (inputs: UserInputs, result: ReturnType<typeof calculateCrossover>) => void
}

export function Step1Situation({ inputs, setInputs, onComplete }: Step1SituationProps) {
  const [countrySearch, setCountrySearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    trackEvent('step_1_view')
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const handleCountrySelect = (country: Country) => {
    setInputs({
      ...inputs,
      country,
      eorFeePerMonth: country.eorMarketRateMonthly,
    })
    setCountrySearch('')
    setDropdownOpen(false)
    trackEvent('country_selected', {
      country_name: country.name,
      complexity_label: country.complexityLabel,
    })
  }

  const handleShowCrossover = () => {
    if (!inputs.country) return
    const result = calculateCrossover(inputs, inputs.country)
    trackEvent('step_1_complete', {
      country: inputs.country.code,
      current_headcount: inputs.currentHeadcount,
      planned_headcount: inputs.plannedHeadcount,
    })
    onComplete(inputs, result)
  }

  const threshold = inputs.country
    ? inputs.operatesInLocalLanguage
      ? inputs.country.thresholdNative
      : inputs.country.thresholdNonNative
    : 0

  const plannedValid = inputs.plannedHeadcount >= inputs.currentHeadcount

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm">
        <h1 className="font-heading font-bold text-black text-2xl mb-2">
          Where are you hiring, and how many?
        </h1>
        <p className="font-sans text-gray-500 mb-8">
          Tell us your situation. 60 seconds. We&apos;ll show you the economics.
        </p>

        <div className="space-y-6">
          {/* Input 1 — Country */}
          <div>
            <label className="block font-sans font-medium text-black mb-2">Country</label>
            <div ref={dropdownRef} className="relative">
              <input
                type="text"
                value={dropdownOpen ? countrySearch : inputs.country ? `${inputs.country.flag} ${inputs.country.name}` : ''}
                onChange={(e) => {
                  setCountrySearch(e.target.value)
                  setDropdownOpen(true)
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Search countries..."
                className="w-full border border-gray-200 rounded-input px-4 py-3 font-sans text-black focus:outline-none focus:ring-2 focus:ring-forest bg-white"
              />
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-grey-mid rounded-input shadow-lg max-h-60 overflow-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-4 py-3 text-left font-sans text-black hover:bg-grey-mid flex items-center gap-2"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-4 py-3 font-sans text-gray-500">No countries found</div>
                  )}
                </div>
              )}
            </div>
            {inputs.country && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 bg-forest/10 text-forest text-sm font-medium px-3 py-1 rounded-full">
                  {inputs.country.flag} {inputs.country.name} · {inputs.country.complexityLabel} to
                  set up · Entity threshold: ~{threshold} employees
                </span>
              </div>
            )}
          </div>

          {/* Input 2 — Current headcount */}
          {inputs.country && (
            <>
              <div>
                <label className="block font-sans font-medium text-black mb-2">
                  Current headcount in {inputs.country.name}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={inputs.currentHeadcount}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10)
                      setInputs({
                        ...inputs,
                        currentHeadcount: v,
                        plannedHeadcount: Math.max(inputs.plannedHeadcount, v),
                      })
                    }}
                    className="flex-1 accent-forest"
                  />
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={inputs.currentHeadcount}
                    onChange={(e) => {
                      const v = Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1))
                      setInputs({
                        ...inputs,
                        currentHeadcount: v,
                        plannedHeadcount: Math.max(inputs.plannedHeadcount, v),
                      })
                    }}
                    className="w-20 border border-gray-200 rounded-input px-4 py-3 font-sans text-black focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  />
                </div>
              </div>

              {/* Input 3 — Planned headcount */}
              <div>
                <label className="block font-sans font-medium text-black mb-2">
                  Planned headcount in 12 months
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min={inputs.currentHeadcount}
                    max={50}
                    value={inputs.plannedHeadcount}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        plannedHeadcount: parseInt(e.target.value, 10),
                      })
                    }
                    className="flex-1 accent-forest"
                  />
                  <input
                    type="number"
                    min={inputs.currentHeadcount}
                    max={50}
                    value={inputs.plannedHeadcount}
                    onChange={(e) => {
                      const v = Math.min(
                        50,
                        Math.max(inputs.currentHeadcount, parseInt(e.target.value, 10) || inputs.currentHeadcount)
                      )
                      setInputs({ ...inputs, plannedHeadcount: v })
                    }}
                    className={`w-20 border rounded-input px-4 py-3 font-sans focus:outline-none focus:ring-2 focus:ring-forest bg-white ${
                      plannedValid ? 'border-gray-200 text-black' : 'border-teamed-red text-teamed-red'
                    }`}
                  />
                </div>
                {!plannedValid && (
                  <p className="mt-1 text-sm text-teamed-red">Must be ≥ current headcount</p>
                )}
              </div>

              {/* Input 4 — Operating language */}
              <div>
                <label className="block font-sans font-medium text-black mb-2">
                  How does your team operate?
                </label>
                <div className="flex rounded-input border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, operatesInLocalLanguage: true })}
                    className={`flex-1 px-4 py-3 font-sans font-medium transition-colors ${
                      inputs.operatesInLocalLanguage
                        ? 'bg-forest text-white'
                        : 'bg-white text-black hover:bg-grey-mid'
                    }`}
                  >
                    We work in {inputs.country.name}&apos;s language
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputs({ ...inputs, operatesInLocalLanguage: false })}
                    className={`flex-1 px-4 py-3 font-sans font-medium transition-colors ${
                      !inputs.operatesInLocalLanguage
                        ? 'bg-forest text-white'
                        : 'bg-white text-black hover:bg-grey-mid'
                    }`}
                  >
                    We work in English or another language
                  </button>
                </div>
                {!inputs.operatesInLocalLanguage && (
                  <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    We&apos;ll apply a language adjustment to your threshold — operating in a
                    non-native language increases complexity.
                  </p>
                )}
              </div>

              {/* Input 5 — EOR fee */}
              <div>
                <label className="block font-sans font-medium text-black mb-2">
                  Your current EOR fee per employee / month
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-gray-500">
                    {getCurrencySymbol(inputs.country.currency)}
                  </span>
                  <input
                    type="number"
                    value={inputs.eorFeePerMonth}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        eorFeePerMonth: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full border border-gray-200 rounded-input pl-12 pr-4 py-3 font-sans text-black focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 font-sans">
                  Pre-filled with the market average for {inputs.country.name}. Update if you know
                  your actual rate.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleShowCrossover}
            disabled={!inputs.country || !plannedValid}
            className="bg-forest text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-forest"
          >
            Show my crossover →
          </button>
        </div>
      </div>
    </div>
  )
}
