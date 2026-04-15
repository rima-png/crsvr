'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { formatCurrency } from '@/lib/format'
import { trackEvent } from '@/lib/analytics'
import type { UserInputs, CalculationResult } from '@/lib/types'
import type { Country } from '@/lib/types'
import 'react-day-picker/dist/style.css'

interface NextStepsProps {
  inputs: UserInputs
  result: CalculationResult
  country: Country
  lead: { firstName: string; email: string; companyName: string; currentProvider: string } | null
  pdfBase64: string | null
  onReset: () => void
}

export function NextSteps({
  inputs,
  result,
  country,
  lead,
  pdfBase64,
  onReset,
}: NextStepsProps) {
  const [reminderDate, setReminderDate] = useState<Date | undefined>()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [reminderSent, setReminderSent] = useState(false)
  const [reminderLoading, setReminderLoading] = useState(false)
  const [reminderError, setReminderError] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [fetchedPdf, setFetchedPdf] = useState<string | null>(null)

  const effectivePdf = fetchedPdf ?? pdfBase64

  const lastPoint = result.dataPoints[result.dataPoints.length - 1]
  const monthlyDifference = lastPoint
    ? lastPoint.eorMonthly - lastPoint.entityMonthly
    : 0

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
        setReminderError('We couldn\'t set your reminder. Please email us at hello@teamed.global.')
        return
      }
      setReminderSent(true)
      setShowDatePicker(false)
      trackEvent('reminder_set')
    } catch {
      setReminderError('We couldn\'t set your reminder. Please email us at hello@teamed.global.')
    } finally {
      setReminderLoading(false)
    }
  }

  const downloadPdfFromBase64 = (base64: string) => {
    try {
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Teamed-Crossover-Memo.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      trackEvent('pdf_downloaded')
    } catch (err) {
      console.error('PDF download failed:', err)
    }
  }

  const handleDownloadPdf = async () => {
    if (effectivePdf) {
      handleCtaClick('Download your Crossover Memo')
      downloadPdfFromBase64(effectivePdf)
      return
    }
    if (!lead) return
    setPdfLoading(true)
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, result, lead }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.success && data.pdfBase64) {
        setFetchedPdf(data.pdfBase64)
        handleCtaClick('Download your Crossover Memo')
        downloadPdfFromBase64(data.pdfBase64)
      }
    } catch {
      // Silent fail
    } finally {
      setPdfLoading(false)
    }
  }

  const handleCtaClick = (label: string) => {
    trackEvent('cta_clicked', { cta_label: label, status: result.status })
  }

  return (
    <div className="bg-white rounded-card border border-grey-mid p-6 shadow-sm space-y-6">
      {result.status === 'BELOW_THRESHOLD' && (
        <>
          <div>
            <h3 className="font-heading font-bold text-black text-lg mb-2">
              EOR is the right model for you right now
            </h3>
            <p className="font-sans text-black">
              At {inputs.currentHeadcount} employees in {country.name}, the economics favour staying
              on EOR. We recommend reviewing when you reach {result.threshold} employees.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setShowDatePicker(!showDatePicker)
                handleCtaClick('Set a growth reminder')
              }}
              className="bg-forest text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-forest-dark transition-colors"
            >
              Set a growth reminder
            </button>
            <a
              href="https://www.teamed.global/blog/global-employment-maturity-model-find-your-stage"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Download the GEMO Framework')}
              className="border border-forest text-forest rounded-btn px-6 py-3 font-heading font-bold hover:bg-forest/10 transition-colors inline-block"
            >
              Learn about the GEMO Framework
            </a>
          </div>
          {showDatePicker && (
            <div className="border border-grey-mid rounded-card p-4">
              <p className="font-sans font-medium text-black mb-3">Pick a date to be reminded</p>
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
                  className="bg-forest text-white rounded-btn px-4 py-2 font-heading font-bold hover:bg-forest-dark transition-colors disabled:opacity-50"
                >
                  {reminderLoading ? 'Sending...' : 'Confirm reminder'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="border border-gray-200 text-black rounded-btn px-4 py-2 font-sans"
                >
                  Cancel
                </button>
              </div>
              {reminderSent && (
                <p className="font-sans text-forest mt-2">Reminder set successfully!</p>
              )}
              {reminderError && (
                <p className="font-sans text-teamed-red mt-2">{reminderError}</p>
              )}
            </div>
          )}
        </>
      )}

      {result.status === 'NEAR_THRESHOLD' && (
        <>
          <div>
            <h3 className="font-heading font-bold text-black text-lg mb-2">
              You&apos;re approaching your crossover point
            </h3>
            <p className="font-sans text-black">
              At {inputs.currentHeadcount} employees, you&apos;re within striking distance of the
              entity threshold for {country.name}. Now is the time to plan — not after you cross it.
            </p>
          </div>
          <a
            href="https://www.teamed.global/contact-teamed"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCtaClick('Book a free crossover review')}
            className="inline-block bg-forest text-white rounded-btn px-6 py-3 font-heading font-bold hover:bg-forest-dark transition-colors"
          >
            Book a free crossover review
          </a>
        </>
      )}

      {result.status === 'ABOVE_THRESHOLD' && (
        <>
          <div>
            <h3 className="font-heading font-bold text-black text-lg mb-2">
              You&apos;re overpaying — every month counts
            </h3>
            <p className="font-sans text-black">
              At {inputs.currentHeadcount} employees in {country.name}, you&apos;re past the point
              where an entity saves you money. You&apos;re spending approximately{' '}
              <span className="font-bold">
                {formatCurrency(monthlyDifference, country.currency)}
              </span>{' '}
              more per month on EOR than you need to.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.teamed.global/contact-teamed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('Book a priority transition review')}
              className="inline-block bg-teamed-red text-white rounded-btn px-6 py-3 font-heading font-bold hover:opacity-90 transition-opacity"
            >
              Book a priority transition review
            </a>
          </div>
        </>
      )}

      <div className="pt-4">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="border border-forest text-forest rounded-btn px-6 py-3 font-heading font-bold hover:bg-forest/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? 'Generating...' : 'Download your Crossover Memo'}
        </button>
      </div>

      <p className="font-sans text-gray-500 text-sm pt-4 border-t border-grey-mid">
        Want to model a different country or headcount?{' '}
        <button
          type="button"
          onClick={onReset}
          className="text-forest font-medium hover:underline"
        >
          Restart the calculator
        </button>
      </p>
    </div>
  )
}
