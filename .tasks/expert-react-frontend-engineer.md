# Expert React Frontend Engineer — Tasks

## Task T1 — Chunk C0: Shared types and translation interface extensions
- **Phase**: 0
- **Dependencies**: none
- **Files to create/modify**:
  - `src/types/game.ts` (modify — add `Hint` interface)
  - `src/i18n/translations.ts` (modify — add hint keys to `TranslationStrings` and both `en`/`he` objects)
- **Description**:

### `src/types/game.ts`
Add after the existing `Question` interface:
```ts
/** A contextual hint for a question */
export interface Hint {
  text: string;
}
```

### `src/i18n/translations.ts`
1. Add to `TranslationStrings` interface:
```ts
hintButton: string;
hintClose: string;
hintsEnabled: string;
hintLevelMessages: string[];
```

2. Add to the `en` object:
```ts
hintButton: 'Hint 💡',
hintClose: 'Got it!',
hintsEnabled: 'Show Hints',
hintLevelMessages: [
  'The short hand is pointing near the {hour}',
  'The short hand is near {hour}. Is the long hand pointing up (:00) or down (:30)?',
  'The long hand is near the number {nearestFive}. Each number means 5 minutes.',
  'The long hand is past {nearestFive} ({nearestFiveMinutes} min). Count the extra ticks!',
  'Remember: {hour} on the short hand. The long hand is near where {nearestFive} would be.',
  'The short hand is about {hour} hours around. Count ticks from the top for minutes.',
],
```

3. Add to the `he` object:
```ts
hintButton: '💡 רמז',
hintClose: '!הבנתי',
hintsEnabled: 'הצגת רמזים',
hintLevelMessages: [
  'המחוג הקצר מצביע ליד ה-{hour}',
  'המחוג הקצר ליד {hour}. האם המחוג הארוך מצביע למעלה (:00) או למטה (:30)?',
  'המחוג הארוך ליד המספר {nearestFive}. כל מספר שווה 5 דקות.',
  'המחוג הארוך עבר את {nearestFive} ({nearestFiveMinutes} דק׳). ספרו את השנתות הנוספות!',
  'זכרו: {hour} במחוג הקצר. המחוג הארוך ליד המקום של {nearestFive}.',
  'המחוג הקצר בערך {hour} שעות מסביב. ספרו שנתות מלמעלה לדקות.',
],
```

- **Existing patterns to follow**:
  - `TranslationStrings` uses simple `string` and `string[]` types (see `levels: LevelTranslation[]`)
  - Add new keys alphabetically within their logical group, or at the end of the settings section
  - Hebrew strings follow RTL conventions already established in the file

---

## Task T2 — Chunk C2: HintButton + HintPopup UI components
- **Phase**: 1
- **Dependencies**: C0 (T1 must be complete)
- **Files to create**:
  - `src/components/GameSession/HintButton.tsx`
  - `src/components/GameSession/HintButton.css`
- **Description**: Build the hint button and hint popup as two components in one file.

### `HintButton.tsx`

```tsx
// Two named exports: HintButton, HintPopup

interface HintButtonProps {
  onClick: () => void;
  disabled: boolean;
}
// Renders <Button variant="secondary" className="hint-button"> with t.hintButton label
// Uses useTranslation() for the label

interface HintPopupProps {
  text: string;
  onClose: () => void;
  visible: boolean;
}
// Renders a modal overlay with:
// - Backdrop (`.hint-popup__backdrop`) that calls onClose on click
// - Card (`.hint-popup__card`) with the hint text and a close button
// - Close button uses <Button variant="primary"> with t.hintClose label
// - role="dialog", aria-modal="true" on the card
// - When visible changes to true, focus the close button (useRef + useEffect)
// - Escape key closes (useEffect with keydown listener when visible)
```

### `HintButton.css`

```css
/* .hint-button — compact styling, margin-block for spacing in the question view */
.hint-button {
  align-self: center;
  width: auto;
  min-width: 100px;
  padding-inline: 16px;
}

/* .hint-popup__backdrop — fixed overlay, semi-transparent dark background */
/* .hint-popup__card — centered white card, rounded-20px, padding, max-width min(90vw, 400px) */
/* .hint-popup__text — large readable text, line-height 1.6, word-break: break-word */
/* .hint-popup__close — full-width button at bottom of card */
/* .hint-popup--visible — opacity 1, pointer-events auto (default hidden) */
/* Animation: fade-in + slight scale (0.95 → 1) matching existing tip-fade-in pattern */
```

- **Design tokens to use**: `--color-surface`, `--color-panel`, `--color-title`, `--shadow-soft`, `--radius-lg`, `--touch-min`
- **Accessibility**: `role="dialog"`, `aria-modal="true"`, focus trap to close button, Escape dismisses
- **RTL**: Use `padding-inline`, `margin-inline` (no left/right)

---

## Task T3 — Chunk C3: Settings toggle for hints
- **Phase**: 1
- **Dependencies**: C0 (T1 must be complete)
- **Files to modify**:
  - `src/components/Settings/Settings.tsx`
  - `src/components/Settings/Settings.css`
- **Description**: Add a hints-enabled toggle card to the Settings page.

### `Settings.tsx` changes

1. Add to `SettingsProps` interface:
```ts
hintsEnabled: boolean;
onToggleHints: () => void;
```

2. After the language card `</article>` and before the reset card `<article>`, insert a new card:
```tsx
<article className="settings__card" aria-labelledby="settings-hints-title">
  <h2 id="settings-hints-title" className="settings__card-title">
    {t.hintsEnabled}
  </h2>
  <div className="settings__toggle-row">
    <span className="settings__toggle-label">{t.hintsEnabled}</span>
    <button
      type="button"
      className={`settings__toggle-btn ${hintsEnabled ? 'is-active' : ''}`}
      aria-pressed={hintsEnabled}
      onClick={onToggleHints}
    >
      {hintsEnabled ? 'ON' : 'OFF'}
    </button>
  </div>
</article>
```

### `Settings.css` changes

Add styles for the toggle row and button:
```css
.settings__toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.settings__toggle-label {
  font-size: clamp(0.98rem, 2.1vw, 1.1rem);
  font-weight: 700;
  color: var(--settings-muted);
}

.settings__toggle-btn {
  /* Pill-shaped toggle button, similar to segment buttons */
  /* is-active class: green/primary background */
  /* inactive: grey background */
  min-width: 64px;
  min-height: var(--touch-min, 48px);
  border-radius: 999px;
  border: 2px solid var(--settings-border);
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.settings__toggle-btn.is-active {
  background: var(--settings-primary);
  color: #fff;
  border-color: var(--settings-primary);
}
```

- **Pattern to match**: The existing language segment buttons (`.settings__segment-btn`) — follow same sizing, font-weight, and transition patterns.

---

## Task T4 — Chunk C4: Integrate HintButton into QuestionView
- **Phase**: 2
- **Dependencies**: C0 (T1), C1, C2 (T2)
- **Files to modify**:
  - `src/components/GameSession/QuestionView.tsx`
- **Description**: Wire the hint button and popup into the question view.

### Changes to `QuestionView.tsx`

1. Import `Hint` type from `../../types/game`
2. Import `{ HintButton, HintPopup }` from `./HintButton`
3. Add to `QuestionViewProps`:
```ts
hint: Hint | null;
hintsEnabled: boolean;
```

4. Add local state inside the component:
```ts
const [hintVisible, setHintVisible] = useState(false);
```

5. Reset hint visibility when question changes:
```ts
useEffect(() => {
  setHintVisible(false);
}, [question]);
```
(Add `useState` and `useEffect` to imports from React)

6. In the JSX, between the `.question-view__clock` div and the `.question-view__answers` div, add:
```tsx
{hintsEnabled && hint && (
  <div className="question-view__hint">
    <HintButton
      onClick={() => setHintVisible(true)}
      disabled={disabled}
    />
  </div>
)}

<HintPopup
  text={hint?.text ?? ''}
  onClose={() => setHintVisible(false)}
  visible={hintVisible}
/>
```

7. The `.question-view__hint` wrapper needs minimal styling — just `align-self: center` for centering. Add to `GameSession.css` (but since GameSession.css already has `.question-view` styles, just add one rule):

Actually, since this task only owns `QuestionView.tsx`, the CSS class `.question-view__hint` can be added inline or appended to `GameSession.css` — but to avoid file conflicts, use inline style `style={{ alignSelf: 'center' }}` or add it to `HintButton.css` as `.question-view__hint { align-self: center; }`.

**Better approach**: The HintButton itself has `align-self: center` in its CSS (from T2), so no extra wrapper needed. Simplify to:
```tsx
{hintsEnabled && hint && (
  <HintButton onClick={() => setHintVisible(true)} disabled={disabled} />
)}
<HintPopup text={hint?.text ?? ''} onClose={() => setHintVisible(false)} visible={hintVisible} />
```

- **Edge cases**: `hint` can be null (while questions load) — guard with `&&`. Popup should not render visible when no hint exists.

---

## Task T5 — Chunk C5: Wire hints through GameSession + useGameSession + App
- **Phase**: 2
- **Dependencies**: C0 (T1), C1, C3 (T3)
- **Files to modify**:
  - `src/hooks/useGameSession.ts`
  - `src/components/GameSession/GameSession.tsx`
  - `src/App.tsx`
- **Description**: Connect the hint engine output through the hook and component hierarchy, and add localStorage persistence for the hints toggle in App.

### `src/hooks/useGameSession.ts` changes

1. Add imports:
```ts
import type { Hint } from '../types/game';
import { generateHint } from '../logic/hintEngine';
import { useTranslation } from '../i18n';
```

2. Inside the hook, after `const levelConfig = useMemo(...)`:
```ts
const { t } = useTranslation();
```

3. After the existing state declarations, add a memoized hint:
```ts
const currentHint = useMemo(() => {
  const q = questions[questionIndex];
  if (!q) return null;
  return generateHint(q, level, t.hintLevelMessages);
}, [questions, questionIndex, level, t.hintLevelMessages]);
```

4. Add `currentHint` to the return type annotation:
```ts
currentHint: Hint | null;
```

5. Add `currentHint` to the return object.

### `src/components/GameSession/GameSession.tsx` changes

1. Add `hintsEnabled: boolean` to `GameSessionProps`
2. Destructure `currentHint` from `useGameSession(level)`
3. Pass to `<QuestionView>`:
```tsx
hint={currentHint}
hintsEnabled={hintsEnabled}
```

### `src/App.tsx` changes

1. Add localStorage key constant:
```ts
const HINTS_STORAGE_KEY = 'teachwatch-hints-enabled';
```

2. Add state + mount effect:
```ts
const [hintsEnabled, setHintsEnabled] = useState(true);

useEffect(() => {
  try {
    const saved = localStorage.getItem(HINTS_STORAGE_KEY);
    if (saved === 'false') setHintsEnabled(false);
  } catch { /* ignore */ }
}, []);
```

3. Add toggle handler:
```ts
const handleToggleHints = () => {
  setHintsEnabled(prev => {
    const next = !prev;
    try { localStorage.setItem(HINTS_STORAGE_KEY, String(next)); } catch { /* ignore */ }
    return next;
  });
};
```

4. Update the `<GameSession>` render to pass `hintsEnabled`:
```tsx
<GameSession
  key={gameSessionKey}
  level={selectedLevel}
  hintsEnabled={hintsEnabled}
  onComplete={handleSessionComplete}
  onQuit={() => setCurrentView('levelSelect')}
/>
```

5. Update the `<Settings>` render to pass hint props:
```tsx
<Settings
  onBack={() => setCurrentView('levelSelect')}
  onResetScores={resetHighScores}
  hintsEnabled={hintsEnabled}
  onToggleHints={handleToggleHints}
/>
```

- **Pattern reference**: Follow the exact try/catch pattern used in `LanguageContext.tsx` for localStorage reads/writes.
- **Edge cases**: First-time users get `true` (hints shown). localStorage errors silently ignored.

