import type { Question, LevelConfig } from '../types/game';
import { randomTimeForLevel, formatTime } from './timeUtils';
import { generateDistractors } from './distractorEngine';

/**
 * Generate an array of questions for a game session.
 * Each question has a random time, 4 options (1 correct + 3 distractors),
 * and a correctIndex pointing to the right answer.
 */
export function generateQuestions(level: LevelConfig, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const time = randomTimeForLevel(level);
    const correctStr = formatTime(time);
    const distractors = generateDistractors(time, level);

    // Place the correct answer at a random position among the 4 options
    const correctIndex = Math.floor(Math.random() * 4);
    const options: string[] = [];
    let dIdx = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot === correctIndex) {
        options.push(correctStr);
      } else {
        options.push(distractors[dIdx++]);
      }
    }

    questions.push({ time, options, correctIndex });
  }

  return questions;
}
