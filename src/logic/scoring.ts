import type { SessionResult, Question, Answer } from '../types/game';

/**
 * Calculate star rating from raw score.
 * 9-10 correct → 3 stars
 * 7-8  correct → 2 stars
 * 0-6  correct → 1 star
 */
export function calculateStars(score: number): 1 | 2 | 3 {
  if (score >= 9) return 3;
  if (score >= 7) return 2;
  return 1;
}

/**
 * Build a complete SessionResult from raw game data.
 */
export function buildSessionResult(
  level: number,
  questions: Question[],
  answers: Answer[],
  totalTime: number,
): SessionResult {
  const score = answers.filter((a) => a.correct).length;
  const stars = calculateStars(score);
  return { level, score, totalTime, stars, answers, questions };
}
