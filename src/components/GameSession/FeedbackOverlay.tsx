import { useTranslation } from '../../i18n';

interface FeedbackOverlayProps {
  type: 'correct' | 'incorrect'
  visible: boolean
}

export function FeedbackOverlay({ type, visible }: FeedbackOverlayProps) {
  const { t } = useTranslation();
  const className = [
    'feedback-overlay',
    `feedback-overlay--${type}`,
    visible ? 'feedback-overlay--visible' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const message = type === 'correct' ? t.correct : t.notQuite

  return (
    <div className={className} aria-live="polite" aria-hidden={!visible}>
      {message}
    </div>
  )
}

export default FeedbackOverlay
