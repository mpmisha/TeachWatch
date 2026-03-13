import type { ClockAnimationState, ClockFeatures, ClockTime } from '../../types/game';
import { ClockFace } from './ClockFace';
import { ClockHands } from './ClockHands';
import './Clock.css';

export interface ClockProps {
  time: ClockTime;
  features: ClockFeatures;
  animationState?: ClockAnimationState;
  size?: string;
  className?: string;
}

function buildAriaLabel(time: ClockTime): string {
  return `Analog clock showing ${time.hours}:${String(time.minutes).padStart(2, '0')}`;
}

export function Clock({
  time,
  features,
  animationState = 'idle',
  size = '300px',
  className,
}: ClockProps) {
  const classes = ['clock-svg', `clock--${animationState}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={buildAriaLabel(time)}
    >
      <ClockFace features={features} />
      <ClockHands time={time} />
    </svg>
  );
}
