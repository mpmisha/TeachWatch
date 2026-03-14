import { useEffect, useRef } from 'react'
import type { SessionResult } from '../../types/game'
import { LEVELS } from '../../logic/levelConfig'
import { useGameSession } from '../../hooks/useGameSession'
import { useTranslation } from '../../i18n'
import Button from '../common/Button'
import { ProgressBar } from './ProgressBar'
import { QuestionView } from './QuestionView'
import { FeedbackOverlay } from './FeedbackOverlay'
import './GameSession.css'

interface GameSessionProps {
  level: number
  hintsEnabled: boolean
  onComplete: (result: SessionResult) => void
  onQuit: () => void
}

export function GameSession({ level, hintsEnabled, onComplete, onQuit }: GameSessionProps) {
  const { t } = useTranslation()
  const {
    currentQuestion,
    activeHighlight,
    hintStage,
    triggerHint,
    questionResults,
    questionNumber,
    totalQuestions,
    animationState,
    clockFeatures,
    handleAnswer,
    answerFeedback,
    sessionResult,
  } = useGameSession(level)

  const completionSentRef = useRef(false)
  const levelIndex = Math.min(Math.max(level - 1, 0), LEVELS.length - 1)
  const levelName = t.levels[levelIndex]?.name ?? ''
  const levelTip = questionNumber === 1 ? t.levels[levelIndex]?.tips[0] : undefined

  useEffect(() => {
    completionSentRef.current = false
  }, [level])

  useEffect(() => {
    if (!sessionResult || completionSentRef.current) {
      return
    }

    completionSentRef.current = true
    onComplete(sessionResult)
  }, [onComplete, sessionResult])

  const feedbackType = answerFeedback?.highlightType ?? 'correct'
  const feedbackVisible = animationState === 'correct' || animationState === 'incorrect'
  const answersDisabled = !currentQuestion || animationState !== 'idle'

  return (
    <main className="game-session" aria-label={t.levelGameSession(level)}>
      <header className="game-session__header">
        <Button variant="secondary" onClick={onQuit} className="game-session__quit-button">
          {t.quit}
        </Button>
        <h2 className="game-session__level-title">
          {t.levelLabel(level)} – {levelName}
        </h2>
        <div className="game-session__progress-wrap">
          <ProgressBar current={Math.max(0, questionNumber - 1)} total={totalQuestions} results={questionResults} />
        </div>
      </header>

      <section className="game-session__content">
        {currentQuestion ? (
          <QuestionView
            question={currentQuestion}
            clockFeatures={clockFeatures}
            animationState={animationState}
            onAnswer={handleAnswer}
            disabled={answersDisabled}
            answerFeedback={answerFeedback}
            questionNumber={questionNumber}
            level={level}
            levelTip={levelTip}
            activeHighlight={activeHighlight ?? undefined}
            hintStage={hintStage}
            onTriggerHint={triggerHint}
            hintsEnabled={hintsEnabled}
          />
        ) : (
          <div className="game-session__loading">{t.preparingQuestions}</div>
        )}

        <FeedbackOverlay type={feedbackType} visible={feedbackVisible} />
      </section>
    </main>
  )
}

export default GameSession
