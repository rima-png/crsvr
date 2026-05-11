'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { formatCurrency } from '@/lib/format'
import { trackEvent } from '@/lib/analytics'
import type { UserInputs, CalculationResult, Country } from '@/lib/types'
import 'react-day-picker/dist/style.css'

interface RecommendationProps {
  inputs: UserInputs
  result: CalculationResult
  country: Country
  lead: { firstName: string; email: string; companyName: string; currentProvider: string } | null
  displayCurrency: string
}

export function Recommendation({
  inputs,
  result,
  country,
  lead,
  displayCurrency,
}: RecommendationProps) {
  const [reminderDate, setReminderDate] = useState<Date | undefined>()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [reminderSent, setReminderSent] = useState(false)
  const [reminderLoading, setReminderLoading] = useState(false)
  const [reminderError, setReminderError] = useState<string | null>(null)

  const lastPoint = result.dataPoints[result.dataPoints.length - 1]
  const monthlyDifference = lastPoint
    ? lastPoint.eorMonthly - lastPoint.entityMonthly
    : 0

  const handleCtaClick = (label: string) => {
    trackEvent('cta_clicked', { cta_label: label, status: result.status })
  }

  const handleSetReminder = async () => {
    if (!reminderDate || !lead?.email) return
    setReminderLoading(true)
    setReminderError(null)
    try {
      const res = await fetch('/api/set-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: lead?.email || '',
          reminderDate: reminderDate.toISOString().split('T')[0],
          country: country.name,
          threshold: result.threshold,
        }),
      })
      const data = await res.json().catch(() => ({ success: false }))
      if (!data.success) {
        setReminderError("We couldn't set your reminder. Please email us at hello@teamed.global.")
        return
      }
      setReminderSent(true)
      setShowDatePicker(false)
      trackEvent('reminder_set')
    } catch {
      setReminderError("We couldn't set your reminder. Please email us at hello@teamed.global.")
    } finally {
      setReminderLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-card border border-parchment-300 p-6 shadow-sm space-y-6">
      {result.status === 'BELOW_THRESHOLD' && (
        <>
          <div>
            <h2 className="font-heading font-bold text-forest-700 text-xl mb-2">
              Stay on EOR, for now.
            </h2>
            <p className="font-sans text-forest-700">
              At {inputs.currentHeadcount} in {country.name}, EOR still wins on the maths.{' '}
              {inputs.plannedHeadcount > inputs.currentHeadcount ? (
                <>
                  Your trajectory to {inputs.plannedHeadcount} in 12 months is worth watching.{' '}
                </>
              ) : (
                <>Keep an eye on headcount, the entity threshold sits at {result.threshold}.{' '}</>
              )}
              When you want to talk it through, we&apos;re here. No rush.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.teamed.global/contact-teamed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Have a 15-min call when ready')}
              className="inline-block bg-sienna-500 text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-700 shadow-cta hover:shadow-cta-hover transition-all"
            >
              Have a 15-min call when ready
            </a>
            <button
              type="button"
              onClick={() => {
                setShowDatePicker(!showDatePicker)
                handleCtaClick('Set a growth reminder')
              }}
              className="inline-block border border-sienna-500 text-sienna-700 rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-100 transition-colors"
            >
              Set a growth reminder
            </button>
            <a
              href="#why"
              onClick={() => handleCtaClick('Results')}
              className="inline-block border border-parchment-300 text-parchment-700 rounded-btn px-6 py-3 font-heading font-medium hover:bg-parchment-100 transition-colors"
            >
              Results
            </a>
          </div>
          {showDatePicker && (
            <div className="border border-parchment-300 rounded-card p-4">
              <p className="font-sans font-medium text-forest-700 mb-3">Pick a date to be reminded</p>
              <DayPicker
                mode="single"
                selected={reminderDate}
                onSelect={setReminderDate}
                disabled={{ before: new Date() }}
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleSetReminder}
                  disabled={!reminderDate || reminderLoading}
                  className="bg-sienna-500 text-white rounded-btn px-4 py-2 font-heading font-bold hover:bg-sienna-700 transition-colors disabled:opacity-50"
                >
                  {reminderLoading ? 'Sending...' : 'Confirm reminder'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="border border-parchment-300 text-forest-700 rounded-btn px-4 py-2 font-sans"
                >
                  Cancel
                </button>
              </div>
              {reminderSent && (
                <p className="font-sans text-sage-700 mt-2">Reminder set successfully!</p>
              )}
              {reminderError && (
                <p className="font-sans text-error mt-2">{reminderError}</p>
              )}
            </div>
          )}
        </>
      )}

      {result.status === 'NEAR_THRESHOLD' && (
        <>
          <div>
            <h2 className="font-heading font-bold text-forest-700 text-xl mb-2">
              Time to plan, not act.
            </h2>
            <p className="font-sans text-forest-700">
              At {inputs.currentHeadcount} in {country.name}, you&apos;re approaching the
              crossover. {country.complexityLabel} setup means {country.setupMonthsLow} to{' '}
              {country.setupMonthsHigh} months from go to running. Start mapping the move now,
              before the maths forces it.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.teamed.global/contact-teamed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Book a planning call')}
              className="inline-block bg-sienna-500 text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-700 shadow-cta hover:shadow-cta-hover transition-all"
            >
              Book a planning call
            </a>
            <a
              href="#why"
              onClick={() => handleCtaClick('Results')}
              className="inline-block border border-parchment-300 text-parchment-700 rounded-btn px-6 py-3 font-heading font-medium hover:bg-parchment-100 transition-colors"
            >
              Results
            </a>
          </div>
        </>
      )}

      {result.status === 'ABOVE_THRESHOLD' && (
        <>
          <div>
            <h2 className="font-heading font-bold text-forest-700 text-xl mb-2">
              The maths says act.
            </h2>
            <p className="font-sans text-forest-700">
              At {inputs.currentHeadcount} in {country.name}, you&apos;re past both thresholds.
              Every month on EOR is costing you{' '}
              <span className="font-bold">
                {formatCurrency(monthlyDifference, displayCurrency)}
              </span>{' '}
              more than running your own entity.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.teamed.global/contact-teamed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Book a priority transition call')}
              className="inline-block bg-sienna-700 text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-900 shadow-cta hover:shadow-cta-hover transition-all"
            >
              Book a priority transition call
            </a>
            <a
              href="#why"
              onClick={() => handleCtaClick('Results')}
              className="inline-block border border-parchment-300 text-parchment-700 rounded-btn px-6 py-3 font-heading font-medium hover:bg-parchment-100 transition-colors"
            >
              Results
            </a>
          </div>
        </>
      )}
    </div>
  )
}
