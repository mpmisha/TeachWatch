# Implementation Plan — TeachWatch Clock-Reading Game

## Summary

Build a child-friendly clock-reading educational game as a local web app using React + TypeScript + Vite. The game presents an SVG analog clock showing a random time, four multiple-choice answers (with targeted distractors), and progresses through 6 difficulty levels. Sessions are 10 questions each. Results are persisted to localStorage. The architecture splits into: project scaffolding, shared type contracts, an SVG clock renderer, a question/distractor engine, React UI components, and an integration layer. The plan maximizes parallelism by isolating file ownership per chunk.

---

## Phase 0: Scaffolding + Shared Contracts

### Chunk C0 — Project Scaffolding
- **Agent**: DevOps Engineer
- **Dependencies**: none
- **Files to create**:
  - `package.json`
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `tsconfig.node.json`
  - `vite.config.ts`
  - `eslint.config.js`
  - `index.html`
  - `src/main.tsx`
  - `src/vite-env.d.ts`
  - `.gitignore`
  - `public/favicon.svg`
- **Description**: Initialize the Vite + React + TypeScript project. Install dependencies: `react`, `react-dom`, `typescript`, `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`. Create `src/main.tsx` that imports `./App` and renders into `#root`. Do NOT create `App.tsx` — that is owned by C11 in Phase 3. The `main.tsx` import of `./App` will resolve once C11 creates it.

### Chunk C1 — Shared Types, Level Config & Time Utilities
- **Agent**: Game Logic Engineer
- **Dependencies**: C0
- **Files to create**:
  - `src/types/game.ts`
  - `src/logic/levelConfig.ts`
  - `src/logic/timeUtils.ts`
- **Description**: Define all shared TypeScript interfaces and types used across the app. Create the level configuration data (6 levels with their time constraints and clock feature flags). Implement time utility functions (rotation formulas, time formatting).

### Types to define in `src/types/game.ts`:

```typescript
// Time representation
interface ClockTime {
  hours: number;   // 1-12
  minutes: number; // 0-59
}

// Clock visual configuration per level
interface ClockFeatures {
  showNumbers: boolean;        // Show 1-12 numerals
  showFiveMinuteLabels: boolean; // Show 5-min helper labels (5,10,15...)
  showMinuteTicks: boolean;    // Show individual minute tick marks
}

// Level definition
interface LevelConfig {
  level: number;               // 1-6
  name: string;                // Display name
  description: string;         // Short description
  learningGoal: string;        // What the child learns
  allowedMinutes: number[];    // Which minute values are valid (e.g. [0] for level 1, [0,30] for level 2)
  clockFeatures: ClockFeatures;
}

// A single question
interface Question {
  time: ClockTime;
  options: string[];           // 4 formatted time strings (e.g. "3:15")
  correctIndex: number;        // Index of correct answer in options[]
}

// A single answer record
interface Answer {
  questionIndex: number;
  selectedIndex: number;
  correct: boolean;
  timeSpent: number;           // milliseconds
}

// Full session result passed to Summary
interface SessionResult {
  level: number;
  score: number;               // correct answers out of 10
  totalTime: number;           // seconds
  stars: 1 | 2 | 3;
  answers: Answer[];
  questions: Question[];
}

// Per-level high score record
interface LevelRecord {
  bestScore: number;
  fastestTime: number;         // seconds
  lastPlayed: string;          // ISO date string
}

// All high scores keyed by level number
type HighScores = Record<number, LevelRecord>;

// App navigation state
type View = 'levelSelect' | 'game' | 'summary' | 'highScores';

// Clock animation state for SVG feedback
type ClockAnimationState = 'idle' | 'correct' | 'incorrect' | 'sweeping';
```

### Functions to define in `src/logic/timeUtils.ts`:

```typescript
// Minute hand rotation: minutes * 6°
function minuteRotation(minutes: number): number;

// Hour hand rotation: (hours % 12) * 30° + minutes * 0.5°
function hourRotation(hours: number, minutes: number): number;

// Format ClockTime to display string: "3:05", "12:00"
function formatTime(time: ClockTime): string;

// Generate a random ClockTime valid for a given level's allowedMinutes
function randomTimeForLevel(levelConfig: LevelConfig): ClockTime;
```

---

## Phase 1: Core Building Blocks (parallel)

All chunks in this phase depend on C0 + C1 and can execute simultaneously.

### Chunk C2 — Analog Clock SVG Component
- **Agent**: SVG Animation Engineer
- **Dependencies**: C0, C1
- **Files to create**:
  - `src/components/Clock/Clock.tsx`
  - `src/components/Clock/ClockFace.tsx`
  - `src/components/Clock/ClockHands.tsx`
  - `src/components/Clock/Clock.css`
- **Description**: Build the full analog clock as an SVG with a 100×100 viewBox centered at (50,50). The `Clock` component accepts `time: ClockTime`, `features: ClockFeatures`, `animationState: ClockAnimationState`, and optional `size` prop. `ClockFace` renders the outer circle, tick marks, 5-minute labels, and hour numerals (conditionally based on `ClockFeatures`). `ClockHands` renders hour hand (length 25-30, thicker) and minute hand (length 40-45, thinner) with CSS `transform: rotate()` driven by `timeUtils.hourRotation()` and `timeUtils.minuteRotation()`. CSS transitions on `transform` property enable smooth sweeping between questions. Animation states: `correct` → green pulse, `incorrect` → red wiggle, `sweeping` → smooth rotation transition. Include a center cap circle.

### Chunk C3 — Question & Distractor Engine + Scoring
- **Agent**: Game Logic Engineer
- **Dependencies**: C0, C1
- **Files to create**:
  - `src/logic/questionEngine.ts`
  - `src/logic/distractorEngine.ts`
  - `src/logic/scoring.ts`
- **Description**: Implement pure-function engines with no React dependencies.

  **questionEngine.ts**: `generateQuestions(level: LevelConfig, count: number): Question[]` — generates `count` questions for a level. Uses `randomTimeForLevel()` from timeUtils, then calls the distractor engine to build 3 wrong answers + 1 correct, shuffled.

  **distractorEngine.ts**: `generateDistractors(correctTime: ClockTime, level: LevelConfig): string[]` — returns exactly 3 distractor strings. Implements targeted traps from the design doc:
  - *Hour Trap*: correct minutes, hour ±1
  - *Swap Trap*: e.g., 3:10 → "3:02" (misreading hand)
  - *Mirror Trap*: e.g., hh:15 → hh:45 (visual opposite)
  Fallback to random valid times if traps overlap with the correct answer.

  **scoring.ts**: `calculateStars(score: number): 1 | 2 | 3` — 10/10 or 9/10 → 3 stars, 7-8 → 2 stars, ≤6 → 1 star. `buildSessionResult(level, questions, answers, totalTime): SessionResult`.

### Chunk C4 — Reusable UI Primitives
- **Agent**: Expert React Frontend Engineer
- **Dependencies**: C0, C1
- **Files to create**:
  - `src/components/common/Button.tsx`
  - `src/components/common/Button.css`
  - `src/components/GameSession/AnswerButtons.tsx`
  - `src/components/GameSession/AnswerButtons.css`
  - `src/components/GameSession/ProgressBar.tsx`
  - `src/components/GameSession/ProgressBar.css`
- **Description**: Build shared UI primitives.

  **Button**: A styled `<button>` with variants (`primary`, `secondary`, `answer`), `disabled` state, and large touch targets (min 60px height). Accepts `onClick`, `children`, `variant`, `disabled`, `className`.

  **AnswerButtons**: Renders 4 `Button` components in a 2×2 grid. Props: `options: string[]`, `onAnswer: (index: number) => void`, `disabled: boolean`, `highlightIndex?: number`, `highlightType?: 'correct' | 'incorrect'`. The highlight props support post-answer feedback (green the correct one, red the wrong one).

  **ProgressBar**: Horizontal bar showing progress through 10 questions. Props: `current: number` (0-9), `total: number` (10). Visual dots or segments, filled for completed questions.

### Chunk C5 — Level Select Screen
- **Agent**: Expert React Frontend Engineer
- **Dependencies**: C0, C1
- **Files to create**:
  - `src/components/LevelSelect/LevelSelect.tsx`
  - `src/components/LevelSelect/LevelCard.tsx`
  - `src/components/LevelSelect/LevelSelect.css`
- **Description**: Build the home / level selection screen.

  **LevelSelect**: Full-screen view showing a title ("TeachWatch"), a grid of 6 `LevelCard` components, and a "High Scores" button. Props: `highScores: HighScores`, `onSelectLevel: (level: number) => void`, `onViewHighScores: () => void`.

  **LevelCard**: Card for one level showing: level number, name, learning goal, and best score/medal if a `LevelRecord` exists. Props: `config: LevelConfig`, `record?: LevelRecord`, `onClick: () => void`.

### Chunk C6 — State Hooks (High Scores + Timer)
- **Agent**: Expert React Frontend Engineer
- **Dependencies**: C0, C1
- **Files to create**:
  - `src/hooks/useHighScores.ts`
  - `src/hooks/useTimer.ts`
- **Description**:

  **useHighScores**: Custom hook managing localStorage persistence. Returns `{ highScores: HighScores, updateHighScore: (level: number, result: SessionResult) => void }`. Reads from `localStorage` key `'teachwatch-highscores'` on mount. The `updateHighScore` function only updates if score is better or time is faster. Writes back to localStorage on every update.

  **useTimer**: Simple elapsed-time hook. Returns `{ elapsed: number, start: () => void, stop: () => number, reset: () => void }`. Uses `useRef` + `useEffect` with `setInterval` (1s granularity is fine). `stop()` returns final elapsed seconds.

### Chunk C7 — Design System (Tokens + Global Styles)
- **Agent**: Designer
- **Dependencies**: C0
- **Files to create**:
  - `src/styles/tokens.css`
  - `src/index.css`
- **Description**: Establish the visual design system for a children's educational game.

  **tokens.css**: CSS custom properties for:
  - Color palette: bright, friendly, high-contrast colors. Primary (blue), success (green), error (red), warning (amber), backgrounds, text colors.
  - Typography: child-friendly sans-serif font stack, size scale (sm, base, lg, xl, 2xl).
  - Spacing scale: 4px base unit (--space-1 through --space-8).
  - Border radii: rounded-sm, rounded, rounded-lg, rounded-full.
  - Shadows: subtle elevation for cards and buttons.
  - Touch targets: `--touch-min: 60px`.
  - Transition durations: `--transition-fast: 150ms`, `--transition-normal: 300ms`, `--transition-slow: 600ms`.

  **index.css**: Global reset, box-sizing, body font/color defaults, `#root` full-height layout, no-scroll (`overflow: hidden`, `height: 100dvh`). Import tokens.css.

---

## Phase 2: Feature Assembly (parallel)

### Chunk C8 — Game Session Screen
- **Agent**: Expert React Frontend Engineer
- **Dependencies**: C2, C3, C4, C6
- **Files to create**:
  - `src/hooks/useGameSession.ts`
  - `src/components/GameSession/GameSession.tsx`
  - `src/components/GameSession/QuestionView.tsx`
  - `src/components/GameSession/FeedbackOverlay.tsx`
  - `src/components/GameSession/GameSession.css`
- **Description**: The main gameplay screen orchestrating the 10-question loop.

  **useGameSession**: Hook managing the session state machine. Takes `level: number`. Initializes by generating 10 questions via `questionEngine`. Tracks current question index, answers array, animation state. Exposes: `{ currentQuestion, questionNumber, totalQuestions, animationState, handleAnswer, sessionResult }`. `handleAnswer(index)` records the answer, triggers `correct` or `incorrect` animation state, waits ~1.5s, then advances. When question 10 is answered, `sessionResult` becomes non-null.

  **GameSession**: Container component. Props: `level: number`, `onComplete: (result: SessionResult) => void`, `onQuit: () => void`. Renders `ProgressBar` at top, `QuestionView` in center, quit button. When `sessionResult` is set, calls `onComplete`.

  **QuestionView**: Renders the `Clock` component and `AnswerButtons` side by side (or stacked on narrow viewports). Props: `question: Question`, `animationState: ClockAnimationState`, `clockFeatures: ClockFeatures`, `onAnswer: (index: number) => void`, `disabled: boolean`.

  **FeedbackOverlay**: Brief text overlay ("Correct!" / "Try again") shown during feedback phase. Props: `type: 'correct' | 'incorrect'`, `visible: boolean`. Uses CSS transitions for fade-in/out.

### Chunk C9 — Summary View
- **Agent**: Expert React Frontend Engineer
- **Dependencies**: C2, C3
- **Files to create**:
  - `src/components/Summary/Summary.tsx`
  - `src/components/Summary/StarRating.tsx`
  - `src/components/Summary/TrickyTimes.tsx`
  - `src/components/Summary/Summary.css`
- **Description**: After-action report shown after completing 10 questions.

  **Summary**: Full-screen overlay. Props: `result: SessionResult`, `clockFeatures: ClockFeatures`, `onTryAgain: () => void`, `onLevelSelect: () => void`. Shows performance score as stars, the score (e.g., "8 / 10"), total time, the TrickyTimes section (only if errors exist), and two action buttons.

  **StarRating**: Renders 1-3 filled/empty stars. Props: `stars: 1 | 2 | 3`.

  **TrickyTimes**: Grid of small `Clock` components for each incorrectly answered question. Each cell shows a mini clock, the correct time, and what the child clicked. Props: `questions: Question[]`, `answers: Answer[]`, `clockFeatures: ClockFeatures`. Filter to only incorrect answers.

### Chunk C10 — High Scores View
- **Agent**: Expert React Frontend Engineer
- **Dependencies**: C1, C6
- **Files to create**:
  - `src/components/HighScores/HighScores.tsx`
  - `src/components/HighScores/Medal.tsx`
  - `src/components/HighScores/HighScores.css`
- **Description**: Progress tracking / trophy room.

  **HighScores**: Full-screen view showing a table/grid. Each level row displays: level name, best score, fastest time, last played, and a medal. Props: `highScores: HighScores`, `onBack: () => void`. Show all 6 levels; unplayed levels appear locked/grey.

  **Medal**: Visual medal component (gold/silver/bronze/none). Props: `score: number`. 10/10 → gold, 8-9 → silver, 6-7 → bronze, <6 → none. Render as an SVG or styled div with color + icon.

---

## Phase 3: Integration

### Chunk C11 — App Wiring + Navigation
- **Agent**: Expert React Frontend Engineer
- **Dependencies**: C5, C7, C8, C9, C10
- **Files to create**:
  - `src/App.tsx`
  - `src/App.css`
- **Description**: Wire all views together with simple state-based navigation (no router library needed).

  **App**: Top-level component. Manages `currentView: View` and `selectedLevel: number` state. Uses `useHighScores` hook. Renders one of: `LevelSelect`, `GameSession`, `Summary`, or `HighScores` based on `currentView`. Navigation callbacks:
  - `LevelSelect.onSelectLevel` → set level, switch to `'game'`
  - `LevelSelect.onViewHighScores` → switch to `'highScores'`
  - `GameSession.onComplete` → update high scores, store result, switch to `'summary'`
  - `GameSession.onQuit` → switch to `'levelSelect'`
  - `Summary.onTryAgain` → switch to `'game'` (same level)
  - `Summary.onLevelSelect` → switch to `'levelSelect'`
  - `HighScores.onBack` → switch to `'levelSelect'`

  **App.css**: Minimal layout wrapper styles (full-height flex container).

---

## Edge Cases

1. **Distractor collisions**: Generated distractors may duplicate the correct answer or each other. The distractor engine must validate uniqueness and fall back to random alternatives.
2. **Level 1 limited options**: With only `hh:00` times and 12 possible hours, distractors must not repeat. For levels with very few valid times, the engine should handle limited pools gracefully.
3. **Hour wrap-around**: Hour trap for 12:xx must produce 1:xx (not 13:xx). Hour trap for 1:xx must produce 12:xx (not 0:xx).
4. **Clock hand sweep direction**: When transitioning between questions, the CSS transition should take the shorter rotation path. This may need explicit handling if rotating from 350° to 10° (should go +20°, not -340°).
5. **localStorage missing/corrupt**: `useHighScores` must handle missing data, malformed JSON, and quota exceeded errors gracefully — fallback to empty state.
6. **Fast double-tap**: Disable answer buttons immediately after the first tap to prevent double-answering a question.
7. **Viewport constraints**: The design requires no scrolling. The layout must fit in 100dvh. Test on common mobile and tablet viewports.
8. **12 vs 0 hours**: Times should use 1-12 format, never 0.

## Open Questions

1. **Sound effects**: The design doc mentions a "Success" sound. Should we include placeholder audio files, use the Web Audio API for generated sounds, or defer sound to a future iteration?
2. **Animations timing**: The design says to show the correct answer briefly on incorrect responses. Exact timing (1s? 1.5s? 2s?) should be tuned during playtesting.
3. **Level unlocking**: Should levels be unlocked progressively (must complete level N before N+1), or all available from the start? The design doc doesn't specify locking.
4. **Responsive breakpoints**: What's the primary target device — tablet, phone, or desktop? This affects the clock/button layout (side-by-side vs stacked).
