import type { ReactNode } from 'react'
import './ProgressBar.css'

export interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps): ReactNode {
  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0
  const clampedCurrent = Math.max(0, Math.min(current, Math.max(0, safeTotal - 1)))

  if (safeTotal === 0) {
    return <div className="progress-bar" aria-hidden="true" />
  }

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label="Question progress"
      aria-valuemin={1}
      aria-valuemax={safeTotal}
      aria-valuenow={clampedCurrent + 1}
    >
      {Array.from({ length: safeTotal }, (_, index) => {
        const isComplete = index < clampedCurrent
        const isCurrent = index === clampedCurrent
        const stateClass = isCurrent
          ? 'progress-dot--current'
          : isComplete
            ? 'progress-dot--complete'
            : 'progress-dot--upcoming'

        return <span key={index} className={`progress-dot ${stateClass}`} aria-hidden="true" />
      })}
    </div>
  )
}

export default ProgressBar