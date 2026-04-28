'use client'

import { useState, useEffect } from 'react'
import { StepIndicator } from './StepIndicator'
import { Step1Situation } from './steps/Step1Situation'
import { Step2Calculating } from './steps/Step2Calculating'
import { Step3Results } from './steps/Step3Results'
import type { UserInputs, CalculationResult, LeadData } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'

const DEFAULT_INPUTS: UserInputs = {
  country: null,
  currentHeadcount: 10,
  plannedHeadcount: 15,
  operatesInLocalLanguage: true,
  eorFeePerMonth: 599,
  eorFeeCurrency: 'USD',
}

export function CalculatorShell() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [lead, setLead] = useState<LeadData | null>(null)
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)

  useEffect(() => {
    trackEvent('step_view', { step_number: step })
  }, [step])

  const handleReset = () => {
    setStep(1)
    setInputs(DEFAULT_INPUTS)
    setResult(null)
    setLead(null)
    setPdfBase64(null)
  }

  return (
    <div className="min-h-screen bg-grey-light">
      <StepIndicator currentStep={step} />
      {step === 1 && (
        <Step1Situation
          inputs={inputs}
          setInputs={setInputs}
          onComplete={(newInputs, calculationResult) => {
            setInputs(newInputs)
            setResult(calculationResult)
            setStep(2)
          }}
        />
      )}
      {step === 2 && result && (
        <Step2Calculating
          inputs={inputs}
          result={result}
          onComplete={(leadData, base64) => {
            setLead(leadData)
            setPdfBase64(base64)
            setStep(3)
          }}
        />
      )}
      {step === 3 && result && (
        <Step3Results
          inputs={inputs}
          result={result}
          lead={lead}
          pdfBase64={pdfBase64}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
