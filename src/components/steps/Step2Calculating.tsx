'use client'

import { useEffect, useState } from 'react'
import { Recommendation } from '@/components/results/Recommendation'
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

const STATUS_STYLES = {
  BELOW_THRESHOLD: {
    label: 'EOR fits today',
    container: 'border-sage-500/30 bg-sage-100',
    dot: 'bg-sage-500',
    text: 'text-sage-700',
  },
  WORTH_CONVERSATION: {
    label: 'Worth a conversation',
    container: 'border-amber-500/30 bg-amber-100/50',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
  },
  NEAR_THRESHOLD: {
    label: 'Approaching your crossover',
    container: 'border-warning/30 bg-amber-100',
    dot: 'bg-warning',
    text: 'text-warning',
  },
  ABOVE_THRESHOLD: {
    label: 'Past your crossover',
    container: 'border-sienna-700/30 bg-sienna-100',
    dot: 'bg-sienna-700',
    text: 'text-sienna-700',
  },
} as const

interface Step2CalculatingProps {
  inputs: UserInputs
  result: CalculationResult
  onComplete: (lead: LeadData, pdfUrl: string | null) => void
}

export function Step2Calculating({ inputs, result, onComplete }: Step2CalculatingProps) {
  const country = inputs.country!
  const status = STATUS_STYLES[result.status]

  const [leadForm, setLeadForm] = useState<LeadData>({
    firstName: '',
    email: '',
    companyName: '',
    currentProvider: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    trackEvent('step_2_view')
    trackEvent('model_calculated', {
      crossover_month: result.crossoverMonth,
      status: result.status,
      savings: result.totalSavings,
    })
    trackEvent('gate_teaser_seen', {
      country: country.code,
      status: result.status,
    })
  }, [country.code, result.crossoverMonth, result.status, result.totalSavings])

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!leadForm.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email)) e.email = 'Invalid email format'
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

  const inputClass =
    'w-full border border-parchment-300 rounded-input px-4 py-3 font-sans text-forest-700 focus:outline-none focus:ring-2 focus:ring-sienna-500 bg-white'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Top card: result headline + email gate */}
      <div className="bg-white rounded-card border border-parchment-300 p-6 sm:p-8 shadow-card">
        <p className="text-center font-sans text-xs font-semibold uppercase tracking-wider text-parchment-600">
          Your {country.flag} {country.name} crossover report is ready
        </p>

        <div
          className={`mt-3 flex items-center justify-center gap-3 rounded-input border px-4 py-3 ${status.container}`}
        >
          <span aria-hidden className={`h-2.5 w-2.5 rounded-full shrink-0 ${status.dot}`} />
          <span className={`font-heading font-bold text-lg ${status.text}`}>{status.label}</span>
        </div>

        <p className="mt-4 text-center font-sans text-sm text-parchment-700">
          Enter your work email to see the full report. We&apos;ll also send you a PDF copy.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block font-sans font-medium text-forest-700 mb-2">Work email *</label>
            <input
              type="email"
              required
              autoFocus
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
              placeholder="you@company.com"
              className={inputClass}
            />
            {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sienna-500 text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-700 shadow-cta hover:shadow-cta-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                Sending...
              </>
            ) : (
              'See my full report →'
            )}
          </button>

          <details className="group rounded-input border border-parchment-300 bg-parchment-100/60 px-4 py-3">
            <summary className="flex cursor-pointer items-center justify-between font-sans text-sm font-medium text-parchment-700 marker:hidden">
              <span>Add a few details (optional)</span>
              <span aria-hidden className="text-parchment-500 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block font-sans font-medium text-forest-700 mb-2">First name</label>
                <input
                  type="text"
                  value={leadForm.firstName}
                  onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-sans font-medium text-forest-700 mb-2">Company name</label>
                <input
                  type="text"
                  value={leadForm.companyName}
                  onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-sans font-medium text-forest-700 mb-2">
                  Current EOR provider
                </label>
                <select
                  value={leadForm.currentProvider}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, currentProvider: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {EOR_PROVIDERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </details>

          <p className="text-center font-sans text-xs text-parchment-600">
            We&apos;ll email you a PDF copy and never spam.{' '}
            <a
              href="https://www.teamed.global/privacy-policy"
              className="text-parchment-700 underline hover:text-forest-700"
            >
              Privacy policy
            </a>
            .
          </p>
        </form>
      </div>

      {/* Bottom card: blurred preview of the full report */}
      <div className="bg-white rounded-card border border-parchment-300 p-6 sm:p-8 shadow-card">
        <p className="text-center font-sans text-sm font-semibold text-forest-700">
          What you&apos;ll see when you unlock
        </p>
        <div className="relative mt-4">
          <div
            aria-hidden
            className="pointer-events-none select-none"
            style={{ filter: 'blur(6px)' }}
          >
            <Recommendation
              inputs={inputs}
              result={result}
              country={country}
              lead={null}
              displayCurrency={inputs.eorFeeCurrency}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/90 px-5 py-2 font-heading font-bold text-forest-700 shadow-lg backdrop-blur flex items-center gap-2">
              <span aria-hidden>🔒</span>
              Locked
            </div>
          </div>
        </div>
        <p className="mt-4 text-center font-sans text-sm text-parchment-600">
          Plus the full chart with three-zone weighting, country intel, and your next steps.
        </p>
      </div>
    </div>
  )
}
