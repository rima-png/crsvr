'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import type { UserInputs, CalculationResult, Country } from '@/lib/types'

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
  lead,
  pdfBase64,
  onReset,
}: NextStepsProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [fetchedPdf, setFetchedPdf] = useState<string | null>(null)

  const effectivePdf = fetchedPdf ?? pdfBase64

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
      trackEvent('cta_clicked', {
        cta_label: 'Download your Crossover Memo',
        status: result.status,
      })
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
        trackEvent('cta_clicked', {
          cta_label: 'Download your Crossover Memo',
          status: result.status,
        })
        downloadPdfFromBase64(data.pdfBase64)
      }
    } catch {
      // Silent fail
    } finally {
      setPdfLoading(false)
    }
  }

  // Match the Recommendation block's state-aware CTA so the two calls-to-action
  // on the results page agree with each other (no "wait" Polaroid + "book a
  // call now" mismatch).
  const callLabel =
    result.status === 'BELOW_THRESHOLD'
      ? 'Plan ahead with us'
      : result.status === 'WORTH_CONVERSATION'
        ? 'Book a 15-min chat'
        : result.status === 'NEAR_THRESHOLD'
          ? 'Book a planning call'
          : 'Book a priority transition call'
  const callIsUrgent = result.status === 'ABOVE_THRESHOLD'

  return (
    <div className="bg-white rounded-card border border-parchment-300 p-6 shadow-card space-y-4">
      <div className="flex flex-wrap gap-3">
        <a
          href="https://www.teamed.global/contact-teamed"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent('cta_clicked', {
              cta_label: callLabel,
              status: result.status,
            })
          }
          className={`inline-block text-white rounded-btn px-6 py-3 font-heading font-bold shadow-cta hover:shadow-cta-hover transition-all ${
            callIsUrgent
              ? 'bg-sienna-700 hover:bg-sienna-900'
              : 'bg-sienna-500 hover:bg-sienna-700'
          }`}
        >
          {callLabel}
        </a>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="border border-sienna-500 text-sienna-700 rounded-btn px-6 py-3 font-heading font-bold hover:bg-sienna-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? 'Generating...' : 'Download your Crossover Memo'}
        </button>
      </div>

      <p className="font-sans text-parchment-600 text-sm pt-4 border-t border-parchment-300">
        Want to model a different country or headcount?{' '}
        <button
          type="button"
          onClick={onReset}
          className="text-sienna-700 font-medium hover:underline"
        >
          Restart the calculator
        </button>
      </p>
    </div>
  )
}
