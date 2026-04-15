'use client'

import { useState, useEffect, useRef } from 'react'
import { formatCurrency } from '@/lib/format'
import { trackEvent } from '@/lib/analytics'
import type { UserInputs, CalculationResult, LeadData } from '@/lib/types'

const EOR_PROVIDERS = [
  'Deel',
  'Remote',
  'Oyster',
  'G-P',
  'Multiplier',
  'Other',
  "I'm not currently using an EOR",
]

interface Step2CalculatingProps {
  inputs: UserInputs
  result: CalculationResult
  onComplete: (lead: LeadData, pdfUrl: string | null) => void
}

export function Step2Calculating({ inputs, result, onComplete }: Step2CalculatingProps) {
  const [phase, setPhase] = useState<'animation' | 'form'>('animation')
  const [eorDisplay, setEorDisplay] = useState(0)
  const [entityDisplay, setEntityDisplay] = useState(0)
  const [eorDone, setEorDone] = useState(false)
  const [entityDone, setEntityDone] = useState(false)
  const [leadForm, setLeadForm] = useState<LeadData>({
    firstName: '',
    email: '',
    companyName: '',
    currentProvider: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const animationStartRef = useRef<number | null>(null)

  const country = inputs.country!
  const currency = country.currency

  useEffect(() => {
    trackEvent('step_2_view')
    trackEvent('model_calculated', {
      crossover_month: result.crossoverMonth,
      status: result.status,
      savings: result.totalSavings,
    })
  }, [result.crossoverMonth, result.status, result.totalSavings])

  useEffect(() => {
    if (phase !== 'animation') return

    const duration = 1200
    const start = performance.now()

    const animate = (now: number) => {
      if (!animationStartRef.current) animationStartRef.current = now
      const elapsed = now - animationStartRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setEorDisplay(Math.round(result.totalEorCost * easeOut))
      setEntityDisplay(Math.round(result.totalEntityCost * easeOut))

      if (progress >= 1) {
        setEorDisplay(result.totalEorCost)
        setEntityDisplay(result.totalEntityCost)
        setEorDone(true)
        setEntityDone(true)
      } else {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [phase, result.totalEorCost, result.totalEntityCost])

  useEffect(() => {
    if (eorDone && entityDone && phase === 'animation') {
      const timer = setTimeout(() => setPhase('form'), 2500)
      return () => clearTimeout(timer)
    }
  }, [eorDone, entityDone, phase])

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!leadForm.firstName.trim()) e.firstName = 'First name is required'
    if (!leadForm.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email)) e.email = 'Invalid email format'
    if (!leadForm.companyName.trim()) e.companyName = 'Company name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || submitting) return

    setSubmitting(true)

    const leadPayload = {
      lead: leadForm,
      inputs: {
        country: country.name,
        currentHeadcount: inputs.currentHeadcount,
        plannedHeadcount: inputs.plannedHeadcount,
        eorFeePerMonth: inputs.eorFeePerMonth,
      },
      result: {
        crossoverMonth: result.crossoverMonth,
        totalEorCost: result.totalEorCost,
        totalEntityCost: result.totalEntityCost,
        totalSavings: result.totalSavings,
        status: result.status,
        readinessScore: result.readinessScore,
      },
    }

    fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload),
    })
      .then(() => trackEvent('lead_submitted'))
      .catch(() => {})

    let pdfBase64: string | null = null
    try {
      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, result, lead: leadForm }),
      })
      const pdfData = await pdfRes.json().catch(() => ({}))
      if (pdfData.success && pdfData.pdfBase64) pdfBase64 = pdfData.pdfBase64
    } catch {
      pdfBase64 = null
    }

    onComplete(leadForm, pdfBase64)
    setSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {phase === 'animation' && (
        <div
          className="bg-white rounded-card border border-grey-mid p-8 shadow-sm space-y-4"
          style={{
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-row-1 { animation: fadeIn 0.6s ease-out 0s both; }
            .animate-row-2 { animation: fadeIn 0.6s ease-out 0.2s both; }
            .animate-row-3 { animation: fadeIn 0.6s ease-out 0.4s both; }
            .animate-row-4 { animation: fadeIn 0.6s ease-out 0.6s both; }
          `}</style>

          <p className="font-sans text-black animate-row-1">
            📍 {country.flag} {country.name} · {inputs.currentHeadcount} employees today ·{' '}
            {inputs.plannedHeadcount} in 12 months
          </p>
          <p className="font-sans text-black animate-row-2">
            💷 EOR cost over 36 months: {formatCurrency(eorDisplay, currency)}
          </p>
          <p className="font-sans text-black animate-row-3">
            🏢 Entity cost over 36 months: {formatCurrency(entityDisplay, currency)}
          </p>
          <p
            className={`font-heading font-bold text-lg mt-4 animate-row-4 ${
              result.crossoverMonth ? 'text-forest' : 'text-gray-500'
            }`}
          >
            {result.crossoverMonth ? (
              <>📅 Crossover point: Month {result.crossoverMonth}</>
            ) : (
              'EOR is more cost-effective for the next 3 years'
            )}
          </p>
        </div>
      )}

      {phase === 'form' && (
        <div
          className="bg-white rounded-card border border-grey-mid p-6 shadow-sm"
          style={{ animation: 'slideUp 0.5s ease-out' }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <h2 className="font-heading font-bold text-black text-xl mb-2">Your model is ready</h2>
          <p className="font-sans text-gray-500 mb-6">
            Enter your details to unlock your full results, including the crossover chart and 3-year
            savings projection.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sans font-medium text-black mb-2">First name</label>
              <input
                type="text"
                value={leadForm.firstName}
                onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                className="w-full border border-gray-200 rounded-input px-4 py-3 font-sans text-black focus:outline-none focus:ring-2 focus:ring-forest bg-white"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-teamed-red">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block font-sans font-medium text-black mb-2">Work email</label>
              <input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                className="w-full border border-gray-200 rounded-input px-4 py-3 font-sans text-black focus:outline-none focus:ring-2 focus:ring-forest bg-white"
              />
              {errors.email && <p className="mt-1 text-sm text-teamed-red">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-sans font-medium text-black mb-2">Company name</label>
              <input
                type="text"
                value={leadForm.companyName}
                onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                className="w-full border border-gray-200 rounded-input px-4 py-3 font-sans text-black focus:outline-none focus:ring-2 focus:ring-forest bg-white"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-teamed-red">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block font-sans font-medium text-black mb-2">
                Current EOR provider (optional)
              </label>
              <select
                value={leadForm.currentProvider}
                onChange={(e) => setLeadForm({ ...leadForm, currentProvider: e.target.value })}
                className="w-full border border-gray-200 rounded-input px-4 py-3 font-sans text-black focus:outline-none focus:ring-2 focus:ring-forest bg-white"
              >
                <option value="">Select...</option>
                {EOR_PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-forest text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                'See my results →'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
