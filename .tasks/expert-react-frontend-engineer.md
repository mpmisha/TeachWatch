# Expert React Frontend Engineer — Tasks

## Task T1 — Chunk C4: Reusable UI Primitives
- **Phase**: 1
- **Dependencies**: C0, C1 (shared types)
- **Files to create**:
  - `src/components/common/Button.tsx`
  - `src/components/common/Button.css`
  - `src/components/GameSession/AnswerButtons.tsx`
  - `src/components/GameSession/AnswerButtons.css`
  - `src/components/GameSession/ProgressBar.tsx`
  - `src/components/GameSession/ProgressBar.css`

### Description

Build the reusable UI components used throughout the game. These must be child-friendly with large touch targets.

**`Button.tsx`** — Generic styled button:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'answer'; // default: 'primary'
  disabled?: boolean;
  className?: string;
}
```
- Minimum height: 60px (use CSS variable `var(--touch-min, 60px)`).
- Rounded corners, clear visual feedback on hover/active.
- `disabled` state: reduced opacity, `pointer-events: none`.
- `variant="answer"` is for the answer grid — larger text, equal sizing.

**`Button.css`**: Styles for all variants. Use design token CSS variables with fallbacks. No scrolling — buttons should be prominent and tappable.

**`AnswerButtons.tsx`** — 2×2 grid of answer choices:
```typescript
interface AnswerButtonsProps {
  options: string[];              // Exactly 4 time strings
  onAnswer: (index: number) => void;
  disabled: boolean;              // Disable after answering
  highlightIndex?: number;        // Index to highlight
  highlightType?: 'correct' | 'incorrect'; // Color of highlight
}
```
- Renders 4 `Button` components in a CSS Grid (2 columns).
- Each button shows one option string (e.g., "3:15").
- After the player answers: `disabled=true` to prevent double-tap. The correct answer's button highlights green, the wrong answer (if any) highlights red via `highlightIndex` + `highlightType`.
- Gutter between buttons: at least 12px to prevent accidental taps.

**`AnswerButtons.css`**: Grid layout, highlight states (`.answer--correct`, `.answer--incorrect` with green/red backgrounds).

**`ProgressBar.tsx`** — Session progress indicator:
```typescript
interface ProgressBarProps {
  current: number;  // Current question index (0-based, 0-9)
  total: number;    // Total questions (10)
}
```
- Render as a horizontal row of circles/dots (one per question).
- Completed questions: filled dot. Current question: pulsing/active dot. Future: hollow dot.
- Keep compact — this sits at the top of the game screen.

**`ProgressBar.css`**: Flexbox layout, dot sizes, active/completed states with transitions.

### Edge Cases
- `options` array will always have exactly 4 items, but guard against empty/undefined.
- `highlightIndex` is optional — when not provided, no highlighting.
- Button text should handle variable-width time strings ("1:00" vs "12:55") without layout shifts.

---

## Task T2 — Chunk C5: Level Select Screen
- **Phase**: 1
- **Dependencies**: C0, C1 (types: `LevelConfig`, `LevelRecord`, `HighScores`; data: `LEVELS` from `levelConfig.ts`)
- **Files to create**:
  - `src/components/LevelSelect/LevelSelect.tsx`
  - `src/components/LevelSelect/LevelCard.tsx`
  - `src/components/LevelSelect/LevelSelect.css`

### Description

The home screen — first thing the child sees. Must be engaging and not overwhelming.

**`LevelSelect.tsx`** — Home screen container:
```typescript
interface LevelSelectProps {
  highScores: HighScores;
  onSelectLevel: (level: number) => void;
  onViewHighScores: () => void;
}
```
- Shows a title/header ("TeachWatch" or a friendly greeting).
- Renders a grid of 6 `LevelCard` components (2 or 3 columns depending on viewport).
- A "High Scores" / "Trophy Room" button at the bottom or top-right.
- Import `LEVELS` from `../../logic/levelConfig` to get level metadata.
- All content must fit above the fold — no scrolling.

**`LevelCard.tsx`** — Single level entry:
```typescript
interface LevelCardProps {
  config: LevelConfig;
  record?: LevelRecord;  // undefined if never played
  onClick: () => void;
}
```
- Shows: level number (large), level name, short learning goal description.
- If `record` exists: show best score (e.g., "8/10") and a small medal indicator.
- If no record: show as available but unplayed (no grey-out, all levels accessible).
- Touch target: the entire card is clickable.
- Visual polish: rounded corners, subtle shadow, hover lift effect.

**`LevelSelect.css`**: Grid layout for cards, title styling, responsive breakpoints. Cards should be child-friendly — colorful, spacious, inviting.

### Edge Cases
- All 6 levels should always be visible and selectable (no locking).
- `highScores` may be an empty object `{}` on first launch.
- Level cards should truncate long learning goal text gracefully on small screens.

---

## Task T3 — Chunk C6: Custom Hooks (useHighScores + useTimer)
- **Phase**: 1
- **Dependencies**: C0, C1 (types: `HighScores`, `LevelRecord`, `SessionResult`)
- **Files to create**:
  - `src/hooks/useHighScores.ts`
  - `src/hooks/useTimer.ts`

### Description

**`useHighScores.ts`** — localStorage persistence hook:
```typescript
export function useHighScores(): {
  highScores: HighScores;
  updateHighScore: (level: number, result: SessionResult) => void;
}
```
- On mount: read from `localStorage.getItem('teachwatch-highscores')`, parse JSON. If missing or malformed, initialize as `{}`.
- `updateHighScore`: Compare incoming result against existing `LevelRecord` for that level. Update if:
  - No existing record, OR
  - `result.score > existing.bestScore`, OR
  - `result.score === existing.bestScore && result.totalTime < existing.fastestTime`
  - Always update `lastPlayed` to `new Date().toISOString()`.
- After any update: write to `localStorage.setItem('teachwatch-highscores', JSON.stringify(...))`.
- Use `useState` for reactive updates + `useEffect` for initial load.

**`useTimer.ts`** — Elapsed time tracking hook:
```typescript
export function useTimer(): {
  elapsed: number;   // Current elapsed seconds
  start: () => void;
  stop: () => number; // Returns final elapsed seconds
  reset: () => void;
}
```
- Uses `useRef` for interval ID and start timestamp.
- `start()`: Records `Date.now()` and starts a `setInterval` updating `elapsed` state every 1s.
- `stop()`: Clears interval, calculates final elapsed from `Date.now() - startTime`, returns it.
- `reset()`: Clears interval, resets elapsed to 0.
- Cleanup: `useEffect` cleanup clears interval on unmount.

### Edge Cases
- `localStorage` may throw (quota exceeded, private browsing). Wrap in try/catch, degrade gracefully (scores just won't persist).
- `JSON.parse` may fail on corrupt data — catch and reset to `{}`.
- Timer must clean up interval on unmount to prevent memory leaks.
- `stop()` should be idempotent — calling it when already stopped returns last known elapsed.

---

## Task T4 — Chunk C8: Game Session Screen
- **Phase**: 2
- **Dependencies**: C2 (Clock component), C3 (questionEngine, scoring), C4 (AnswerButtons, ProgressBar), C6 (useTimer)
- **Files to create**:
  - `src/hooks/useGameSession.ts`
  - `src/components/GameSession/GameSession.tsx`
  - `src/components/GameSession/QuestionView.tsx`
  - `src/components/GameSession/FeedbackOverlay.tsx`
  - `src/components/GameSession/GameSession.css`

### Description

The core gameplay screen. Orchestrates the 10-question loop with feedback animations.

**`useGameSession.ts`** — Game session state machine:
```typescript
export function useGameSession(level: number): {
  currentQuestion: Question | null;
  questionNumber: number;          // 1-based (1-10)
  totalQuestions: number;          // 10
  animationState: ClockAnimationState;
  clockFeatures: ClockFeatures;
  handleAnswer: (selectedIndex: number) => void;
  answerFeedback: { highlightIndex: number; highlightType: 'correct' | 'incorrect' } | null;
  sessionResult: SessionResult | null;
}
```

State flow:
1. On init: call `generateQuestions(getLevelConfig(level), 10)`. Store questions array. Set `questionNumber = 1`.
2. `handleAnswer(index)`: Record the answer. If correct → set `animationState = 'correct'`. If incorrect → set `animationState = 'incorrect'`. Set `answerFeedback` with the correct answer's index and type. Start a timeout (~1500ms).
3. After timeout: If more questions remain → set `animationState = 'sweeping'`, advance to next question. After a brief sweep delay (~600ms), set `animationState = 'idle'`. If that was question 10 → build `sessionResult` via `buildSessionResult()`.
4. Track per-question time and total session time using `useTimer`.

Import `getLevelConfig` from `../../logic/levelConfig`, `generateQuestions` from `../../logic/questionEngine`, `buildSessionResult` from `../../logic/scoring`.

**`GameSession.tsx`** — Container:
```typescript
interface GameSessionProps {
  level: number;
  onComplete: (result: SessionResult) => void;
  onQuit: () => void;
}
```
- Renders: `ProgressBar` at top, `QuestionView` centered, `FeedbackOverlay` when active, quit/back button (small, top corner).
- When `sessionResult` becomes non-null, call `onComplete(sessionResult)`.
- Full-height layout fitting the viewport — no scrolling.

**`QuestionView.tsx`** — Single question display:
```typescript
interface QuestionViewProps {
  question: Question;
  clockFeatures: ClockFeatures;
  animationState: ClockAnimationState;
  onAnswer: (index: number) => void;
  disabled: boolean;
  answerFeedback: { highlightIndex: number; highlightType: 'correct' | 'incorrect' } | null;
}
```
- Renders `Clock` component (large, centered) and `AnswerButtons` below it.
- Passes `animationState` to Clock for visual feedback.
- Passes `answerFeedback` to AnswerButtons for highlight state.

**`FeedbackOverlay.tsx`** — Brief feedback text:
```typescript
interface FeedbackOverlayProps {
  type: 'correct' | 'incorrect';
  visible: boolean;
}
```
- When `visible`: shows "Correct! ✓" (green) or "Not quite!" (red) text centered over the game area.
- CSS transition: fade in/out over 200ms.
- Auto-hides — the parent controls visibility via the `visible` prop.

**`GameSession.css`**: Full-height flexbox layout, centered content, responsive stacking for clock + buttons.

### Edge Cases
- **Double-tap prevention**: Set `disabled=true` on AnswerButtons immediately when `handleAnswer` fires, before the timeout resolves.
- **Fast navigation**: If user clicks "quit" during feedback timeout, clear the timeout and navigate away cleanly.
- **Session result timing**: `onComplete` should fire once, not on every re-render. Use a `useEffect` watching `sessionResult`.
- **Question transition**: Between questions, briefly show the sweeping animation before revealing new answer options. This provides a visual cue that a new question has started.

---

## Task T5 — Chunk C9: Summary View
- **Phase**: 2
- **Dependencies**: C2 (Clock component for mini-clocks), C3 (scoring types)
- **Files to create**:
  - `src/components/Summary/Summary.tsx`
  - `src/components/Summary/StarRating.tsx`
  - `src/components/Summary/TrickyTimes.tsx`
  - `src/components/Summary/Summary.css`

### Description

After-action report shown after completing all 10 questions. Turns mistakes into teaching moments.

**`Summary.tsx`** — Full-screen result overlay:
```typescript
interface SummaryProps {
  result: SessionResult;
  clockFeatures: ClockFeatures;
  onTryAgain: () => void;
  onLevelSelect: () => void;
}
```
- Layout (top to bottom):
  1. `StarRating` — visual star display.
  2. Score text: "8 out of 10" or similar.
  3. Time display: "Completed in 2m 15s".
  4. `TrickyTimes` section — only shown if there are incorrect answers.
  5. Two action buttons: "Try Again" (same level) and "Level Select" (back to home).
- Full-screen layout, no scrolling. If many errors, TrickyTimes should use a compact grid that still fits.

**`StarRating.tsx`** — Visual star display:
```typescript
interface StarRatingProps {
  stars: 1 | 2 | 3;
  maxStars?: number; // default 3
}
```
- Render `maxStars` star shapes. Fill the first `stars` in gold, rest in grey.
- Stars can be simple Unicode (★/☆), SVG, or styled divs.
- Add a subtle entrance animation (scale-up with delay per star).

**`TrickyTimes.tsx`** — Grid of incorrectly answered questions:
```typescript
interface TrickyTimesProps {
  questions: Question[];
  answers: Answer[];
  clockFeatures: ClockFeatures;
}
```
- Filter to only incorrect answers (where `answer.correct === false`).
- For each: render a small `Clock` component (size ~80-100px) showing the question time, the correct answer text, and what the child selected.
- Grid layout: fit items compactly (2-3 columns).
- Import `Clock` from `../Clock/Clock`, import `formatTime` from `../../logic/timeUtils`.

**`Summary.css`**: Layout styles, star animations, result card styling.

### Edge Cases
- **Perfect score**: When all 10 correct, `TrickyTimes` is not rendered. Show a congratulatory message instead.
- **All wrong**: Up to 10 TrickyTimes items. Must still fit without scroll — may need smaller clocks or pagination at extremes (unlikely but handle gracefully).
- **Star entrance**: Animation should fire once on mount, not on re-render.

---

## Task T6 — Chunk C10: High Scores View
- **Phase**: 2
- **Dependencies**: C1 (types, levelConfig), C6 (useHighScores types)
- **Files to create**:
  - `src/components/HighScores/HighScores.tsx`
  - `src/components/HighScores/Medal.tsx`
  - `src/components/HighScores/HighScores.css`

### Description

Progress tracking / trophy room showing the child's best results per level.

**`HighScores.tsx`** — Full-screen high scores view:
```typescript
interface HighScoresProps {
  highScores: HighScores;
  onBack: () => void;
}
```
- Title: "Trophy Room" or "High Scores".
- Shows all 6 levels in a table or card grid.
- For each level: level name, `Medal` component, best score ("8/10"), fastest time (formatted as "1m 30s"), last played date.
- Unplayed levels: show as empty/locked appearance (greyed out text, no medal).
- "Back" button returning to level select.
- Import `LEVELS` from `../../logic/levelConfig`.

**`Medal.tsx`** — Medal/trophy visual:
```typescript
interface MedalProps {
  score: number; // 0-10
}
```
- 10/10 → Gold medal (🥇 or styled gold circle)
- 8-9 → Silver medal (🥈 or styled silver circle)
- 6-7 → Bronze medal (🥉 or styled bronze circle)
- 0-5 → No medal (empty/dash)
- Can use emoji, SVG, or CSS-styled elements.

**`HighScores.css`**: Table/grid layout, medal colors, empty state styling.

### Edge Cases
- Empty high scores (first launch): Show all levels as "Not played yet" with no medals.
- Date formatting: `lastPlayed` is ISO string — format as a readable local date.
- Time formatting: Convert seconds to "Xm Ys" format.

---

## Task T7 — Chunk C11: App Wiring + Navigation
- **Phase**: 3
- **Dependencies**: C5 (LevelSelect), C7 (global styles), C8 (GameSession), C9 (Summary), C10 (HighScores)
- **Files to create**:
  - `src/App.tsx`
  - `src/App.css`

### Description

Top-level component wiring all views together with simple state-based navigation. No router library needed.

**`App.tsx`**:
```typescript
function App(): JSX.Element
```

State:
- `currentView: View` — which screen is showing (starts at `'levelSelect'`)
- `selectedLevel: number` — which level was selected (starts at `1`)
- `lastResult: SessionResult | null` — result from the most recent game session

Hooks:
- `useHighScores()` — for reading/updating persisted scores

Navigation logic:
| Event | Action |
|-------|--------|
| `LevelSelect.onSelectLevel(level)` | Set `selectedLevel = level`, switch to `'game'` view |
| `LevelSelect.onViewHighScores()` | Switch to `'highScores'` view |
| `GameSession.onComplete(result)` | Call `updateHighScore(level, result)`, store `lastResult`, switch to `'summary'` view |
| `GameSession.onQuit()` | Switch to `'levelSelect'` view |
| `Summary.onTryAgain()` | Switch to `'game'` view (same `selectedLevel`) |
| `Summary.onLevelSelect()` | Switch to `'levelSelect'` view |
| `HighScores.onBack()` | Switch to `'levelSelect'` view |

Rendering: Simple conditional render based on `currentView`. Use a switch/case or object lookup — no routing library.

Pass `clockFeatures` from `getLevelConfig(selectedLevel)` to `Summary` (it needs this for TrickyTimes mini-clocks).

**`App.css`**: Minimal wrapper styles:
```css
.app {
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

### Imports needed
- `LevelSelect` from `./components/LevelSelect/LevelSelect`
- `GameSession` from `./components/GameSession/GameSession`
- `Summary` from `./components/Summary/Summary`
- `HighScores` from `./components/HighScores/HighScores`
- `useHighScores` from `./hooks/useHighScores`
- `getLevelConfig` from `./logic/levelConfig`
- Types from `./types/game`

### Edge Cases
- **View state on refresh**: `currentView` resets to `'levelSelect'` on page refresh. This is fine — we don't persist navigation state.
- **GameSession key**: When replaying the same level, React may not re-mount `GameSession`. Use a `key` prop (e.g., `key={Date.now()}` or an incrementing counter) to force a fresh mount when starting a new game.
- **lastResult cleared**: When navigating away from summary to level select, `lastResult` can be kept or cleared — doesn't matter since summary is only shown when `currentView === 'summary'`.
