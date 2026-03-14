import type { ClockFeatures, ClockTime, HintHighlight, VisualHint } from '../types/game';

function buildHourStage(time: ClockTime): HintHighlight {
  const { hours, minutes } = time;
  const nextHour = (hours % 12) + 1;

  return {
    hand: 'hour',
    highlightHourNumbers: minutes === 0 ? [hours] : [hours, nextHour],
    highlightFiveMinuteLabels: [],
  };
}

function buildMinuteStage(time: ClockTime, level: number): HintHighlight {
  const { minutes } = time;

  if (level === 1 || minutes === 0) {
    return {
      hand: 'minute',
      highlightHourNumbers: [],
      highlightFiveMinuteLabels: [],
    };
  }

  const lowerFive = Math.floor(minutes / 5) * 5;
  const upperFive = (lowerFive + 5) % 60;

  const labels: number[] = [];

  if (minutes % 5 === 0) {
    if (lowerFive > 0) labels.push(lowerFive);
  } else {
    if (lowerFive > 0) labels.push(lowerFive);
    if (upperFive > 0) labels.push(upperFive);
  }

  return {
    hand: 'minute',
    highlightHourNumbers: [],
    highlightFiveMinuteLabels: labels,
  };
}

export function generateVisualHint(
  time: ClockTime,
  level: number,
  _clockFeatures: ClockFeatures,
): VisualHint {
  return {
    stage1: buildHourStage(time),
    stage2: buildMinuteStage(time, level),
  };
}