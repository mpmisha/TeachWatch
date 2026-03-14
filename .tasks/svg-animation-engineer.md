# SVG Animation Engineer — Task

## Chunk C3: Clock SVG Hint Highlighting
- **Phase**: 1
- **Dependencies**: C0 (shared types)
- **Files to create/modify**:
  - `src/components/Clock/Clock.tsx` (modify)
  - `src/components/Clock/ClockFace.tsx` (modify)
  - `src/components/Clock/ClockHands.tsx` (modify)
  - `src/components/Clock/Clock.css` (modify — append only)
  - `src/styles/tokens.css` (modify — add one CSS variable)

### Description
Add visual hint highlighting capabilities to the clock SVG. When a `hintHighlight` prop is provided, specific clock elements glow/pulse to draw the child's attention.

---

### Clock.tsx Changes

**Current props interface:**
```ts
export interface ClockProps {
  time: ClockTime;
  features: ClockFeatures;
  animationState?: ClockAnimationState;
  size?: string;
  className?: string;
}
```

**Add one optional prop:**
```ts
export interface ClockProps {
  time: ClockTime;
  features: ClockFeatures;
  animationState?: ClockAnimationState;
  hintHighlight?: HintHighlight;  // NEW
  size?: string;
  className?: string;
}
```

**Import** `HintHighlight` from `'../../types/game'`.

**Changes to JSX:**
1. If `hintHighlight` is truthy, add `'clock--hinting'` to the CSS classes list.
2. Pass `hintHighlight` to `<ClockFace>` and `<ClockHands>`:
   ```tsx
   <ClockFace features={features} hintHighlight={hintHighlight} />
   <ClockHands time={time} hintHighlight={hintHighlight} />
   ```

---

### ClockFace.tsx Changes

**Current props interface:**
```ts
export interface ClockFaceProps {
  features: ClockFeatures;
}
```

**Add:**
```ts
import type { ClockFeatures, HintHighlight } from '../../types/game';

export interface ClockFaceProps {
  features: ClockFeatures;
  hintHighlight?: HintHighlight;  // NEW
}
```

**Hour numbers section** — currently rendered when `features.showNumbers` is true:
```tsx
{features.showNumbers && (
  <g className="clock-hour-numbers">
    {HOUR_NUMBERS.map((value) => { ... })}
  </g>
)}
```

**New logic**: Render hour numbers in TWO groups:
1. **Always-visible numbers** (when `showNumbers` is true): Render as before, but add `clock-hour-number--hint` class if the number is in `hintHighlight?.highlightHourNumbers`.
2. **Hint-revealed numbers** (when `showNumbers` is false): Only render numbers that are in `hintHighlight?.highlightHourNumbers`, with class `clock-hour-number--hint-reveal`.

Implementation approach:
```tsx
// Determine which hour numbers to hint-highlight
const hintedHourNumbers = new Set(hintHighlight?.highlightHourNumbers ?? []);

{/* Always-visible hour numbers (level has showNumbers=true) */}
{features.showNumbers && (
  <g className="clock-hour-numbers">
    {HOUR_NUMBERS.map((value) => {
      const degrees = value * 30;
      const hintClass = hintedHourNumbers.has(value) ? ' clock-hour-number--hint' : '';
      return (
        <text
          key={value}
          className={`clock-hour-number${hintClass}`}
          x={polarX(38, degrees)}
          y={polarY(38, degrees) + 2}
          textAnchor="middle"
        >
          {value}
        </text>
      );
    })}
  </g>
)}

{/* Hint-revealed hour numbers (level hides numbers, but hint needs to show some) */}
{!features.showNumbers && hintedHourNumbers.size > 0 && (
  <g className="clock-hour-numbers">
    {HOUR_NUMBERS.filter((v) => hintedHourNumbers.has(v)).map((value) => {
      const degrees = value * 30;
      return (
        <text
          key={value}
          className="clock-hour-number clock-hour-number--hint-reveal"
          x={polarX(38, degrees)}
          y={polarY(38, degrees) + 2}
          textAnchor="middle"
        >
          {value}
        </text>
      );
    })}
  </g>
)}
```

**Five-minute labels section** — same pattern:
```tsx
const hintedFiveMinLabels = new Set(hintHighlight?.highlightFiveMinuteLabels ?? []);

{/* Always-visible five-minute labels */}
{features.showFiveMinuteLabels && (
  <g className="clock-five-minute-labels">
    {FIVE_MINUTE_LABELS.map((value) => {
      const degrees = (value / 5) * 30;
      const hintClass = hintedFiveMinLabels.has(value) ? ' clock-five-minute-label--hint' : '';
      return (
        <text
          key={value}
          className={`clock-five-minute-label${hintClass}`}
          x={polarX(32, degrees)}
          y={polarY(32, degrees) + 1.5}
          textAnchor="middle"
        >
          {value}
        </text>
      );
    })}
  </g>
)}

{/* Hint-revealed five-minute labels (level hides them, but hint shows some) */}
{!features.showFiveMinuteLabels && hintedFiveMinLabels.size > 0 && (
  <g className="clock-five-minute-labels">
    {FIVE_MINUTE_LABELS.filter((v) => hintedFiveMinLabels.has(v)).map((value) => {
      const degrees = (value / 5) * 30;
      return (
        <text
          key={value}
          className="clock-five-minute-label clock-five-minute-label--hint-reveal"
          x={polarX(32, degrees)}
          y={polarY(32, degrees) + 1.5}
          textAnchor="middle"
        >
          {value}
        </text>
      );
    })}
  </g>
)}
```

---

### ClockHands.tsx Changes

**Current props:**
```ts
export interface ClockHandsProps {
  time: ClockTime;
}
```

**Add:**
```ts
import type { ClockTime, HintHighlight } from '../../types/game';

export interface ClockHandsProps {
  time: ClockTime;
  hintHighlight?: HintHighlight;  // NEW
}
```

**Changes to JSX:**
- Hour hand group: if `hintHighlight?.hand === 'hour'`, add `clock-hand--hint` class to the `<g>` wrapper.
- Minute hand group: if `hintHighlight?.hand === 'minute'`, add `clock-hand--hint` class to the `<g>` wrapper.

```tsx
<g
  className={`clock-hand-group${hintHighlight?.hand === 'hour' ? ' clock-hand--hint' : ''}`}
  style={{ transform: `rotate(${hourDegrees}deg)`, transformOrigin: '50px 50px' }}
>
  <line className="clock-hand clock-hand--hour" x1="50" y1="50" x2="50" y2="25" />
</g>

<g
  className={`clock-hand-group${hintHighlight?.hand === 'minute' ? ' clock-hand--hint' : ''}`}
  style={{ transform: `rotate(${minuteDegrees}deg)`, transformOrigin: '50px 50px' }}
>
  <line className="clock-hand clock-hand--minute" x1="50" y1="50" x2="50" y2="10" />
</g>
```

---

### Clock.css — Append New Rules

Add these rules at the end of `Clock.css`. **Do NOT modify existing rules.**

```css
/* ===== Hint Highlighting ===== */

.clock--hinting .clock-rim {
  stroke: color-mix(in oklab, var(--color-clock-rim, #2d3436) 70%, var(--color-hint, #f9a825) 30%);
}

/* Hand glow/pulse during hint */
.clock-hand--hint .clock-hand {
  stroke: var(--color-hint, #f9a825);
  stroke-width: 3.5;
  filter: drop-shadow(0 0 4px rgba(249, 168, 37, 0.7));
  animation: hint-hand-pulse 1.2s ease-in-out infinite;
}

.clock-hand--hint .clock-hand--minute {
  stroke-width: 2.5;
}

/* Number glow when already visible */
.clock-hour-number--hint {
  fill: var(--color-hint, #f9a825);
  font-weight: 900;
  font-size: 8.5px;
  animation: hint-number-glow 1.2s ease-in-out infinite;
}

.clock-five-minute-label--hint {
  fill: var(--color-hint, #f9a825);
  font-weight: 800;
  font-size: 5px;
  animation: hint-number-glow 1.2s ease-in-out infinite;
}

/* Numbers temporarily revealed by hint */
.clock-hour-number--hint-reveal {
  fill: var(--color-hint, #f9a825);
  font-weight: 900;
  font-size: 8.5px;
  animation: hint-number-reveal 0.35s ease-out forwards, hint-number-glow 1.2s ease-in-out 0.35s infinite;
}

.clock-five-minute-label--hint-reveal {
  fill: var(--color-hint, #f9a825);
  font-weight: 800;
  font-size: 5px;
  animation: hint-number-reveal 0.35s ease-out forwards, hint-number-glow 1.2s ease-in-out 0.35s infinite;
}

@keyframes hint-hand-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 3px rgba(249, 168, 37, 0.45));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(249, 168, 37, 0.9));
  }
}

@keyframes hint-number-glow {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

@keyframes hint-number-reveal {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .clock-hand--hint .clock-hand {
    animation: none;
    filter: none;
    stroke: var(--color-hint, #f9a825);
  }

  .clock-hour-number--hint,
  .clock-five-minute-label--hint {
    animation: none;
    opacity: 1;
  }

  .clock-hour-number--hint-reveal,
  .clock-five-minute-label--hint-reveal {
    animation: none;
    opacity: 1;
  }
}
```

---

### tokens.css — Add CSS Variable

Add to the `:root` block in `src/styles/tokens.css`:
```css
  --color-hint: #f9a825;            /* Amber — hint highlighting */
```

Place it in the "Clock-specific" section, after `--color-clock-label`.

---

### Edge Cases
1. **`hintHighlight` is undefined** (no hint active): All code paths should be no-ops — no extra classes, no extra elements rendered.
2. **Both hint and answer feedback active**: Shouldn't happen (hint cancels on answer), but if it did, `ClockAnimationState` styles and hint styles are on different selectors and won't conflict.
3. **SVG `transform` on hint-reveal text**: SVG `<text>` elements don't support CSS `transform` the same way HTML does. The `hint-number-reveal` keyframe with `scale()` may need to use `transform-origin` set to the element's center, or use `transform-box: fill-box`. Test this and adjust. Alternative: use SVG `<animateTransform>` or skip the scale and only animate opacity.
4. **Performance**: Adding `filter: drop-shadow()` to SVG elements can be GPU-intensive on low-end devices. The animation is simple and the clock is a single small SVG — should be fine.
5. **`clock-hand--hint` on the group vs the line**: The class goes on the `<g>` group for CSS specificity. The CSS selector `.clock-hand--hint .clock-hand` targets the `<line>` inside. This matches the existing pattern for `clock--correct .clock-hand`.
