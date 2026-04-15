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
        className="inline-block text-sm text-gray-500 hover:text-forest transition-colors mb-4"
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
                        ? 'bg-forest text-white'
                        : isCompleted
                          ? 'bg-forest text-white'
                          : 'bg-grey-mid text-gray-400'
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
                      ? 'text-forest font-bold'
                      : isCompleted
                        ? 'text-forest font-medium'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-5 min-w-[20px] ${
                    lineCompleted ? 'bg-forest' : 'bg-grey-mid'
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
