# Expert React Frontend Engineer — Tasks

All tasks are CSS-only styling changes. **No logic, hooks, or component structure changes.** Preserve all existing behavior, animations, accessibility, and RTL support.

Reference documents:
- `.tasks/NEW_DESIGN_HANDOFF.md` — Concrete design token values, layout specs, implementation notes
- `.tasks/STITCH_DESIGN_HANDOFF.md` — Visual mockup screenshots for reference
- `.tasks/SPEC.md` — Full product spec (sections 2–6 for current token values and component specs)

---

## Task T1 — Chunk C0: Update Design Tokens

- **Phase**: 0
- **Dependencies**: none
- **Files to create/modify**:
  - `src/styles/tokens.css`
- **Description**: Update the CSS custom properties in the `:root` block to match the new design system. This is the foundation — all other tasks depend on these values propagating correctly through `var()` references.
- **Exact changes**:
  1. `--color-primary`: `#4361ee` → `#5C7CFA`
  2. `--color-primary-hover`: `#3a56d4` → `#4C6CE8` (proportionally softer)
  3. `--color-primary-active`: `#2f4bc0` → `#3D5DD6` (proportionally softer)
  4. `--color-success`: `#00b894` → `#20C997`
  5. `--color-success-light`: `#d4f5ed` → `#C3FAE8` (proportionally brighter)
  6. `--color-error`: `#d63031` → `#FF6B6B`
  7. `--color-error-light`: `#fce4e4` → `#FFE3E3` (warmer)
  8. `--color-gold`: `#fdcb6e` → `#FCC419`
  9. `--radius-lg`: `16px` → `24px`
  10. Add new token: `--color-bg-gradient-center: #E5F4FF;` (after `--color-background`)
  11. Add new tokens for per-hand clock colors (after existing `--color-clock-hand`):
      - `--color-clock-hand-hour: #FF6B6B;`
      - `--color-clock-hand-minute: #5C7CFA;`
- **What NOT to change**: Font family, font sizes, spacing scale, shadows, transitions, touch-min
- **Validation**: After applying, run the app and visually verify the Level Select screen renders with the new blue and that buttons show the updated primary color. Check that white text on `#5C7CFA` buttons at their rendered size meets WCAG AA for large text (3:1 ratio minimum for ≥18px bold text).

---

## Task T2 — Chunk C1: Restyle Level Select Screen

- **Phase**: 1
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/LevelSelect/LevelSelect.css`
- **Description**: Update the Level Select screen styling to match the new design handoff: radial gradient background, softer card shadows, 24px card radius, updated grid gap, enhanced hover states.
- **Exact changes**:
  1. **Background gradient**: Update the `background` property on `.level-select` to use `radial-gradient(circle at 50% 30%, #E5F4FF, transparent 60%)` as the primary radial, keeping the existing warm/green accents underneath
  2. **Card border-radius**: `.level-card` — change `border-radius: 18px` → `border-radius: 24px`
  3. **Card shadow**: `.level-card` — change `box-shadow: 0 6px 14px rgba(26, 42, 64, 0.12)` → `box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05)`
  4. **Card hover**: `.level-card:hover` — change `transform: translateY(-2px)` → `transform: translateY(-4px)` and shadow to `0 12px 24px rgba(0, 0, 0, 0.08)`
  5. **Grid gap**: `.level-select__grid` — update `gap` to `1.5rem` (was `clamp(8px, 1.5vw, 14px)`)
  6. **Grid columns**: `.level-select__grid` — change to `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))` for better auto-responsive behavior
  7. **Medal badge**: `.level-card__medal` — update border/background colors to use the new softer palette
- **Preserve**: Mobile breakpoints at 500px and 880px, all flex/grid parent-child relationships, hover/active/focus transitions
- **Edge case**: The grid change to `auto-fit` with `minmax(140px, 1fr)` may produce 3+ columns on wide screens. The existing `@media (min-width: 880px)` rule may need adjustment or removal since `auto-fit` handles responsiveness natively.

---

## Task T3 — Chunk C2: Restyle Game Session Screen

- **Phase**: 1
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/GameSession/GameSession.css`
  - `src/components/GameSession/AnswerButtons.css`
- **Description**: Update the Game Session screen to use the new color palette and enforce the design's vertical split layout with larger answer buttons.
- **Exact changes in `GameSession.css`**:
  1. **Background**: Update radial gradient colors — replace `rgba(67, 97, 238, 0.12)` with `rgba(92, 124, 250, 0.12)` and `rgba(0, 184, 148, 0.12)` with `rgba(32, 201, 151, 0.12)`
  2. **Feedback overlay**: Colors auto-update via `var(--color-success)` and `var(--color-error)` — no manual change needed
  3. **Transition container**: `border-radius` auto-updates via `var(--radius-lg)` — verify it looks good at 24px
- **Exact changes in `AnswerButtons.css`**:
  1. **Answer button size**: The `.answer-choice` class (which applies `.tw-button--answer`) needs its min-height increased. Since size is controlled in `Button.css` via `.tw-button--answer`, this change belongs to T9 (C8). However, if answer-specific overrides are needed here, add `.answer-choice { min-height: 80px; }` as a safety fallback.
  2. **Success/error colors**: `.answer--correct` background references `var(--color-success)` — auto-updates. `.answer--incorrect` references `var(--color-danger)` — verify this token exists or update to `var(--color-error)`.
- **Preserve**: Tip banner animation, feedback overlay transitions, question-view flex layout, mobile breakpoints at 720px, all `clamp()` responsive values
- **Edge case**: The `.answer--incorrect` class uses `var(--color-danger, #dc2626)` as a fallback. This is NOT the same token as `--color-error`. Check if `--color-danger` is defined anywhere — if not, update the fallback to `#FF6B6B` to match new error color, or add `--color-danger` as an alias for `--color-error` in tokens.

---

## Task T4 — Chunk C3: Restyle Clock Component

- **Phase**: 1
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/Clock/Clock.css`
- **Description**: Color the hour and minute hands differently and add rounded caps per the design handoff. Update feedback state colors to new palette.
- **Exact changes**:
  1. **Hour hand color**: Add `stroke: var(--color-clock-hand-hour, #FF6B6B);` to `.clock-hand--hour`
  2. **Minute hand color**: Add `stroke: var(--color-clock-hand-minute, #5C7CFA);` to `.clock-hand--minute`
  3. **Rounded caps**: Both `.clock-hand--hour` and `.clock-hand--minute` already inherit `stroke-linecap: round` from `.clock-hand`. Verify this is present — if not, add it.
  4. **Correct feedback**: `.clock-svg.clock--correct .clock-hand` — stroke auto-updates via `var(--color-success)`. The hardcoded color in `@keyframes clock-pulse-correct` filter (`rgba(0, 184, 148, ...)`) should be updated to `rgba(32, 201, 151, ...)` to match new success color.
  5. **Incorrect feedback**: `.clock-svg.clock--incorrect .clock-hand` — stroke auto-updates via `var(--color-error)`.
  6. **Correct rim**: `.clock-svg.clock--correct .clock-rim` — auto-updates via `var(--color-success)`.
  7. **Incorrect rim**: `.clock-svg.clock--incorrect .clock-rim` — auto-updates via `var(--color-error)`.
- **Do NOT change**:
  - Any hint highlighting CSS (the `clock--hinting`, `clock-hand--hint`, `clock-hand--dimmed` rules)
  - The hint gradient SVG defs in `Clock.tsx`
  - The `.clock-hand-cap` fill (stays neutral dark)
  - Keyframe animations (except the pulse filter color)
  - `prefers-reduced-motion` rules
- **Edge case**: The `.clock-hand--hint .clock-hand` rule uses `stroke: url(#hint-hand-grad)` which overrides individual hand colors during hints. This is correct — hints should override the default coral/blue colors. The `.clock-svg.clock--correct .clock-hand` and `.clock-svg.clock--incorrect .clock-hand` selectors also override — verify specificity order is: default < per-hand color < feedback state < hint state.

---

## Task T5 — Chunk C4: Restyle Summary Screen

- **Phase**: 1
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/Summary/Summary.css`
- **Description**: Update Summary screen colors and enlarge the star rating display.
- **Exact changes**:
  1. **Gold color**: Update `--summary-gold: #f9b233` → `--summary-gold: #FCC419`
  2. **Right/wrong colors**: Update `--summary-right` to `#20C997` (new success) and `--summary-wrong` to `#FF6B6B` (new error)
  3. **Star size**: `.summary-stars__star` — update `font-size: clamp(1.6rem, 4.8vw, 2.3rem)` → `font-size: clamp(2rem, 6vw, 3rem)` for a larger, more celebratory display
  4. **Star glow**: `.summary-stars__star.is-filled` text-shadow — update `rgba(249, 178, 51, 0.4)` → `rgba(252, 196, 25, 0.45)` for the new gold color
  5. **Perfect round banner**: `.summary__perfect` — auto-updates via `--summary-right`
  6. **Card border-radius**: Already `24px` — no change needed
- **Preserve**: Star bounce animation (`summary-star-in`), tricky times grid layout, all responsive breakpoints (720px, 480px), clock mini-display size

---

## Task T6 — Chunk C5: Restyle High Scores / Trophy Room

- **Phase**: 1
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/HighScores/HighScores.css`
- **Description**: Update card styling and background gradient to match new design system.
- **Exact changes**:
  1. **Card border-radius**: `.high-scores__card` — change `border-radius: 18px` → `border-radius: 24px`
  2. **Card shadow**: `.high-scores__card` — change `box-shadow: 0 6px 14px rgba(26, 42, 64, 0.12)` → `box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05)`
  3. **Background gradient**: Update radial gradient colors in `.high-scores` to use softer tints consistent with the new `#E5F4FF` center
  4. **Back button**: Colors auto-update via `var(--accent)` / `var(--accent-strong)` local variables — no manual change needed
- **Preserve**: Dashed border for unplayed cards (`.high-scores__card--empty`), medal gradient styles (`.medal--gold/silver/bronze/none`), responsive breakpoints at 880px and 500px, all stat row styling

---

## Task T7 — Chunk C6: Restyle Settings Screen

- **Phase**: 1
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/Settings/Settings.css`
- **Description**: Update card border-radius, segmented control colors, and background to match new design system.
- **Exact changes**:
  1. **Card border-radius**: `.settings__card` — change `border-radius: 20px` → `border-radius: 24px`
  2. **Background gradient**: Update tints in `.settings` background to use softer, new-palette-consistent colors
  3. **Segment active state**: `.settings__segment-btn.is-active` — the color uses `var(--settings-primary)` which maps to `var(--color-primary)`. The `box-shadow` hardcodes `rgba(15, 118, 110, 0.2)` — update to `rgba(92, 124, 250, 0.2)` to match new primary blue
  4. **Reset button**: `.settings__reset` gradient uses `var(--settings-error)` which maps to `var(--color-error)` — auto-updates. The `box-shadow` hardcodes `rgba(185, 28, 28, 0.24)` — update to `rgba(255, 107, 107, 0.24)` to match new error color
  5. **Segment track**: `.settings__segment` background — verify it still feels cohesive with the updated border color
- **Preserve**: 2-column layout at 600px, flex-direction column on mobile, all focus-visible outlines, reset 2-tap confirmation behavior

---

## Task T8 — Chunk C7: Restyle Level Intro Screen

- **Phase**: 1
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/LevelIntro/LevelIntro.css`
- **Description**: Update Level Intro styling to match new design tokens. Most values auto-cascade via `var()` references.
- **Exact changes**:
  1. **Card border-radius**: `.level-intro__card` uses `var(--radius-lg)` — auto-updates to 24px from C0. Verify it looks correct.
  2. **Card border color**: Uses `var(--color-primary)` — auto-updates to `#5C7CFA`. Verify contrast.
  3. **Background gradient**: Update radial gradient colors — replace `rgba(67, 97, 238, 0.18)` with `rgba(92, 124, 250, 0.18)` and `rgba(0, 184, 148, 0.2)` with `rgba(32, 201, 151, 0.2)`
  4. **Goal card background**: Uses `var(--color-gold)` — auto-updates. Verify `color-mix()` still looks good with new `#FCC419`.
  5. **Tips card background**: Uses `var(--color-success-light)` — auto-updates.
  6. **Start button gradient**: Uses `var(--color-primary)` and `var(--color-primary-active)` — auto-updates. Update `box-shadow` hardcoded color: `color-mix(in srgb, var(--color-primary-active) 85%, black 15%)` — already uses var, auto-updates.
  7. **Start button hover/active/focus**: Uses vars — auto-updates.
- **Preserve**: 3D push button effect (10px shadow → 5px on press), back link styling, responsive breakpoint at 600px

---

## Task T9 — Chunk C8: Update Common Button, App Shell, and Global Styles

- **Phase**: 2
- **Dependencies**: C0 (T1 — design tokens)
- **Files to create/modify**:
  - `src/components/common/Button.css`
  - `src/App.css`
  - `src/index.css`
- **Description**: Update the shared Button component to use pill shape, enforce 60px min-height, and increase answer button size. Update the app settings gear button size. Verify global font import.

### Changes in `src/components/common/Button.css`:
  1. **Pill shape**: `.tw-button` — change `border-radius: var(--radius-lg, 16px)` → `border-radius: var(--radius-full, 9999px)`
  2. **Min-height**: Already `var(--touch-min, 60px)` — no change needed
  3. **Answer button size**: `.tw-button--answer` — change `min-height: calc(var(--touch-min, 60px) + 8px)` → `min-height: 80px`
  4. **Answer button text**: `.tw-button--answer` — change `font-size: var(--text-answer, clamp(1.25rem, 2.5vw, 1.75rem))` → `font-size: 2rem`
  5. **Primary button color**: Uses `var(--color-primary)` — auto-updates via C0

### Changes in `src/App.css`:
  1. **Gear button size**: `.app__settings-button` — change `width: 40px; height: 40px` → `width: 44px; height: 44px` (per design handoff: "Size: 44x44px minimal")
  2. **Gear hover**: Colors auto-update via `var(--color-primary)` — no manual change

### Changes in `src/index.css`:
  1. **Font import**: Line 1 already has `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap')` — **no change needed**
  2. **Body font-family**: Already references `var(--font-family)` — **no change needed**

- **Preserve**: All button transitions, hover/active/focus states, disabled state opacity, `.tw-button--secondary` styling
- **Edge case**: Changing `.tw-button` to pill shape (9999px) affects ALL buttons app-wide. The Level Intro start button already uses `var(--radius-full)` independently — no conflict. The Settings reset button uses `var(--radius-lg)` — it will get the new 24px radius from C0 but NOT the pill shape since it has its own `border-radius` declaration. Verify all button instances look correct with pill shape.
