import type { ClockAnimationState, ClockFeatures, ClockTime, HintHighlight } from '../../types/game';
import { useTranslation } from '../../i18n';
import { ClockFace } from './ClockFace';
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
      <ClockFace features={features} hintHighlight={hintHighlight} />
      <ClockHands time={time} hintHighlight={hintHighlight} />
    </svg>
  );
}
