import type { LevelConfig } from '../types/game';

const ALL_MINUTES = Array.from({ length: 60 }, (_, i) => i);

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: 'Hours Only',
    description: 'Read the hour hand on a friendly clock.',
    learningGoal: 'Understanding the "Little Hand" and its position.',
    allowedMinutes: [0],
    clockFeatures: { showNumbers: true, showFiveMinuteLabels: false, showMinuteTicks: false },
  },
  {
    level: 2,
    name: 'The Half-Hour',
    description: 'Learn what happens when the big hand points down.',
    learningGoal: 'Introduction of the "Big Hand" and its 180-degree flip.',
    allowedMinutes: [0, 30],
    clockFeatures: { showNumbers: true, showFiveMinuteLabels: false, showMinuteTicks: true },
  },
  {
    level: 3,
    name: 'Five-Minute Jumps',
    description: 'Count by fives around the clock.',
    learningGoal: 'Learning the "Secret Identity" of numbers (e.g., 4 = 20).',
    allowedMinutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    clockFeatures: { showNumbers: true, showFiveMinuteLabels: true, showMinuteTicks: true },
  },
  {
    level: 4,
    name: 'The Minute Tracker',
    description: 'Read any minute on the clock.',
    learningGoal: 'Counting individual ticks between 5-minute labels.',
    allowedMinutes: ALL_MINUTES,
    clockFeatures: { showNumbers: true, showFiveMinuteLabels: true, showMinuteTicks: true },
  },
  {
    level: 5,
    name: 'Standard Clock',
    description: 'A real clock — no helper labels.',
    learningGoal: 'Removing the 5-minute helper labels; relying on memory.',
    allowedMinutes: ALL_MINUTES,
    clockFeatures: { showNumbers: true, showFiveMinuteLabels: false, showMinuteTicks: true },
  },
  {
    level: 6,
    name: 'The Expert',
    description: 'No numbers at all — just the hands and ticks.',
    learningGoal: 'Removing all numbers; relying on spatial orientation only.',
    allowedMinutes: ALL_MINUTES,
    clockFeatures: { showNumbers: false, showFiveMinuteLabels: false, showMinuteTicks: true },
  },
];

/** Look up a level config by level number (1-6). */
export function getLevelConfig(level: number): LevelConfig {
  return LEVELS[level - 1];
}
