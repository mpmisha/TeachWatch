# Game Logic Engineer — Tasks

## Task T1 — Chunk C1: Shared Types, Level Config & Time Utilities
- **Phase**: 0
- **Dependencies**: C0 (project scaffolding must exist)
- **Files to create**:
  - `src/types/game.ts`
  - `src/logic/levelConfig.ts`
  - `src/logic/timeUtils.ts`

### Description

Define all shared TypeScript types/interfaces and foundational utility functions that every other chunk depends on. This is the contract layer — get the types right and everything downstream can build in parallel.

### `src/types/game.ts`

Export all of the following as named exports:

```typescript
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
export type View = 'levelSelect' | 'game' | 'summary' | 'highScores';

/** SVG clock animation state */
export type ClockAnimationState = 'idle' | 'correct' | 'incorrect' | 'sweeping';
```

### `src/logic/levelConfig.ts`

Export `LEVELS: LevelConfig[]` — an array of 6 level configs. Import `LevelConfig` from `../types/game`.

| Level | Name | allowedMinutes | showNumbers | showFiveMinuteLabels | showMinuteTicks |
|-------|------|---------------|-------------|---------------------|----------------|
| 1 | Hours Only | `[0]` | true | false | false |
| 2 | The Half-Hour | `[0, 30]` | true | false | true |
| 3 | Five-Minute Jumps | `[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]` | true | true | true |
| 4 | The Minute Tracker | all 0-59 | true | true | true |
| 5 | Standard Clock | all 0-59 | true | false | true |
| 6 | The Expert | all 0-59 | false | false | true |

Also export a helper: `getLevelConfig(level: number): LevelConfig` that returns `LEVELS[level - 1]`.

### `src/logic/timeUtils.ts`

Import `ClockTime`, `LevelConfig` from `../types/game`.

```typescript
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
```

### Edge Cases
- All `allowedMinutes` arrays for levels 4-6 should contain every integer 0-59. Generate this programmatically: `Array.from({ length: 60 }, (_, i) => i)`.
- `hours` must always be 1-12, never 0 or 13+.
- `formatTime` must zero-pad minutes: `3:05` not `3:5`.

---

## Task T2 — Chunk C3: Question Engine, Distractor Engine & Scoring
- **Phase**: 1
- **Dependencies**: C0, C1 (shared types and timeUtils must exist)
- **Files to create**:
  - `src/logic/questionEngine.ts`
  - `src/logic/distractorEngine.ts`
  - `src/logic/scoring.ts`

### Description

Implement pure-function game logic with no React dependencies. All functions should be testable in isolation.

### `src/logic/distractorEngine.ts`

Import `ClockTime`, `LevelConfig` from `../types/game` and `formatTime`, `randomTimeForLevel` from `./timeUtils`.

```typescript
/**
 * Generate exactly 3 unique distractor time strings for a given correct time.
 * Distractors use targeted traps that mimic common misreadings:
 */
export function generateDistractors(
  correctTime: ClockTime,
  level: LevelConfig
): string[];
```

**Trap strategies** (try in order, skip if result duplicates correct answer or another distractor):

1. **Hour Trap**: Same minutes, hour + 1 (wrap 12 → 1).
   - e.g., correct `3:15` → distractor `4:15`

2. **Hour Trap (minus)**: Same minutes, hour - 1 (wrap 1 → 12).
   - e.g., correct `3:15` → distractor `2:15`

3. **Mirror Trap**: Same hour, minutes mirrored around :30 (i.e., `60 - minutes`; if result is 60, use 0).
   - e.g., correct `3:15` → distractor `3:45`
   - Only generate if the mirrored minutes value is in the level's `allowedMinutes`.

4. **Swap Trap**: Treat the minute-hand's pointed number as minutes instead of the 5× value.
   - e.g., correct `3:10` (minute hand points to 2) → distractor `3:02`
   - Only applicable when `minutes >= 5` and `minutes % 5 === 0`.

5. **Random fallback**: Generate random valid times using `randomTimeForLevel` until 3 unique distractors are found.

**Validation rules**:
- No distractor may equal the correct answer's formatted string.
- All 3 distractors must be unique strings.
- All distractors must be valid times (hours 1-12, minutes 0-59).

### `src/logic/questionEngine.ts`

Import `Question`, `LevelConfig` from `../types/game` and `randomTimeForLevel`, `formatTime` from `./timeUtils` and `generateDistractors` from `./distractorEngine`.

```typescript
/**
 * Generate an array of questions for a game session.
 * Each question has a random time, 4 options (1 correct + 3 distractors),
 * and a correctIndex pointing to the right answer.
 */
export function generateQuestions(level: LevelConfig, count: number): Question[];
```

Implementation:
1. Loop `count` times.
2. Generate a random time via `randomTimeForLevel(level)`.
3. Generate 3 distractors via `generateDistractors(time, level)`.
4. Build `options` array: insert correct answer (`formatTime(time)`) at a random index (0-3), fill remaining slots with distractors.
5. Set `correctIndex` to the position of the correct answer.

**Edge case**: For Level 1 (only 12 possible times: 1:00-12:00), ensure the 3 distractors don't exhaust the pool. With 12 options this is fine, but the code should handle it gracefully.

### `src/logic/scoring.ts`

Import `SessionResult`, `Question`, `Answer` from `../types/game`.

```typescript
/**
 * Calculate star rating from raw score.
 * 9-10 correct → 3 stars
 * 7-8 correct → 2 stars
 * 0-6 correct → 1 star
 */
export function calculateStars(score: number): 1 | 2 | 3;

/**
 * Build a complete SessionResult from raw game data.
 */
export function buildSessionResult(
  level: number,
  questions: Question[],
  answers: Answer[],
  totalTime: number
): SessionResult;
```

`buildSessionResult` counts correct answers, calls `calculateStars`, and assembles the `SessionResult` object.

### Edge Cases
- Distractor collisions: The Hour Trap for `12:00` must produce `1:00`, not `13:00`. Hour minus trap for `1:00` must produce `12:00`.
- Swap Trap only applies when applicable — skip silently otherwise.
- Mirror Trap: `60 - 0 = 60` → use `0` instead. But that equals the correct time for `:00` cases, so skip.
- If fewer than 3 trap strategies produce valid distractors, fill remaining with random fallback.
- `calculateStars` must handle score 0 (return 1 star).
