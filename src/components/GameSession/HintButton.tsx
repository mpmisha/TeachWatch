import { useEffect, useId, useRef } from 'react'
import { useTranslation } from '../../i18n'
import Button from '../common/Button'
import './HintButton.css'

interface HintButtonProps {
  onClick: () => void
  disabled: boolean
}

interface HintPopupProps {
  text: string
  onClose: () => void
  visible: boolean
}

export function HintButton({ onClick, disabled }: HintButtonProps) {
  const { t } = useTranslation()

  return (
    <Button variant="secondary" onClick={onClick} disabled={disabled} className="hint-button">
      <span className="hint-button__icon" aria-hidden="true">💡</span>
      <span>{t.hintButton}</span>
    </Button>
  )
}

export function HintPopup({ text, onClose, visible }: HintPopupProps) {
  const { t } = useTranslation()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!visible) {
      return
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus()
    }
  }, [onClose, visible])

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return
    }

    event.preventDefault()
    closeButtonRef.current?.focus()
  }

  return (
    <div
      className={`hint-popup__backdrop ${visible ? 'hint-popup--visible' : ''}`}
      aria-hidden={!visible}
      onClick={onClose}
    >
      <div
        className="hint-popup__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        <h3 id={titleId} className="hint-popup__title">
          <span aria-hidden="true">🦉</span>
          <span>{t.hintButton}</span>
        </h3>

        <p className="hint-popup__text">{text}</p>

        <button
          ref={closeButtonRef}
          type="button"
          className="tw-button tw-button--primary hint-popup__close"
          onClick={onClose}
        >
          {t.hintClose}
        </button>
      </div>
    </div>
  )
}

export default HintButton