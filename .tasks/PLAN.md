# Implementation Plan — Hint Feature

## Summary

Add a "Hint" button to the game session that shows contextual clues based on the current question and level. A toggle in Settings controls visibility (persisted to localStorage). The hint system generates level-aware text hints that guide the child without revealing the answer. The work is split into 7 chunks across 4 phases, maximizing parallelism by separating logic, UI components, translations, and wiring.

---

## Phase 0: Shared Contracts

### Chunk C0 — Shared types and translation interface extensions
- **Files**: `src/types/game.ts`, `src/i18n/translations.ts`
- **Dependencies**: none
- **Agent**: Expert React Frontend Engineer

**`src/types/game.ts`** — Add a `Hint` interface:
```ts
export interface Hint {
  text: string;
}
```

**`src/i18n/translations.ts`** — Extend `TranslationStrings` with:
- `hintButton: string` — e.g. "Hint 💡" / "💡 רמז"
- `hintClose: string` — e.g. "Got it!" / "!הבנתי"
- `hintsEnabled: string` — e.g. "Show Hints" / "הצגת רמזים"
- `hintLevelMessages: string[]` — 6 template strings (one per level) with `{hour}`, `{nearestFive}`, `{nearestFiveMinutes}` placeholders

English hint templates by level:
1. `"The short hand is pointing near the {hour}"`
2. `"The short hand is near {hour}. Is the long hand pointing up (:00) or down (:30)?"`
3. `"The long hand is near the number {nearestFive}. Each number means 5 minutes."`
4. `"The long hand is past {nearestFive} ({nearestFiveMinutes} min). Count the extra ticks!"`
5. `"Remember: {hour} on the short hand. The long hand is near where {nearestFive} would be."`
6. `"The short hand is about {hour} hours around. Count ticks from the top for minutes."`

Hebrew equivalents following the same patterns.

Add actual values in both `en` and `he` translation objects.

---

## Phase 1 (parallel)

### Chunk C1 — Hint generation logic
- **Files**: `src/logic/hintEngine.ts`
- **Dependencies**: C0
- **Agent**: Game Logic Engineer

Create `src/logic/hintEngine.ts` exporting:
```ts
function generateHint(question: Question, level: number, templates: string[]): Hint
```

Logic:
1. Select `templates[clampedLevelIndex]` as the base template
2. Compute placeholders from `question.time`:
   - `{hour}` → `question.time.hours`
   - `{minutes}` → `question.time.minutes`
   - `{nearestFive}` → clock number nearest to the minute hand: `Math.round(minutes / 5) % 12 || 12`
   - `{nearestFiveMinutes}` → `Math.round(minutes / 5) * 5`
3. Replace all placeholders in template string
4. Return `{ text: filledTemplate }`

Edge cases:
- Minutes = 0 → `{nearestFive}` = 12 (top of clock)
- Minutes = 58/59 → `{nearestFive}` rounds to 12
- Level index out of range → clamp to valid index

---

### Chunk C2 — HintButton + HintPopup UI components
- **Files**: `src/components/GameSession/HintButton.tsx`, `src/components/GameSession/HintButton.css`
- **Dependencies**: C0
- **Agent**: Expert React Frontend Engineer

**HintButton.tsx** — Two components in one file:

`HintButton`: Props `onClick: () => void`, `disabled: boolean`. Renders `<Button variant="secondary">` with `t.hintButton` label. BEM class `hint-button`.

`HintPopup`: Props `text: string`, `onClose: () => void`, `visible: boolean`. Modal card displaying hint text with a "Got it!" close button. BEM classes: `hint-popup`, `hint-popup--visible`, `hint-popup__text`, `hint-popup__close`. Accessible: `role="dialog"`, `aria-modal="true"`, backdrop click dismisses.

**HintButton.css**:
- `.hint-button` — compact secondary button styling
- `.hint-popup` — centered overlay with backdrop dim, `width: min(90vw, 400px)`, rounded corners, soft background
- `.hint-popup--visible` — opacity/pointer-events toggle with fade+scale animation
- RTL-safe with logical CSS properties
- Mobile responsive

---

### Chunk C3 — Settings toggle for hints + localStorage persistence
- **Files**: `src/components/Settings/Settings.tsx`, `src/components/Settings/Settings.css`
- **Dependencies**: C0
- **Agent**: Expert React Frontend Engineer

**Settings.tsx** changes:
- Add new props: `hintsEnabled: boolean`, `onToggleHints: () => void`
- Add a new `settings__card` between Language and Reset cards
- Card title: `t.hintsEnabled`
- Contains toggle button with `aria-pressed`, styled as on/off toggle
- Toggle calls `onToggleHints`

**Settings.css** changes:
- Add `.settings__toggle` styles for the on/off toggle switch
- Reuse existing card layout, color tokens

Edge cases: localStorage unavailable → parent defaults to `true`

---

## Phase 2 (parallel, depends on Phase 1)

### Chunk C4 — Integrate HintButton into QuestionView
- **Files**: `src/components/GameSession/QuestionView.tsx`
- **Dependencies**: C0, C1, C2
- **Agent**: Expert React Frontend Engineer

**QuestionView.tsx** changes:
- Add new props: `hint: Hint | null`, `hintsEnabled: boolean`
- Add local state: `hintVisible` (boolean), reset to `false` when `question` changes
- Render `<HintButton>` between clock and answer buttons when `hintsEnabled && hint`
- Render `<HintPopup>` with `hint.text`, controlled by `hintVisible`
- Disable hint button when `disabled` (during feedback animation)

---

### Chunk C5 — Wire hints through GameSession + useGameSession + App
- **Files**: `src/components/GameSession/GameSession.tsx`, `src/hooks/useGameSession.ts`, `src/App.tsx`
- **Dependencies**: C0, C1, C3
- **Agent**: Expert React Frontend Engineer

**useGameSession.ts** changes:
- Import `generateHint` from `hintEngine.ts`
- Import `useTranslation` to get `t.hintLevelMessages`
- Compute `currentHint` via `generateHint(currentQuestion, level, t.hintLevelMessages)` — memoized on question change
- Add `currentHint: Hint | null` to return type

**GameSession.tsx** changes:
- Destructure `currentHint` from `useGameSession`
- Accept new prop: `hintsEnabled: boolean`
- Pass `hint={currentHint}` and `hintsEnabled={hintsEnabled}` to `<QuestionView>`

**App.tsx** changes:
- Add state: `hintsEnabled` (boolean)
- On mount, read `localStorage.getItem('teachwatch-hints-enabled')` — if `'false'`, set false; else true
- On toggle, flip state + write to localStorage (try/catch for safety)
- Pass `hintsEnabled` to `<GameSession>`
- Pass `hintsEnabled` and `onToggleHints` to `<Settings>`

Edge cases:
- First-time users: no localStorage → default `true`
- Toggling mid-game: immediate effect (button appears/disappears)
- localStorage write failure: silently ignore, keep in-memory state

---

## Phase 3: Validation

### Chunk C6 — Manual QA checklist
- **Files**: none (validation only)
- **Dependencies**: C4, C5
- **Agent**: QA Engineer

Validate:
1. Hint button visible on every question when hints enabled (all 6 levels)
2. Hint button hidden when hints disabled in settings
3. Hint popup shows level-appropriate, question-specific text
4. Hint popup dismisses on "Got it!" and on backdrop click
5. Hint auto-resets on question advance (no stale hint)
6. Settings toggle persists across page reload
7. RTL layout (Hebrew): hint button and popup render correctly
8. Mobile (375px): popup fits within viewport
9. Desktop (1280px): popup centered, max-width respected
10. Accessibility: `role="dialog"`, keyboard dismiss (Escape), aria-pressed on toggle
11. No visual regression on existing game session UI
12. Template placeholders render correctly for edge times (12:00, 12:58, 1:00)

---

## Edge Cases (cross-cutting)
- **localStorage quota exceeded**: Wrap writes in try/catch (same pattern as `LanguageContext.tsx`)
- **Hint text overflow**: Long Hebrew text → CSS `word-break: break-word`
- **Rapid clicking**: Hint button disabled during answer feedback animation
- **Missing template placeholders**: Return raw template if placeholder not found (graceful degradation)
- **Level 1**: Hint only mentions hour hand — must not confuse by mentioning minutes

## Open Questions
- Should using a hint penalize the score or star rating? (Current plan: **no penalty**)
- Should hint usage be tracked in `Answer` for analytics? (Current plan: **no**)
- Should there be a per-question hint limit? (Current plan: **no limit** — child can re-open freely)

