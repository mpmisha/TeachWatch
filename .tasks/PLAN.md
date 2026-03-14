# Implementation Plan — TeachWatch Visual Redesign

## Summary

This is a CSS-only visual redesign of the TeachWatch app based on the design handoff in `NEW_DESIGN_HANDOFF.md` and `STITCH_DESIGN_HANDOFF.md`. No logic, hooks, game mechanics, or component structure changes. The work decomposes into 9 chunks across 3 phases: first update the shared design tokens (Phase 0), then apply per-screen styling updates in parallel (Phase 1), and finally update the common Button component and app shell (Phase 2).

All changes must preserve existing behavior, accessibility, RTL support, animations (hint system, feedback overlays, clock transitions), and WCAG AA contrast ratios.

---

## Phase 0: Shared Contracts

- **Chunk C0**: Update design tokens
  - Files: `src/styles/tokens.css`
  - Dependencies: none
  - Agent: Expert React Frontend Engineer

---

## Phase 1 (parallel — all chunks independent, no shared files)

- **Chunk C1**: Restyle Level Select screen
  - Files: `src/components/LevelSelect/LevelSelect.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

- **Chunk C2**: Restyle Game Session screen
  - Files: `src/components/GameSession/GameSession.css`, `src/components/GameSession/AnswerButtons.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

- **Chunk C3**: Restyle Clock component
  - Files: `src/components/Clock/Clock.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

- **Chunk C4**: Restyle Summary screen
  - Files: `src/components/Summary/Summary.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

- **Chunk C5**: Restyle High Scores / Trophy Room
  - Files: `src/components/HighScores/HighScores.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

- **Chunk C6**: Restyle Settings screen
  - Files: `src/components/Settings/Settings.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

- **Chunk C7**: Restyle Level Intro screen
  - Files: `src/components/LevelIntro/LevelIntro.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

---

## Phase 2 (depends on C0, parallelizable with Phase 1)

- **Chunk C8**: Update common Button, global styles, and app shell
  - Files: `src/components/common/Button.css`, `src/App.css`, `src/index.css`
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

---

## Edge Cases

1. **WCAG contrast**: New `#5C7CFA` blue on white has ~3.5:1 ratio. This passes AA for large text (≥18px bold / ≥24px normal). All button text is ≥1.125rem bold, so this passes. The agent must verify no small body text is placed on the new primary blue.
2. **Clock hand colors during feedback**: When answering correctly/incorrectly, both hands turn green/red (overriding the coral/blue defaults). The `.clock--correct .clock-hand` and `.clock--incorrect .clock-hand` rules must continue to take precedence over individual hand color overrides.
3. **Hint system overlays**: The hint gradient (`#ff8f00 → #f9a825 → #e65100`) is independent of token changes. Keep amber/gold hint colors as-is.
4. **RTL layout**: All changes are CSS-only. No new `left`/`right` directional values. Use only logical properties.
5. **`color-mix()` cascade**: Several components use `color-mix()` with local CSS variables. When token values change, derived colors update automatically.
6. **`--radius-lg` cascade**: Changing from `16px` → `24px` affects ALL elements using this token: tip banner, transition text, feedback containers. Agent must verify these look correct with larger radius.
7. **Mobile breakpoints**: No layout breakpoints change. Only visual properties (colors, radii, shadows) update.

## Open Questions

1. **Game Session 15/45/40 split**: The design handoff specifies fixed percentages. On very short viewports (< 600px height), strict percentages may clip content. Recommend using `flex` with `min-height` safety valves instead of hard percentages.
2. **Button pill shape universality**: Making ALL `.tw-button` elements pill-shaped (9999px radius) affects summary action buttons, quit button, and settings back button. The design handoff explicitly requests this ("Buttons to use 9999px pill shape").
3. **Star rating size**: Design says "massive" without exact values. Plan proposes increasing from `clamp(1.6rem, 4.8vw, 2.3rem)` to `clamp(2rem, 6vw, 3rem)`.
