import type { ReactNode } from 'react'
import { useTranslation } from '../../i18n';
import Button from '../common/Button'
import './AnswerButtons.css'

export interface AnswerButtonsProps {
  options: string[]
  onAnswer: (index: number) => void
  disabled: boolean
  highlightIndex?: number
  highlightType?: 'correct' | 'incorrect'
}

export function AnswerButtons({
  options,
  onAnswer,
  disabled,
  highlightIndex,
  highlightType,
}: AnswerButtonsProps): ReactNode {
  const { t } = useTranslation();
  const safeOptions = Array.isArray(options) ? options.slice(0, 4) : []

  if (safeOptions.length === 0) {
    return <div className="answer-grid" aria-live="polite" />
  }

  return (
    <div className="answer-grid" aria-label={t.answerChoices} role="group">
      {safeOptions.map((option, index) => {
        const shouldHighlight = highlightIndex === index && highlightType
        const highlightClass = shouldHighlight ? `answer--${highlightType}` : ''

        return (
          <Button
            key={`${option}-${index}`}
            variant="answer"
            onClick={() => onAnswer(index)}
            disabled={disabled}
            className={`answer-choice ${highlightClass}`.trim()}
          >
            {option}
          </Button>
        )
      })}
    </div>
  )
}

export default AnswerButtons