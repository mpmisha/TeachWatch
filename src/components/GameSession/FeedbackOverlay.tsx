interface FeedbackOverlayProps {
  type: 'correct' | 'incorrect'
  visible: boolean
}

export function FeedbackOverlay({ type, visible }: FeedbackOverlayProps) {
  const className = [
    'feedback-overlay',
    `feedback-overlay--${type}`,
    visible ? 'feedback-overlay--visible' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const message = type === 'correct' ? 'Correct! ✓' : 'Not quite!'

  return (
    <div className={className} aria-live="polite" aria-hidden={!visible}>
      {message}
    </div>
  )
}

export default FeedbackOverlay
