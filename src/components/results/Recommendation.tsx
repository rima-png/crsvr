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
              The model says wait. Your growth says talk.
            </h2>
            <p className="font-sans text-forest-700">
              At {inputs.currentHeadcount} in {country.name}, EOR still wins. But growing to{' '}
              {inputs.plannedHeadcount} in 12 months is the kind of trajectory worth a 15-minute
              call. We&apos;ll show you the triggers to watch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.teamed.global/contact-teamed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Book a call with our global employment team')}
              className="inline-block bg-sienna-500 text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-700 shadow-cta hover:shadow-cta-hover transition-all"
            >
              Book a call with our global employment team
            </a>
            <a
              href="#why"
              onClick={() => handleCtaClick('Results')}
              className="inline-block border border-sienna-500 text-sienna-700 rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-100 transition-colors"
            >
              Results
            </a>
            <button
              type="button"
              onClick={() => {
                setShowDatePicker(!showDatePicker)
                handleCtaClick('Set a growth reminder')
              }}
              className="border border-parchment-300 text-parchment-700 rounded-btn px-6 py-3 font-heading font-medium hover:bg-parchment-100 transition-colors"
            >
              Set a growth reminder
            </button>
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
              You&apos;re close to your crossover.
            </h2>
            <p className="font-sans text-forest-700">
              At {inputs.currentHeadcount} in {country.name},{' '}
              {country.complexityLabel.toLowerCase()} setup. The right call depends on your
              priorities, not just the maths. Book a free review.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.teamed.global/contact-teamed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Book a free crossover review')}
              className="inline-block bg-sienna-500 text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-700 shadow-cta hover:shadow-cta-hover transition-all"
            >
              Book a free crossover review
            </a>
            <a
              href="#why"
              onClick={() => handleCtaClick('Results')}
              className="inline-block border border-sienna-500 text-sienna-700 rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-100 transition-colors"
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
              The numbers say it&apos;s time.
            </h2>
            <p className="font-sans text-forest-700">
              At {inputs.currentHeadcount} in {country.name}, you&apos;re past both thresholds.
              You&apos;re spending{' '}
              <span className="font-bold">
                {formatCurrency(monthlyDifference, displayCurrency)}
              </span>{' '}
              more per month than the alternative. Book a priority review.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.teamed.global/contact-teamed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Book a priority transition review')}
              className="inline-block bg-sienna-700 text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-900 shadow-cta hover:shadow-cta-hover transition-all"
            >
              Book a priority transition review
            </a>
            <a
              href="#why"
              onClick={() => handleCtaClick('Results')}
              className="inline-block border border-sienna-500 text-sienna-700 rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-100 transition-colors"
            >
              Results
            </a>
          </div>
        </>
      )}
    </div>
  )
}
