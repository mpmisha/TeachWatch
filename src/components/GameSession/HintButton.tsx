import { useTranslation } from '../../i18n'
import './HintButton.css'

interface HintButtonProps {
  onClick: () => void
  disabled: boolean
  active: boolean
}

export function HintButton({ onClick, disabled, active }: HintButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`hint-trigger ${active ? 'hint-trigger--active' : ''}`}
      aria-label={t.hintButton}
      aria-pressed={active}
    >
      <span aria-hidden="true">✨</span>
    </button>
  )
}

export default HintButton