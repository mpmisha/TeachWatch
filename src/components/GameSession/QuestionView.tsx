import type { ClockAnimationState, ClockFeatures, Question } from '../../types/game'
import { useTranslation } from '../../i18n'
import { Clock } from '../Clock/Clock'
import { AnswerButtons } from './AnswerButtons'

interface QuestionViewProps {
  question: Question
  clockFeatures: ClockFeatures
  animationState: ClockAnimationState
  onAnswer: (index: number) => void
  disabled: boolean
  answerFeedback: { highlightIndex: number; highlightType: 'correct' | 'incorrect' } | null
}

export function QuestionView({
  question,
  clockFeatures,
  animationState,
  onAnswer,
  disabled,
  answerFeedback,
}: QuestionViewProps) {
  const { t } = useTranslation()
  const showAnswerButtons = animationState !== 'sweeping'

  return (
    <section className="question-view" aria-label={t.currentQuestion}>
      <div className="question-view__clock">
        <Clock
          time={question.time}
          features={clockFeatures}
          animationState={animationState}
          size="clamp(220px, 48vw, 380px)"
        />
      </div>

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
