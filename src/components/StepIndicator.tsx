'use client'

import Link from 'next/link'

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3
}

const STEPS = [
  { num: 1, label: 'Your Situation' },
  { num: 2, label: 'Calculating Your Model' },
  { num: 3, label: 'Your Results' },
] as const

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <Link
        href="/"
        className="inline-block text-sm text-parchment-600 hover:text-sienna-700 transition-colors mb-4"
      >
        ← Back to calculator home
      </Link>
      <div className="flex items-start">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.num
          const isCompleted = currentStep > step.num
          const lineCompleted = index < STEPS.length - 1 && currentStep > step.num

          return (
            <div key={step.num} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm
                    transition-colors
                    ${
                      isActive
                        ? 'bg-sienna-500 text-white shadow-cta'
                        : isCompleted
                          ? 'bg-sienna-500 text-white'
                          : 'bg-parchment-200 text-parchment-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`mt-2 text-sm text-center max-w-[100px] ${
                    isActive
                      ? 'text-sienna-700 font-bold'
                      : isCompleted
                        ? 'text-sienna-700 font-medium'
                        : 'text-parchment-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-5 min-w-[20px] ${
                    lineCompleted ? 'bg-sienna-500' : 'bg-parchment-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
