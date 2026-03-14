# QA Engineer — Task

## Chunk C8: Verification and Smoke Testing
- **Phase**: 3
- **Dependencies**: C5, C6, C7
- **Files to create/modify**: none (read-only verification across all modified files)

### Description
Verify the complete visual hint integration is correct, type-safe, and lint-clean. Run automated checks and manual smoke tests.

---

### Automated Checks

1. **Type check**: Run `npx tsc --noEmit` — must pass with zero errors.
2. **Lint**: Run `npx eslint src/` — must pass with zero errors.
3. **Grep for removed artifacts**:
   - `grep -r "HintPopup" src/` → no results
   - `grep -r "hintLevelMessages" src/` → no results
   - `grep -r "hintClose" src/` → no results (except maybe in translation files if missed)
   - `grep -r "Hint {" src/types/game.ts` → the old `Hint` interface must be gone
   - `grep -r "generateHint" src/` → no results (replaced by `generateVisualHint`)
   - `grep -r "currentHint" src/` → no results
   - `grep -r "hint-popup" src/` → no results in CSS or TSX

### Manual Smoke Tests

Run the dev server (`npm run dev`) and test each scenario:

#### Settings Toggle
- Open Settings → "Show Hints" toggle should still work.
- When OFF: no hint button visible during game.
- When ON: hint button visible during game.

#### Level 1 — Hours Only (minutes always 0)
- Start Level 1. The hint button should appear (small, subtle, below or near the clock).
- Click hint:
  - **Stage 1 (3s)**: The hour hand should glow amber. The hour number that the hand points at should glow.
  - **Stage 2**: Should be skipped or very brief (no minute info to show).
  - After stages complete, all highlights should clear.

#### Level 3 — Five-Minute Jumps (labels visible)
- Start Level 3. Click hint:
  - **Stage 1**: Hour hand + adjacent hour numbers glow.
  - **Stage 2**: Minute hand glows. The five-minute labels near the minute hand position glow (they're already visible on this level).
  - Check: labels glow with the amber color, not the normal blue.

#### Level 5 — Standard Clock (no five-minute labels)
- Start Level 5. Click hint:
  - **Stage 1**: Hour hand + hour numbers glow (numbers are visible normally on this level).
  - **Stage 2**: Minute hand glows. The relevant five-minute labels **appear temporarily** (they're normally hidden on Level 5) with a reveal animation.
  - After hint completes, the temporarily-shown labels should disappear.

#### Level 6 — Expert (no numbers at all)
- Start Level 6. Click hint:
  - **Stage 1**: Hour hand glows. The relevant hour numbers **appear temporarily** (normally hidden on Level 6) with the hint-reveal animation.
  - **Stage 2**: Minute hand glows. Relevant five-minute labels appear temporarily.
  - After hint completes, all temporarily-shown numbers/labels disappear.

#### Interaction Edge Cases
- Click hint, then immediately answer a question → hint should cancel, all highlights clear.
- Click hint repeatedly → should restart cleanly from stage 1.
- Click hint, wait for it to finish → should return to idle with no artifacts.
- Hint should be disabled (grayed out) while answer feedback is showing (sweeping/correct/incorrect animation).

#### Accessibility
- Tab to the hint button — focus ring should be visible.
- Screen reader should announce the button's `aria-label` and `aria-pressed` state.
- With `prefers-reduced-motion: reduce` enabled:
  - No pulse/glow animations.
  - Hint-highlighted elements should still change color (static amber).

#### RTL (Hebrew)
- Switch to Hebrew in Settings.
- Hint button should not be mispositioned in RTL layout.
- Clock rendering should be identical (clock face is not directional).

### Files to Check
| File | What to verify |
|------|---------------|
| `src/types/game.ts` | `Hint` removed; `HintStage`, `HintHighlight`, `VisualHint` present |
| `src/logic/hintEngine.ts` | `generateVisualHint` exported; no `generateHint`; no `Question`/`Hint` imports |
| `src/hooks/useHintSequence.ts` | Exists; exports `useHintSequence` |
| `src/hooks/useGameSession.ts` | No `Hint` import; no `generateHint`; no `t.hintLevelMessages`; exports `activeHighlight`, `hintStage`, `triggerHint` |
| `src/components/Clock/Clock.tsx` | `hintHighlight` prop accepted and passed through |
| `src/components/Clock/ClockFace.tsx` | Hint classes applied; hint-reveal rendering for hidden numbers |
| `src/components/Clock/ClockHands.tsx` | `clock-hand--hint` class applied conditionally |
| `src/components/Clock/Clock.css` | New hint keyframes; reduced-motion rules |
| `src/styles/tokens.css` | `--color-hint` variable present |
| `src/components/GameSession/HintButton.tsx` | `HintPopup` deleted; `active` prop; no `Button` import (if redesigned) |
| `src/components/GameSession/HintButton.css` | All `.hint-popup__*` rules gone; new `.hint-trigger` styles |
| `src/components/GameSession/QuestionView.tsx` | No `HintPopup`; no `hintVisible` state; passes `hintHighlight` to Clock |
| `src/components/GameSession/GameSession.tsx` | No `currentHint`; passes `activeHighlight`, `hintStage`, `triggerHint` |
| `src/i18n/locales/en.json` | No `hintLevelMessages`, no `hintClose` |
| `src/i18n/locales/he.json` | No `hintLevelMessages`, no `hintClose` |
| `src/i18n/types.ts` | No `hintLevelMessages`, no `hintClose` in either interface |
