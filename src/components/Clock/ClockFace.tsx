import type { ClockFeatures } from '../../types/game';

export interface ClockFaceProps {
  features: ClockFeatures;
}

const HOUR_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const FIVE_MINUTE_LABELS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const;

function polarX(radius: number, degrees: number): number {
  return 50 + radius * Math.sin((degrees * Math.PI) / 180);
}

function polarY(radius: number, degrees: number): number {
  return 50 - radius * Math.cos((degrees * Math.PI) / 180);
}

export function ClockFace({ features }: ClockFaceProps) {
  return (
    <g className="clock-face" aria-hidden="true">
      <circle className="clock-rim" cx="50" cy="50" r="48" />

      {features.showMinuteTicks && (
        <g className="clock-ticks">
          {Array.from({ length: 60 }, (_, index) => {
            const degrees = index * 6;
            const longTick = index % 5 === 0;
            const innerRadius = longTick ? 42 : 44;
            const strokeWidth = longTick ? 0.9 : 0.45;

            return (
              <line
                key={index}
                className={longTick ? 'clock-tick clock-tick--hour' : 'clock-tick'}
                x1={polarX(innerRadius, degrees)}
                y1={polarY(innerRadius, degrees)}
                x2={polarX(48, degrees)}
                y2={polarY(48, degrees)}
                strokeWidth={strokeWidth}
              />
            );
          })}
        </g>
      )}

      {features.showNumbers && (
        <g className="clock-hour-numbers">
          {HOUR_NUMBERS.map((value) => {
            const degrees = value * 30;

            return (
              <text
                key={value}
                className="clock-hour-number"
                x={polarX(38, degrees)}
                y={polarY(38, degrees) + 2}
                textAnchor="middle"
              >
                {value}
              </text>
            );
          })}
        </g>
      )}

      {features.showFiveMinuteLabels && (
        <g className="clock-five-minute-labels">
          {FIVE_MINUTE_LABELS.map((value) => {
            const degrees = (value / 5) * 30;

            return (
              <text
                key={value}
                className="clock-five-minute-label"
                x={polarX(32, degrees)}
                y={polarY(32, degrees) + 1.5}
                textAnchor="middle"
              >
                {value}
              </text>
            );
          })}
        </g>
      )}

      <circle className="clock-center-dot" cx="50" cy="50" r="2" />
    </g>
  );
}
