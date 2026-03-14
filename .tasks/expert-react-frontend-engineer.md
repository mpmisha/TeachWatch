# Expert React Frontend Engineer — Tasks

## Task T1 — Chunk C0: New types and interfaces
- **Phase**: 0
- **Dependencies**: none
- **Files to create/modify**:
  - `src/types/game.ts` (modify)

### Description
Add new types for the visual hint system. Remove the old `Hint` interface.

**Add these types:**

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

**Remove:**
```ts
/** A contextual hint for a question */
export interface Hint {
  text: string;
}
```

**Do NOT modify `ClockAnimationState`** — hint highlighting is a separate prop path.

### Edge cases
- Ensure no other file in the codebase imports `Hint` from `game.ts` after this change — downstream tasks (C6, C7) will remove those imports.

---

## Task T2 — Chunk C2: `useHintSequence` hook
- **Phase**: 1
- **Dependencies**: C0 (types)
- **Files to create/modify**:
  - `src/hooks/useHintSequence.ts` (create)

### Description
Create a React hook that manages the hint animation state machine.

**Signature:**
```ts
import type { HintHighlight, HintStage, VisualHint } from '../types/game';

const HINT_STAGE_DURATION_MS = 3000;

export function useHintSequence(visualHint: VisualHint | null): {
  hintStage: HintStage;
  activeHighlight: HintHighlight | null;
  triggerHint: () => void;
  cancelHint: () => void;
}
```

**State machine:**
1. Initial state: `hintStage = 'idle'`, `activeHighlight = null`.
2. `triggerHint()`:
   - If `visualHint` is null, do nothing.
   - Clear any existing timers.
   - Set `hintStage = 'hour'`, `activeHighlight = visualHint.stage1`.
   - Start a timer for `HINT_STAGE_DURATION_MS`.
3. Timer fires:
   - Set `hintStage = 'minute'`, `activeHighlight = visualHint.stage2`.
   - Start second timer for `HINT_STAGE_DURATION_MS`.
4. Second timer fires:
   - Set `hintStage = 'idle'`, `activeHighlight = null`.
5. `cancelHint()`:
   - Clear all timers.
   - Set `hintStage = 'idle'`, `activeHighlight = null`.
6. If `visualHint` reference changes (new question), auto-cancel (use `useEffect` on `visualHint`).
7. Cleanup all timers on unmount.

**Implementation notes:**
- Use `useCallback` for `triggerHint` and `cancelHint`.
- Use `useRef` for timer IDs.
- Use `useState` for `hintStage` and `activeHighlight`.
- If `triggerHint` is called while hint is already active, restart from `'hour'` (reset timers).

### Edge cases
- `visualHint` is null → `triggerHint` is a no-op.
- Component unmounts while timers pending → cleanup in `useEffect` return.
- Rapid clicks → always restart cleanly from stage 1.

---

## Task T3 — Chunk C6: Wire hints into `useGameSession`
- **Phase**: 2
- **Dependencies**: C0 (types), C1 (hintEngine), C2 (useHintSequence)
- **Files to create/modify**:
  - `src/hooks/useGameSession.ts` (modify)

### Description
Replace the old text-hint integration with the new visual hint system.

**Changes:**
1. **Remove** import of `Hint` from `'../types/game'`.
2. **Remove** import of `generateHint` from `'../logic/hintEngine'`.
3. **Add** import of `HintHighlight`, `HintStage`, `VisualHint` from `'../types/game'`.
4. **Add** import of `generateVisualHint` from `'../logic/hintEngine'`.
5. **Add** import of `useHintSequence` from `'./useHintSequence'`.
6. **Replace** the `currentHint` `useMemo`:
   ```ts
   const visualHint = useMemo(() => {
     const question = questions[questionIndex];
     if (!question) return null;
     return generateVisualHint(question.time, level, levelConfig.clockFeatures);
   }, [questions, questionIndex, level, levelConfig.clockFeatures]);
   ```
7. **Add** hook call:
   ```ts
   const { hintStage, activeHighlight, triggerHint, cancelHint } = useHintSequence(visualHint);
   ```
8. **Call `cancelHint()`** when transitioning to the next question — add to the feedback timeout callback in `handleAnswer`, right before setting the next question index. Also consider adding `cancelHint` to the `useEffect` cleanup that resets the session.
9. **Update return type** — remove `currentHint`, add:
   ```ts
   activeHighlight: HintHighlight | null;
   hintStage: HintStage;
   triggerHint: () => void;
   ```
10. **Remove** `useTranslation` import IF `t` is no longer used (it was only used for `t.hintLevelMessages`). Check if `t` is used elsewhere in the hook — it is NOT, so remove the import and reference.

### Interfaces to use
- `VisualHint`, `HintHighlight`, `HintStage` from `src/types/game.ts` (C0)
- `generateVisualHint` from `src/logic/hintEngine.ts` (C1)
- `useHintSequence` from `src/hooks/useHintSequence.ts` (C2)

### Edge cases
- `cancelHint` must be stable (useCallback) so it doesn't cause re-renders when added to dependency arrays.
- Removing `useTranslation()` removes the `t` variable — make sure it's not used elsewhere in the hook body.

---

## Task T4 — Chunk C7: Wire hints into QuestionView + GameSession
- **Phase**: 2
- **Dependencies**: C2, C3, C4, C6
- **Files to create/modify**:
  - `src/components/GameSession/QuestionView.tsx` (modify)
  - `src/components/GameSession/GameSession.tsx` (modify)

### Description
Connect the new visual hint system to the UI components.

**QuestionView.tsx changes:**
1. **Remove** imports: `HintPopup` from `'./HintButton'`, `Hint` from types, `useState` (if only used for `hintVisible`).
2. **Remove** props: `hint: Hint | null`.
3. **Remove** `hintVisible` state and the `useEffect` that resets it on question change.
4. **Remove** `<HintPopup>` rendering entirely.
5. **Add** new props:
   ```ts
   activeHighlight?: HintHighlight;
   hintStage: HintStage;
   onTriggerHint: () => void;
   ```
6. **Update** `<Clock>` to pass `hintHighlight={activeHighlight}`.
7. **Update** `<HintButton>`:
   - Change: `onClick={() => setHintVisible(true)}` → `onClick={onTriggerHint}`
   - Add: `active={hintStage !== 'idle'}`
8. **Add** an `aria-live="polite"` span near the clock that announces the hint stage for screen readers (e.g. a visually-hidden span whose text changes based on `hintStage`).
9. **Update** the `import { HintButton, HintPopup }` → `import { HintButton }` (or `import HintButton`).

**GameSession.tsx changes:**
1. **Destructure** `activeHighlight`, `hintStage`, `triggerHint` from `useGameSession(level)` instead of `currentHint`.
2. **Update** `<QuestionView>` props:
   - Remove: `hint={currentHint}`
   - Add: `activeHighlight={activeHighlight}`, `hintStage={hintStage}`, `onTriggerHint={triggerHint}`

### Interfaces to use
- `HintHighlight`, `HintStage` from `src/types/game.ts` (C0)
- `ClockProps` now accepts `hintHighlight?: HintHighlight` (C3)
- `HintButtonProps` now has `active: boolean` (C4)
- `useGameSession` return now includes `activeHighlight`, `hintStage`, `triggerHint` (C6)

### Edge cases
- `useEffect` import may still be needed for other effects in QuestionView — check before removing.
- `useState` import may still be needed — check if `hintVisible` was the only state.
- The `hintsEnabled` prop check should still gate whether `<HintButton>` renders.
