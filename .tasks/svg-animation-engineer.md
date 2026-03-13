# SVG Animation Engineer — Task

## Chunk C2: Analog Clock SVG Component
- **Phase**: 1
- **Dependencies**: C0 (project scaffolding), C1 (shared types from `src/types/game.ts`, utilities from `src/logic/timeUtils.ts`)
- **Files to create**:
  - `src/components/Clock/Clock.tsx`
  - `src/components/Clock/ClockFace.tsx`
  - `src/components/Clock/ClockHands.tsx`
  - `src/components/Clock/Clock.css`

### Description

Build a complete, animated analog clock as a React component using inline SVG. This is the centerpiece visual of the entire game — it must be crisp, child-friendly, and support smooth animations for gameplay feedback.

### SVG Coordinate System

Use a `100 × 100` viewBox with center at `(50, 50)`. This allows all coordinates to be expressed as simple numbers that double as percentages.

```
<svg viewBox="0 0 100 100">
```

The component accepts a `size` prop (CSS dimension string, default `"300px"`) controlling the rendered width/height. The SVG scales responsively within its container.

### `src/components/Clock/Clock.tsx`

Top-level clock component. This is what consumers import.

```typescript
interface ClockProps {
  time: ClockTime;
  features: ClockFeatures;
  animationState?: ClockAnimationState; // default: 'idle'
  size?: string;                         // CSS size, default "300px"
  className?: string;
}
```

Renders a single `<svg>` element containing `<ClockFace>` and `<ClockHands>`. Applies a CSS class based on `animationState` for feedback animations. The `size` prop sets `width` and `height` on the SVG.

### `src/components/Clock/ClockFace.tsx`

Renders the static clock face elements.

```typescript
interface ClockFaceProps {
  features: ClockFeatures;
}
```

Elements to render (all conditionally based on `features`):

1. **Outer circle**: Circle at `(50, 50)` with radius ~48. White/cream fill, dark stroke.
2. **Hour numerals** (when `showNumbers`): Numbers 1-12 positioned around the circle at radius ~40 from center. Use `<text>` elements positioned with trigonometry:
   - x = 50 + 38 × sin(number × 30°)
   - y = 50 - 38 × cos(number × 30°) + small baseline offset
   - Font: bold, child-friendly size (~7-8 units).
3. **Five-minute labels** (when `showFiveMinuteLabels`): Smaller numbers 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 positioned at radius ~32, between/outside the hour numerals. These correspond to the minute value at each hour position. Smaller font (~4 units), lighter color.
4. **Minute tick marks** (when `showMinuteTicks`): 60 small lines radiating from the edge. Every 5th tick is longer/thicker (hour marker). Ticks at radius 44-48 (short) or 42-48 (long for 5-min marks).
5. **Center dot**: Small circle at `(50, 50)`, radius ~2, dark fill.

### `src/components/Clock/ClockHands.tsx`

Renders the hour and minute hands with rotation transforms.

```typescript
interface ClockHandsProps {
  time: ClockTime;
}
```

Import `hourRotation` and `minuteRotation` from `../../logic/timeUtils`.

**Hour hand**:
- SVG `<line>` or `<rect>` from center `(50, 50)` extending upward.
- Length: 25 units (from center toward 12 o'clock, so `y2 = 50 - 25 = 25`).
- Stroke width: ~3 units. Round linecap.
- Transform: `rotate(${hourRotation(hours, minutes)}, 50, 50)` — rotates around the center.

**Minute hand**:
- Length: 40 units (`y2 = 50 - 40 = 10`).
- Stroke width: ~2 units. Round linecap.
- Transform: `rotate(${minuteRotation(minutes)}, 50, 50)`.

Both hands should use a `<g>` wrapper with `transform-origin: 50px 50px` for CSS animation compatibility.

**Critical**: Apply CSS `transition: transform var(--transition-slow, 600ms) ease-in-out` to the hand groups. This makes hands sweep smoothly when the `time` prop changes between questions. Reference `--transition-slow` from the design tokens (with fallback).

### `src/components/Clock/Clock.css`

Styles and keyframe animations for the clock.

**Base styles**:
```css
.clock-svg {
  display: block;
  user-select: none;
}
```

**Animation: Correct answer** (`.clock--correct`):
- Green pulse effect on the clock. The hands and/or outer circle briefly glow green.
- Use `@keyframes clock-pulse-correct` — scale the clock slightly (1.0 → 1.05 → 1.0) over ~400ms while applying a green drop-shadow or stroke color change.

**Animation: Incorrect answer** (`.clock--incorrect`):
- Red wiggle effect. The clock shakes horizontally.
- Use `@keyframes clock-wiggle` — translateX oscillation (-3px, 3px, -2px, 1px, 0) over ~400ms.
- Hands and/or circle turn red briefly.

**Sweep transition**:
- The hands have a CSS transition on `transform`. When `animationState` is `'sweeping'`, optionally increase the transition duration for a more dramatic sweep.

**Color variables** (reference from design tokens with fallback):
```css
.clock-hand {
  stroke: var(--color-clock-hand, #2d3436);
  transition: transform var(--transition-slow, 600ms) ease-in-out,
              stroke var(--transition-fast, 150ms) ease;
}

.clock--correct .clock-hand {
  stroke: var(--color-success, #00b894);
}

.clock--incorrect .clock-hand {
  stroke: var(--color-error, #d63031);
}
```

### Usage Example

```tsx
<Clock
  time={{ hours: 3, minutes: 15 }}
  features={{ showNumbers: true, showFiveMinuteLabels: true, showMinuteTicks: true }}
  animationState="idle"
  size="300px"
/>
```

### Edge Cases
- **12 o'clock**: Hour hand at 0°/360° — ensure rotation renders correctly (no jump).
- **Transition direction**: When sweeping from e.g. 350° to 10°, CSS will animate through 0° the long way (-340°). This is a known CSS limitation. For now, accept this; if problematic, the component can detect and set an intermediate class to disable transition for one frame. Document this as a known issue.
- **ClockFace with no features**: If all features are false (Level 6 `showNumbers: false`, `showFiveMinuteLabels: false`, but `showMinuteTicks: true`), the face should render just the circle, minute ticks, and center dot.
- **Accessible**: Add `role="img"` and `aria-label` to the SVG describing the displayed time (hidden from sighted users but available to screen readers).
- **Small rendering**: The Clock may render at small sizes (e.g., 80px) in the TrickyTimes grid. Ensure numerals and ticks remain legible or degrade gracefully. The `size` prop controls this.
