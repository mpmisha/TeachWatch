import type { ClockAnimationState, ClockFeatures, HintHighlight, HintStage, Question } from '../../types/game'
import { useTranslation } from '../../i18n'
import { Clock } from '../Clock/Clock'
import { AnswerButtons } from './AnswerButtons'
import { HintButton } from './HintButton'

interface QuestionViewProps {
  question: Question
  activeHighlight?: HintHighlight
  hintStage: HintStage
  onTriggerHint: () => void
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
  activeHighlight,
  hintStage,
  onTriggerHint,
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
  const showAnswerButtons = animationState !== 'sweeping'

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
          hintHighlight={activeHighlight}
          size="clamp(220px, 48vw, 380px)"
        />
      </div>

      {hintsEnabled && <HintButton onClick={onTriggerHint} disabled={disabled} active={hintStage !== 'idle'} />}

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
