import type { Question, Hint } from '../types/game';

/**
 * Generate a contextual hint for a question based on the level and translation templates.
 *
 * @param question - The current question with a ClockTime
 * @param level - Level number (1-6)
 * @param templates - Array of 6 hint template strings from translations (t.hintLevelMessages)
 * @returns A Hint object with the filled-in text
 */
export function generateHint(question: Question, level: number, templates: string[]): Hint {
  const idx = Math.min(Math.max(level - 1, 0), templates.length - 1);
  let text = templates[idx];

  const { hours, minutes } = question.time;
  const nearestFiveNum = Math.round(minutes / 5) % 12 || 12;
  const nearestFiveMin = Math.round(minutes / 5) * 5 % 60;

  text = text
    .replace(/\{hour\}/g, String(hours))
    .replace(/\{minutes\}/g, String(minutes))
    .replace(/\{nearestFive\}/g, String(nearestFiveNum))
    .replace(/\{nearestFiveMinutes\}/g, String(nearestFiveMin));

  return { text };
}