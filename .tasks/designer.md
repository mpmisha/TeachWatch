# Designer — No Tasks

This redesign is CSS-only. No designer tasks for this plan. See `expert-react-frontend-engineer.md`. — Task

## Chunk C4: Redesign Hint Button
- **Phase**: 1
- **Dependencies**: C0 (shared types)
- **Files to create/modify**:
  - `src/components/GameSession/HintButton.tsx` (modify)
  - `src/components/GameSession/HintButton.css` (modify)

### Description
Redesign the hint button to be subtle and unobtrusive, and **remove the `HintPopup` component entirely** (it's replaced by on-clock visual hints — no text popup needed anymore).

---

### HintButton.tsx — What to Remove

Delete the entire `HintPopup` component and its props interface:
```tsx
// DELETE: HintPopupProps interface
// DELETE: HintPopup component (everything from `export function HintPopup` to its closing brace)
```

Delete these imports that are only used by `HintPopup`:
- `useEffect`, `useId`, `useRef` from React (if not used by `HintButton`)
- `type KeyboardEvent as ReactKeyboardEvent` from React

### HintButton.tsx — What to Change

**Current props:**
```ts
interface HintButtonProps {
  onClick: () => void;
  disabled: boolean;
}
```

**New props:**
```ts
interface HintButtonProps {
  onClick: () => void;
  disabled: boolean;
  active: boolean;   // hint animation is currently running
}
```

**Current implementation:**
```tsx
export function HintButton({ onClick, disabled }: HintButtonProps) {
  const { t } = useTranslation()
  return (
    <Button variant="secondary" onClick={onClick} disabled={disabled} className="hint-button">
      <span className="hint-button__icon" aria-hidden="true">💡</span>
      <span>{t.hintButton}</span>
    </Button>
  )
}
```

**New design direction:**
- **Subtle icon-only button** (not using the `Button` component — a plain `<button>` with custom styling).
- Single icon: 💡 emoji OR an inline SVG lightbulb (designer's choice).
- **Compact**: 40-44px circle, translucent background.
- Use `t.hintButton` as `aria-label` (for screen readers) rather than visible text.
- **Active state**: when `active` is true, the icon/button should have a visual indicator (e.g., amber fill, subtle ring, pulsing glow matching `--color-hint`).
- **Disabled state**: reduced opacity, no pointer events.
- **No aggressive animation by default** — the old `hint-pulse` keyframe that fires after 10s should be removed or made very subtle.

**Example implementation (designer refines):**
```tsx
export function HintButton({ onClick, disabled, active }: HintButtonProps) {
  const { t } = useTranslation()
  const classes = [
    'hint-trigger',
    active ? 'hint-trigger--active' : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={t.hintButton}
      aria-pressed={active}
    >
      <span className="hint-trigger__icon" aria-hidden="true">💡</span>
    </button>
  )
}
```

**Keep** the `export default HintButton` at the bottom.
**Remove** the `export { HintPopup }` — it no longer exists.

---

### HintButton.css — What to Remove

Delete ALL `.hint-popup__*` rules:
- `.hint-popup__backdrop`
- `.hint-popup--visible`
- `.hint-popup__card`
- `.hint-popup__title`
- `.hint-popup__text`
- `.hint-popup__close`
- `.hint-popup__close:hover`
- `.hint-popup__close:focus-visible`
- `@keyframes hint-popup-in`

Delete the old `.hint-button` rules and `.hint-button__icon`.

### HintButton.css — New Styles

Design a subtle circular trigger button. Example (designer refines):

```css
.hint-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  background: color-mix(in oklab, var(--color-surface, #ffffff) 80%, transparent);
  cursor: pointer;
  transition:
    background 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 120ms ease;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.hint-trigger:hover:not(:disabled) {
  background: color-mix(in oklab, var(--color-hint, #f9a825) 15%, var(--color-surface, #ffffff) 85%);
  border-color: color-mix(in oklab, var(--color-hint, #f9a825) 40%, transparent);
  transform: scale(1.05);
}

.hint-trigger:focus-visible {
  outline: 3px solid var(--color-focus, #0ea5e9);
  outline-offset: 2px;
}

.hint-trigger:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.hint-trigger--active {
  background: color-mix(in oklab, var(--color-hint, #f9a825) 20%, var(--color-surface, #ffffff) 80%);
  border-color: var(--color-hint, #f9a825);
  box-shadow: 0 0 8px rgba(249, 168, 37, 0.35);
}

.hint-trigger__icon {
  font-size: 1.4rem;
  line-height: 1;
  filter: grayscale(0.3);
  transition: filter 180ms ease;
}

.hint-trigger--active .hint-trigger__icon {
  filter: grayscale(0) brightness(1.1);
}

@media (prefers-reduced-motion: reduce) {
  .hint-trigger {
    transition: none;
  }
}
```

---

### Positioning Context

The hint button is rendered inside `QuestionView` between the clock and the answer buttons. Current layout is a flex column. The button should be:
- `align-self: center` (centered below the clock)
- Small margin (`margin-block: 0.25rem`)
- Or: absolutely positioned relative to the clock wrapper (bottom-right corner). **Designer decides which approach.**

If going with absolute positioning, QuestionView's `.question-view__clock` div needs `position: relative`, and the button gets `position: absolute; bottom: 8px; right: 8px;` (or similar for inset-inline-end for RTL support).

### RTL Support
- If using absolute positioning, use `inset-inline-end` instead of `right` so it works in both LTR and RTL.
- The icon (💡) is direction-neutral.

### Edge Cases
- `active` transitions should be smooth — no flashing on rapid stage changes.
- Button size must meet touch target minimum (44×44px per WCAG).
- `aria-pressed={active}` communicates state to screen readers.
- The `Button` component import can be removed from `HintButton.tsx` if no longer used (the new design uses a plain `<button>`). Check if `Button` is still needed.
