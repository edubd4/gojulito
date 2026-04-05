interface Step {
  label: string
}

interface Props {
  steps: Step[]
  currentStep: number // 1-based
}

export default function StepIndicator({ steps, currentStep }: Props) {
  return (
    <div className="mb-10 relative">
      {/* Connecting line behind circles */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-gj-surface-highest z-0" />

      <div className="relative z-10 flex justify-between">
        {steps.map((step, idx) => {
          const stepNum = idx + 1
          const isActive = stepNum === currentStep
          const isDone = stepNum < currentStep

          return (
            <div key={step.label} className="flex flex-col items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm font-display ring-4 ring-gj-surface transition-all ${
                  isActive
                    ? 'bg-gj-amber-hv text-gj-surface shadow-lg shadow-gj-amber-hv/30'
                    : isDone
                    ? 'bg-gj-green text-white'
                    : 'bg-gj-surface-highest text-gj-secondary'
                }`}
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[10px] font-sans uppercase tracking-[0.1em] font-semibold text-center max-w-[80px] leading-tight ${
                  isActive ? 'text-gj-amber-hv' : isDone ? 'text-gj-green' : 'text-gj-secondary'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
