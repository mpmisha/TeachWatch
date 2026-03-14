import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  Answer,
  ClockAnimationState,
  ClockFeatures,
  HintHighlight,
  HintStage,
  Question,
  SessionResult,
  VisualHint,
} from '../types/game'
import { generateVisualHint } from '../logic/hintEngine'
import { getLevelConfig } from '../logic/levelConfig'
import { generateQuestions } from '../logic/questionEngine'
import { buildSessionResult } from '../logic/scoring'
import { useHintSequence } from './useHintSequence'
import { useTimer } from './useTimer'

const TOTAL_QUESTIONS = 10
const FEEDBACK_DELAY_MS = 1500
const SWEEP_DELAY_MS = 600

type AnswerFeedback = {
  highlightIndex: number
  highlightType: 'correct' | 'incorrect'
}

export function useGameSession(level: number): {
  currentQuestion: Question | null
  activeHighlight: HintHighlight | null
  hintStage: HintStage
  triggerHint: () => void
  questionResults: boolean[]
  questionNumber: number
  totalQuestions: number
  animationState: ClockAnimationState
  clockFeatures: ClockFeatures
  handleAnswer: (selectedIndex: number) => void
  answerFeedback: AnswerFeedback | null
  sessionResult: SessionResult | null
} {
  const levelConfig = useMemo(() => getLevelConfig(level), [level])
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [animationState, setAnimationState] = useState<ClockAnimationState>('idle')
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null)
  const [isAnswerLocked, setIsAnswerLocked] = useState(false)
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null)
  const [questionResults, setQuestionResults] = useState<boolean[]>([])

  const visualHint = useMemo<VisualHint | null>(() => {
    const question = questions[questionIndex]
    if (!question) {
      return null
    }

    return generateVisualHint(question.time, level, levelConfig.clockFeatures)
  }, [questions, questionIndex, level, levelConfig.clockFeatures])

  const { hintStage, activeHighlight, triggerHint, cancelHint } = useHintSequence(visualHint)

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sweepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const questionStartRef = useRef<number>(Date.now())
  const answersRef = useRef<Answer[]>([])

  const { start, stop, reset } = useTimer()

  const clearPendingTimeouts = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = null
    }

    if (sweepTimeoutRef.current) {
      clearTimeout(sweepTimeoutRef.current)
      sweepTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    clearPendingTimeouts()
    cancelHint()

    const generatedQuestions = generateQuestions(levelConfig, TOTAL_QUESTIONS)
    setQuestions(generatedQuestions)
    setQuestionIndex(0)
    setAnimationState('idle')
    setAnswerFeedback(null)
    setIsAnswerLocked(false)
    setSessionResult(null)
    setQuestionResults([])
    answersRef.current = []
    questionStartRef.current = Date.now()

    reset()
    start()

    return () => {
      clearPendingTimeouts()
      cancelHint()
      stop()
    }
  }, [cancelHint, clearPendingTimeouts, levelConfig, reset, start, stop])

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      const question = questions[questionIndex]
      if (!question || isAnswerLocked || sessionResult) {
        return
      }

      setIsAnswerLocked(true)

      const isCorrect = selectedIndex === question.correctIndex
      const feedbackType: 'correct' | 'incorrect' = isCorrect ? 'correct' : 'incorrect'
      const nextAnswer: Answer = {
        questionIndex,
        selectedIndex,
        correct: isCorrect,
        timeSpent: Date.now() - questionStartRef.current,
      }

      answersRef.current = [...answersRef.current, nextAnswer]
      setQuestionResults((previousResults) => {
        const nextResults = [...previousResults]
        nextResults[questionIndex] = isCorrect
        return nextResults
      })

      setAnimationState(feedbackType)
      setAnswerFeedback({
        highlightIndex: isCorrect ? selectedIndex : question.correctIndex,
        highlightType: feedbackType,
      })

      feedbackTimeoutRef.current = setTimeout(() => {
        const isLastQuestion = questionIndex >= TOTAL_QUESTIONS - 1

        if (isLastQuestion) {
          const totalTime = stop()
          setSessionResult(buildSessionResult(level, questions, answersRef.current, totalTime))
          setAnimationState('idle')
          setAnswerFeedback(null)
          return
        }

        const nextQuestionIndex = questionIndex + 1
        setAnimationState('sweeping')
        setAnswerFeedback(null)
        cancelHint()
        setQuestionIndex(nextQuestionIndex)

        sweepTimeoutRef.current = setTimeout(() => {
          questionStartRef.current = Date.now()
          setAnimationState('idle')
          setIsAnswerLocked(false)
        }, SWEEP_DELAY_MS)
      }, FEEDBACK_DELAY_MS)
    },
    [cancelHint, isAnswerLocked, level, questionIndex, questions, sessionResult, stop],
  )

  return {
    currentQuestion: questions[questionIndex] ?? null,
    activeHighlight,
    hintStage,
    triggerHint,
    questionResults,
    questionNumber: Math.min(questionIndex + 1, TOTAL_QUESTIONS),
    totalQuestions: TOTAL_QUESTIONS,
    animationState,
    clockFeatures: levelConfig.clockFeatures,
    handleAnswer,
    answerFeedback,
    sessionResult,
  }
}
