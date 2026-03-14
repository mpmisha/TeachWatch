/** Represents a clock time in 12-hour format */
export interface ClockTime {
  hours: number;   // 1-12
  minutes: number; // 0-59
}

/** Visual features of the clock, toggled per level */
export interface ClockFeatures {
  showNumbers: boolean;          // Show 1-12 hour numerals
  showFiveMinuteLabels: boolean; // Show 5,10,15... helper labels
  showMinuteTicks: boolean;      // Show individual minute tick marks
}

/** Configuration for a single difficulty level */
export interface LevelConfig {
  level: number;                 // 1-6
  name: string;                  // e.g. "Hours Only"
  description: string;           // Short description
  learningGoal: string;          // What the child learns
  allowedMinutes: number[];      // Valid minute values (e.g. [0] for level 1)
  clockFeatures: ClockFeatures;
}

/** A single question in a game session */
export interface Question {
  time: ClockTime;
  options: string[];             // 4 formatted time strings
  correctIndex: number;          // 0-3 index into options[]
}

/** Which stage of the visual hint is active */
export type HintStage = 'idle' | 'hour' | 'minute';

/** Describes what the clock should highlight during a hint */
export interface HintHighlight {
  hand: 'hour' | 'minute';
  highlightHourNumbers: number[];
  highlightFiveMinuteLabels: number[];
}

/** Full two-stage visual hint descriptor for one question */
export interface VisualHint {
  stage1: HintHighlight;
  stage2: HintHighlight;
}

/** Record of the player's answer to one question */
export interface Answer {
  questionIndex: number;
  selectedIndex: number;
  correct: boolean;
  timeSpent: number;             // milliseconds
}

/** Complete result of a 10-question session */
export interface SessionResult {
  level: number;
  score: number;                 // 0-10
  totalTime: number;             // seconds
  stars: 1 | 2 | 3;
  answers: Answer[];
  questions: Question[];
}

/** Persisted high-score record for one level */
export interface LevelRecord {
  bestScore: number;             // 0-10
  fastestTime: number;           // seconds
  lastPlayed: string;            // ISO date string
}

/** All high scores, keyed by level number (1-6) */
export type HighScores = Record<number, LevelRecord>;

/** App-level navigation state */
export type View = 'levelSelect' | 'levelIntro' | 'game' | 'summary' | 'highScores' | 'settings';

/** SVG clock animation state */
export type ClockAnimationState = 'idle' | 'correct' | 'incorrect' | 'sweeping';
