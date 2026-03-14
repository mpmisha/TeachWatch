import { useEffect, useState } from 'react'
import type { ClockAnimationState, ClockFeatures, Hint, Question } from '../../types/game'
import { useTranslation } from '../../i18n'
import { Clock } from '../Clock/Clock'
import { AnswerButtons } from './AnswerButtons'
import { HintButton, HintPopup } from './HintButton'

interface QuestionViewProps {
  question: Question
  hint: Hint | null
  hintsEnabled: boolean
  clockFeatures: ClockFeatures
  animationState: ClockAnimationState
  onAnswer: (index: number) => void
  disabled: boolean
  answerFeedback: { highlightIndex: number; highlightType: 'correct' | 'incorrect' } | null
  questionNumber: number
  level: number
  levelTip?: string
}

export function QuestionView({
  question,
  hint,
  hintsEnabled,
  clockFeatures,
  animationState,
  onAnswer,
  disabled,
  answerFeedback,
  questionNumber,
  level,
  levelTip,
}: QuestionViewProps) {
  const { t } = useTranslation()
  const [hintVisible, setHintVisible] = useState(false)
  const showAnswerButtons = animationState !== 'sweeping'

  useEffect(() => {
    setHintVisible(false)
  }, [question])

  return (
    <section className="question-view" aria-label={`${t.currentQuestion} ${questionNumber}`} data-level={level}>
      {levelTip && (
        <div className="question-view__tip-banner">
          <span className="question-view__tip-icon" aria-hidden="true">💡</span>
          <p className="question-view__tip-text">{levelTip}</p>
        </div>
      )}

      <div className="question-view__clock">
        <Clock
          time={question.time}
          features={clockFeatures}
          animationState={animationState}
          size="clamp(220px, 48vw, 380px)"
        />
      </div>

      {hintsEnabled && hint && <HintButton onClick={() => setHintVisible(true)} disabled={disabled} />}

      <HintPopup text={hint?.text ?? ''} onClose={() => setHintVisible(false)} visible={hintVisible} />

      <div className="question-view__answers" aria-live="polite">
        {showAnswerButtons ? (
          <AnswerButtons
            options={question.options}
            onAnswer={onAnswer}
            disabled={disabled}
            highlightIndex={answerFeedback?.highlightIndex}
            highlightType={answerFeedback?.highlightType}
          />
        ) : (
          <div className="question-view__transition">{t.nextQuestion}</div>
        )}
      </div>
    </section>
  )
}

export default QuestionView
