import type { ClockTime, LevelConfig } from '../types/game';

/** Minute hand rotation in degrees: minutes × 6 */
export function minuteRotation(minutes: number): number {
  return minutes * 6;
}

/** Hour hand rotation in degrees: (hours % 12) × 30 + minutes × 0.5 */
export function hourRotation(hours: number, minutes: number): number {
  return (hours % 12) * 30 + minutes * 0.5;
}

/** Format a ClockTime as a display string: "3:05", "12:00" */
export function formatTime(time: ClockTime): string {
  return `${time.hours}:${String(time.minutes).padStart(2, '0')}`;
}

/** Generate a random ClockTime valid for a given level's allowed minutes */
export function randomTimeForLevel(config: LevelConfig): ClockTime {
  const hours = Math.floor(Math.random() * 12) + 1; // 1-12
  const minutePool = config.allowedMinutes;
  const minutes = minutePool[Math.floor(Math.random() * minutePool.length)];
  return { hours, minutes };
}

/** Check if two ClockTimes are equal */
export function timesEqual(a: ClockTime, b: ClockTime): boolean {
  return a.hours === b.hours && a.minutes === b.minutes;
}
