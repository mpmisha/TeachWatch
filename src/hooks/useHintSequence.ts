import { useCallback, useEffect, useRef, useState } from 'react'
import type { HintHighlight, HintStage, VisualHint } from '../types/game'

const HINT_STAGE_DURATION_MS = 3000

export function useHintSequence(visualHint: VisualHint | null): {
  hintStage: HintStage
  activeHighlight: HintHighlight | null
  triggerHint: () => void
  cancelHint: () => void
} {
  const [hintStage, setHintStage] = useState<HintStage>('idle')
  const [activeHighlight, setActiveHighlight] = useState<HintHighlight | null>(null)

  const stageOneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stageTwoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPendingTimers = useCallback(() => {
    if (stageOneTimerRef.current) {
      clearTimeout(stageOneTimerRef.current)
      stageOneTimerRef.current = null
    }

    if (stageTwoTimerRef.current) {
      clearTimeout(stageTwoTimerRef.current)
      stageTwoTimerRef.current = null
    }
  }, [])

  const cancelHint = useCallback(() => {
    clearPendingTimers()
    setHintStage('idle')
    setActiveHighlight(null)
  }, [clearPendingTimers])

  const triggerHint = useCallback(() => {
    if (!visualHint) {
      return
    }

    clearPendingTimers()
    setHintStage('hour')
    setActiveHighlight(visualHint.stage1)

    stageOneTimerRef.current = setTimeout(() => {
      setHintStage('minute')
      setActiveHighlight(visualHint.stage2)

      stageTwoTimerRef.current = setTimeout(() => {
        setHintStage('idle')
        setActiveHighlight(null)
        stageTwoTimerRef.current = null
      }, HINT_STAGE_DURATION_MS)

      stageOneTimerRef.current = null
    }, HINT_STAGE_DURATION_MS)
  }, [clearPendingTimers, visualHint])

  useEffect(() => {
    cancelHint()
  }, [cancelHint, visualHint])

  useEffect(() => {
    return () => {
      clearPendingTimers()
    }
  }, [clearPendingTimers])

  return {
    hintStage,
    activeHighlight,
    triggerHint,
    cancelHint,
  }
}