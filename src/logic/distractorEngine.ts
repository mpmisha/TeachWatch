import type { ClockTime, LevelConfig } from '../types/game';
import { formatTime, randomTimeForLevel } from './timeUtils';

/** Wrap hour into 1-12 range. */
function wrapHour(h: number): number {
  return ((h - 1 + 12) % 12) + 1;
}

/**
 * Generate exactly 3 unique distractor time strings for a given correct time.
 * Distractors use targeted traps that mimic common misreadings.
 */
export function generateDistractors(
  correctTime: ClockTime,
  level: LevelConfig,
): string[] {
  const correctStr = formatTime(correctTime);
  const distractors: string[] = [];

  function tryAdd(time: ClockTime): boolean {
    if (time.hours < 1 || time.hours > 12) return false;
    if (time.minutes < 0 || time.minutes > 59) return false;
    const str = formatTime(time);
    if (str === correctStr) return false;
    if (distractors.includes(str)) return false;
    distractors.push(str);
    return true;
  }

  // 1. Hour Trap (+1)
  if (distractors.length < 3) {
    tryAdd({ hours: wrapHour(correctTime.hours + 1), minutes: correctTime.minutes });
  }

  // 2. Hour Trap (-1)
  if (distractors.length < 3) {
    tryAdd({ hours: wrapHour(correctTime.hours - 1), minutes: correctTime.minutes });
  }

  // 3. Mirror Trap: minutes mirrored around :30
  if (distractors.length < 3) {
    let mirrored = 60 - correctTime.minutes;
    if (mirrored === 60) mirrored = 0;
    if (level.allowedMinutes.includes(mirrored)) {
      tryAdd({ hours: correctTime.hours, minutes: mirrored });
    }
  }

  // 4. Swap Trap: minute-hand number read literally
  if (distractors.length < 3) {
    if (correctTime.minutes >= 5 && correctTime.minutes % 5 === 0) {
      const swapped = correctTime.minutes / 5;
      tryAdd({ hours: correctTime.hours, minutes: swapped });
    }
  }

  // 5. Random fallback
  let attempts = 0;
  while (distractors.length < 3 && attempts < 100) {
    attempts++;
    const rand = randomTimeForLevel(level);
    tryAdd(rand);
  }

  return distractors;
}
