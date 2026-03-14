import { hourRotation, minuteRotation } from '../../logic/timeUtils';
import type { ClockTime, HintHighlight } from '../../types/game';

export interface ClockHandsProps {
  time: ClockTime;
  hintHighlight?: HintHighlight;
}

export function ClockHands({ time, hintHighlight }: ClockHandsProps) {
  const minuteDegrees = minuteRotation(time.minutes);
  const hourDegrees = hourRotation(time.hours, time.minutes);

  return (
    <g className="clock-hands" aria-hidden="true">
      <g
        className={`clock-hand-group${hintHighlight?.hand === 'hour' ? ' clock-hand--hint' : ''}`}
        style={{
          transform: `rotate(${hourDegrees}deg)`,
          transformOrigin: '50px 50px',
        }}
      >
        <line className="clock-hand clock-hand--hour" x1="50" y1="50" x2="50" y2="25" />
      </g>

      <g
        className={`clock-hand-group${hintHighlight?.hand === 'minute' ? ' clock-hand--hint' : ''}`}
        style={{
          // Known limitation: CSS can pick the long arc near 0/360 transitions.
          transform: `rotate(${minuteDegrees}deg)`,
          transformOrigin: '50px 50px',
        }}
      >
        <line className="clock-hand clock-hand--minute" x1="50" y1="50" x2="50" y2="10" />
      </g>

      <circle className="clock-hand-cap" cx="50" cy="50" r="1.2" />
    </g>
  );
}
