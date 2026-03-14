# Implementation Plan — Visual Clock Hints

## Summary

Replace the current text-based hint system with an on-clock visual hint that highlights hands and numbers in two stages (hour → minute). Redesign the hint button to be subtle and unobtrusive. Remove the `HintPopup` entirely. The clock SVG components gain new props for hint-mode highlighting; a new `useHintSequence` hook drives a state machine (`idle → stage1 → stage2 → idle`); the `hintEngine` is rewritten to produce highlight descriptors instead of text strings; and new CSS animations make the targeted clock parts glow/pulse.

---

## Current State Summary

- **`Hint` type** (`src/types/game.ts`): `{ text: string }` — old text-based hint.
- **`generateHint()`** (`src/logic/hintEngine.ts`): Takes question + level + i18n templates, returns `{ text }` with placeholders filled. Uses `hintLevelMessages` from translations.
- **`HintButton` + `HintPopup`** (`src/components/GameSession/HintButton.tsx`): Button with 💡 icon opens a modal dialog showing hint text. `HintPopup` is a backdrop + card + close button.
- **`QuestionView`** (`src/components/GameSession/QuestionView.tsx`): Renders `HintButton` and `HintPopup` inline; manages `hintVisible` boolean state.
- **`useGameSession`** (`src/hooks/useGameSession.ts`): Computes `currentHint: Hint | null` via `generateHint()`.
- **`GameSession`** (`src/components/GameSession/GameSession.tsx`): Passes `hint` and `hintsEnabled` to `QuestionView`.
- **Clock SVG** (`src/components/Clock/`): `Clock.tsx` wraps `ClockFace` + `ClockHands`. Currently accepts `ClockAnimationState` for answer feedback only. No hint-related props.
- **Level configs** (`src/logic/levelConfig.ts`): 6 levels with `ClockFeatures` — `showNumbers`, `showFiveMinuteLabels`, `showMinuteTicks`. Levels 5-6 hide labels/numbers.
- **Translations**: `hintLevelMessages` (6-element array) and `hintClose` exist in both `en.json` and `he.json`. `hintButton` label also exists.
- **Settings**: `hintsEnabled` toggle in `Settings.tsx`, persisted to localStorage in `App.tsx`.

---

## Phase 0: Shared Contracts

### Chunk C0 — New types and interfaces
- **Files**: `src/types/game.ts`
- **Dependencies**: none
- **Agent**: Expert React Frontend Engineer

Add the following types:

```ts
/** Which stage of the visual hint is active */
export type HintStage = 'idle' | 'hour' | 'minute';

/** Describes what the clock should highlight during a hint */
export interface HintHighlight {
  /** Which hand to emphasise */
  hand: 'hour' | 'minute';
  /** Hour numbers (1-12) to glow on the face */
  highlightHourNumbers: number[];
  /** Five-minute labels (5,10,…55) to glow / temporarily show */
  highlightFiveMinuteLabels: number[];
}

/** Full two-stage visual hint descriptor for one question */
export interface VisualHint {
  stage1: HintHighlight; // hour-hand focus
  stage2: HintHighlight; // minute-hand focus
}
```

Remove the old `Hint` interface (`{ text: string }`).

**Design note**: Hint highlighting is passed as a separate `hintHighlight?: HintHighlight` prop to the Clock, independent of `ClockAnimationState` (which handles answer feedback). This avoids state conflicts.

---

## Phase 1 (parallel — 5 chunks)

### Chunk C1 — Rewrite `hintEngine.ts` to produce `VisualHint`
- **Files**: `src/logic/hintEngine.ts`
- **Dependencies**: C0
- **Agent**: Game Logic Engineer

Replace `generateHint()` with:

```ts
function generateVisualHint(time: ClockTime, level: number, clockFeatures: ClockFeatures): VisualHint
```

**Stage 1 logic (hour focus)**:
- `hand: 'hour'`
- If `minutes === 0` → `highlightHourNumbers: [hours]`
- Else → `highlightHourNumbers: [hours, nextHour]` where `nextHour = hours % 12 + 1`
- `highlightFiveMinuteLabels: []`

**Stage 2 logic (minute focus)**:
- `hand: 'minute'`
- `highlightHourNumbers: []`
- Compute 5-minute boundaries around the minute hand:
  - `lowerFive = Math.floor(minutes / 5) * 5`
  - `upperFive = (lowerFive + 5) % 60`
  - If `minutes % 5 === 0` → only `[lowerFive]` (or `[60]` for 0)
  - Else → `[lowerFive, upperFive]`
- Filter out 0 from the labels list (0 maps to the 12 position — there is no "0" label)
- For Level 1 (minutes always 0): return `stage2` with empty highlights (or same as stage1)

**Edge cases**:
- Hour 12 wraps → nextHour = 1
- Minute 0 → minute hand at 12 position → `highlightFiveMinuteLabels: []` (nothing to show)
- Minute 60 edge → use modular arithmetic

---

### Chunk C2 — `useHintSequence` hook (state machine)
- **Files**: `src/hooks/useHintSequence.ts`
- **Dependencies**: C0
- **Agent**: Expert React Frontend Engineer

```ts
function useHintSequence(visualHint: VisualHint | null): {
  hintStage: HintStage;
  activeHighlight: HintHighlight | null;
  triggerHint: () => void;
  cancelHint: () => void;
}
```

**State machine**:
1. `idle` → user clicks hint → `'hour'`, expose `visualHint.stage1`, start timer (`HINT_STAGE_DURATION_MS = 3000`)
2. Timer fires → `'minute'`, expose `visualHint.stage2`, start second timer
3. Second timer fires → `'idle'`, `activeHighlight = null`
4. `cancelHint()` → immediately reset to `'idle'` and clear timers
5. If `triggerHint()` called while already active → restart from `'hour'` (reset timers)
6. If `visualHint` changes (new question) → auto-cancel

Clean up timers on unmount via `useEffect` return.

---

### Chunk C3 — Clock SVG hint highlighting (ClockFace + ClockHands + CSS)
- **Files**: `src/components/Clock/ClockFace.tsx`, `src/components/Clock/ClockHands.tsx`, `src/components/Clock/Clock.tsx`, `src/components/Clock/Clock.css`
- **Dependencies**: C0
- **Agent**: SVG Animation Engineer

**Clock.tsx** — Add optional `hintHighlight?: HintHighlight` prop. Pass to children. Add `clock--hinting` class when active.

**ClockFace.tsx** — Accept `hintHighlight?: HintHighlight`:
- **Hour numbers**: If number is in `highlightHourNumbers`, add class `clock-hour-number--hint`. If `showNumbers` is false AND number is in the list, render it anyway with class `clock-hour-number--hint-reveal`.
- **Five-minute labels**: If label is in `highlightFiveMinuteLabels`, add class `clock-five-minute-label--hint`. If `showFiveMinuteLabels` is false AND label is in the list, render it with class `clock-five-minute-label--hint-reveal`.

**ClockHands.tsx** — Accept `hintHighlight?: HintHighlight`:
- If `hand === 'hour'` → add `clock-hand--hint` to hour hand group.
- If `hand === 'minute'` → add `clock-hand--hint` to minute hand group.

**Clock.css** — Add (do not modify existing rules):

```css
/* Hint hand glow */
.clock-hand--hint {
  stroke: var(--color-hint, #f9a825);
  filter: drop-shadow(0 0 4px rgba(249, 168, 37, 0.7));
  animation: hint-hand-pulse 1s ease-in-out infinite;
}

/* Hint number glow */
.clock-hour-number--hint,
.clock-five-minute-label--hint {
  fill: var(--color-hint, #f9a825);
  font-weight: 900;
  animation: hint-number-glow 1s ease-in-out infinite;
}

/* Temporarily revealed numbers */
.clock-hour-number--hint-reveal,
.clock-five-minute-label--hint-reveal {
  fill: var(--color-hint, #f9a825);
  font-weight: 900;
  opacity: 0;
  animation: hint-number-reveal 0.3s ease-out forwards, hint-number-glow 1s ease-in-out 0.3s infinite;
}

@keyframes hint-hand-pulse {
  0%, 100% { filter: drop-shadow(0 0 3px rgba(249,168,37,0.5)); }
  50%      { filter: drop-shadow(0 0 8px rgba(249,168,37,0.9)); }
}

@keyframes hint-number-glow {
  0%, 100% { opacity: 0.85; }
  50%      { opacity: 1; }
}

@keyframes hint-number-reveal {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .clock-hand--hint,
  .clock-hour-number--hint,
  .clock-five-minute-label--hint,
  .clock-hour-number--hint-reveal,
  .clock-five-minute-label--hint-reveal {
    animation: none;
    opacity: 1;
    filter: none;
  }
  .clock-hand--hint { stroke: var(--color-hint, #f9a825); }
}
```

Add `--color-hint: #f9a825;` to `src/styles/tokens.css` `:root`.

---

### Chunk C4 — Redesign Hint Button
- **Files**: `src/components/GameSession/HintButton.tsx`, `src/components/GameSession/HintButton.css`
- **Dependencies**: C0
- **Agent**: Designer

- **Remove** `HintPopup` component entirely (JSX, types, imports).
- **Remove** all `.hint-popup__*` CSS rules and `@keyframes hint-popup-in`.
- **Redesign** `HintButton`:
  - Single subtle icon (💡 or inline SVG) — designer's choice.
  - Compact circle/pill: ~40-44px, translucent background.
  - No aggressive pulsing animation by default.
  - New prop `active: boolean` — when hint is running, show visual indicator (filled icon, ring, etc.).
  - Keep `disabled` prop behavior.
  - Position: inline beneath the clock or overlaid near clock corner — designer decides.
- **Updated props**:

```ts
interface HintButtonProps {
  onClick: () => void;
  disabled: boolean;
  active: boolean;
}
```

- Simplify the `hintButton` i18n string — it becomes an aria-label only.

---

### Chunk C5 — Remove old hint translations + clean up i18n types
- **Files**: `src/i18n/locales/en.json`, `src/i18n/locales/he.json`, `src/i18n/types.ts`
- **Dependencies**: C0
- **Agent**: Translation Engineer

- Remove `hintLevelMessages` array from both locale JSON files.
- Remove `hintClose` from both locale JSON files.
- Remove `hintLevelMessages: string[]` from `TranslationStrings` and `RawTranslationStrings`.
- Remove `hintClose: string` from both interfaces.
- Keep `hintButton` (used as aria-label for the new button).
- Keep `hintsEnabled` (used in Settings toggle).
- Verify `resolveTranslations.ts` has no references to removed keys (it doesn't — `hintLevelMessages` was passed through as-is).
- Update `hintButton` text to remove embedded emoji: EN `"Hint"`, HE `"רמז"` (icon is now in the component).

---

## Phase 2 (parallel — 2 chunks)

### Chunk C6 — Wire hints into `useGameSession` hook
- **Files**: `src/hooks/useGameSession.ts`
- **Dependencies**: C0, C1, C2
- **Agent**: Expert React Frontend Engineer

- Import `generateVisualHint` instead of `generateHint`.
- Import and call `useHintSequence`.
- Replace `currentHint` computation:
  ```ts
  const visualHint = useMemo(() => {
    const question = questions[questionIndex];
    if (!question) return null;
    return generateVisualHint(question.time, level, levelConfig.clockFeatures);
  }, [questions, questionIndex, level, levelConfig.clockFeatures]);

  const { hintStage, activeHighlight, triggerHint, cancelHint } = useHintSequence(visualHint);
  ```
- Call `cancelHint()` when transitioning questions (add to `handleAnswer` or via `useEffect` on `questionIndex`).
- Update return type — remove `currentHint: Hint | null`, add:
  ```ts
  activeHighlight: HintHighlight | null;
  hintStage: HintStage;
  triggerHint: () => void;
  ```
- Remove import of old `Hint` type and `generateHint`.
- Remove reference to `t.hintLevelMessages`.

---

### Chunk C7 — Wire hints into QuestionView + GameSession UI
- **Files**: `src/components/GameSession/QuestionView.tsx`, `src/components/GameSession/GameSession.tsx`
- **Dependencies**: C2, C3, C4, C6
- **Agent**: Expert React Frontend Engineer

**QuestionView.tsx**:
- Remove `hint: Hint | null` prop and `HintPopup` import/rendering.
- Remove `hintVisible` state and related `useEffect`.
- Add new props:
  ```ts
  activeHighlight?: HintHighlight;
  hintStage: HintStage;
  onTriggerHint: () => void;
  ```
- Pass `activeHighlight` to `<Clock hintHighlight={activeHighlight}>`.
- Render `<HintButton onClick={onTriggerHint} disabled={disabled} active={hintStage !== 'idle'} />`.
- Add `aria-live="polite"` region to announce stage changes for screen readers.

**GameSession.tsx**:
- Destructure `activeHighlight`, `hintStage`, `triggerHint` from `useGameSession` (instead of `currentHint`).
- Pass to `QuestionView`: `activeHighlight`, `hintStage`, `onTriggerHint={triggerHint}`.
- Remove `hint={currentHint}` prop.

---

## Phase 3: Integration & Cleanup

### Chunk C8 — Verification and smoke testing
- **Files**: all modified files (read-only verification)
- **Dependencies**: C5, C6, C7
- **Agent**: QA Engineer

Verification checklist:
1. Old `Hint` type is no longer referenced anywhere.
2. `HintPopup` component and all `.hint-popup__*` CSS are fully removed.
3. `hintLevelMessages` and `hintClose` removed from JSON files, `types.ts`, and not referenced in `resolveTranslations.ts`.
4. Settings toggle (`hintsEnabled`) still shows/hides the hint button.
5. Type check: `npx tsc --noEmit` passes.
6. Lint: `npx eslint src/` passes.
7. Manual smoke test across all 6 levels:
   - Level 1 (hours only, `minutes=0`): Stage 1 highlights the one number. Stage 2 skipped or minimal.
   - Level 3 (five-minute labels visible): Stage 2 highlights existing labels.
   - Level 5 (no five-minute labels): Stage 2 temporarily reveals relevant labels.
   - Level 6 (no numbers): Stage 1 temporarily reveals hour numbers; Stage 2 reveals minute labels.
8. `prefers-reduced-motion` disables all hint animations.
9. RTL (Hebrew) — hint button and highlighting work correctly.
10. Rapid clicks on hint button → restarts cleanly from stage 1.
11. Answering while hint is active → highlights cancel immediately.

---

## Edge Cases

1. **Level 1 — minutes always 0**: Stage 2 has nothing meaningful. Skip it — go `hour → idle` directly.
2. **Level 6 — no numbers shown**: Both hour numbers AND five-minute labels must appear temporarily with `--hint-reveal` class.
3. **Minutes on exact 5-minute mark** (e.g. :15): Only one label to highlight, no "between two".
4. **Hour 12**: `nextHour` wraps to 1.
5. **Minute 0 (X:00)**: Minute hand at 12 position. `highlightFiveMinuteLabels` is empty — nothing to show for stage 2.
6. **User answers while hint active**: `cancelHint()` fires, clearing all highlights immediately.
7. **Rapid hint clicks**: `triggerHint()` restarts from stage 1 (reset timers).
8. **Hint button during sweeping animation**: Disabled (existing `answersDisabled` covers this).
9. **RTL layout (Hebrew)**: Hint button positioning must work in both directions.
10. **`prefers-reduced-motion`**: All hint animations (pulse, glow, reveal) disabled; static fallback styles applied.

## Open Questions

1. **Stage timing**: 3 seconds per stage. Should this vary by level? (Recommend: no, keep simple.)
2. **Hint button position**: Overlaid on clock or inline below? Designer decides.
3. **Stage 2 for Level 1**: Skip entirely or show brief highlight at 12? (Recommend: skip.)
4. **Color**: `#f9a825` (amber/gold) — doesn't conflict with success green or error red. Designer may adjust.
5. **Sound effects**: Not in scope.
