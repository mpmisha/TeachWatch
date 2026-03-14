import type { ClockAnimationState, ClockFeatures, ClockTime, HintHighlight } from '../../types/game';
import { useTranslation } from '../../i18n';
import { ClockFace, ClockHintOverlay } from './ClockFace';
import { ClockHands } from './ClockHands';
import './Clock.css';

export interface ClockProps {
  time: ClockTime;
  features: ClockFeatures;
  animationState?: ClockAnimationState;
  hintHighlight?: HintHighlight;
  size?: string;
  className?: string;
}

export function Clock({
  time,
  features,
  animationState = 'idle',
  hintHighlight,
  size = '300px',
  className,
}: ClockProps) {
  const { t } = useTranslation();
  const classes = ['clock-svg', `clock--${animationState}`, hintHighlight && 'clock--hinting', className]
    .filter(Boolean)
    .join(' ');
  const paddedMinutes = String(time.minutes).padStart(2, '0');

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={t.clockAriaLabel(time.hours, paddedMinutes)}
    >
      {hintHighlight && (
        <defs>
          <linearGradient id="hint-hand-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff8e1" />
            <stop offset="40%" stopColor="#ffe082" />
            <stop offset="100%" stopColor="#f9a825" />
          </linearGradient>
          <filter id="hint-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <ClockFace features={features} hintHighlight={hintHighlight} />
      <ClockHands time={time} hintHighlight={hintHighlight} />
      {hintHighlight && <ClockHintOverlay hintHighlight={hintHighlight} />}
    </svg>
  );
}
