# Game Logic Engineer — No Tasks

No Game Logic tasks for this redesign plan. This is a CSS-only styling update. See `expert-react-frontend-engineer.md`.
- **Phase**: 1
- **Dependencies**: C0 (shared types)
- **Files to create/modify**:
  - `src/logic/hintEngine.ts` (modify — full rewrite)

### Description

Replace the text-based `generateHint()` function with a new `generateVisualHint()` that returns a `VisualHint` descriptor (two stages of clock highlights).

**Remove the entire current implementation:**
```ts
export function generateHint(question: Question, level: number, templates: string[]): Hint { ... }
```

**Replace with:**
```ts
import type { ClockFeatures, ClockTime, VisualHint } from '../types/game';

export function generateVisualHint(
  time: ClockTime,
  level: number,
  clockFeatures: ClockFeatures,
): VisualHint {
  return {
    stage1: buildHourStage(time),
    stage2: buildMinuteStage(time, level),
  };
}
```

### Stage 1 — Hour Hand Focus (`buildHourStage`)

```ts
function buildHourStage(time: ClockTime): HintHighlight {
  const { hours, minutes } = time;
  const nextHour = (hours % 12) + 1; // 12 → 1, 1 → 2, etc.

  return {
    hand: 'hour',
    highlightHourNumbers: minutes === 0 ? [hours] : [hours, nextHour],
    highlightFiveMinuteLabels: [],
  };
}
```

Logic:
- If minutes is 0, the hour hand points exactly at `hours` → highlight only that number.
- Otherwise the hour hand is between `hours` and the next number → highlight both.
- The `nextHour` wrap: `12 % 12 + 1 = 1`. Correct.

### Stage 2 — Minute Hand Focus (`buildMinuteStage`)

```ts
function buildMinuteStage(time: ClockTime, level: number): HintHighlight {
  const { minutes } = time;

  // Level 1: minutes is always 0, stage 2 is empty
  if (level === 1 || minutes === 0) {
    return {
      hand: 'minute',
      highlightHourNumbers: [],
      highlightFiveMinuteLabels: [],
    };
  }

  const lowerFive = Math.floor(minutes / 5) * 5;
  const upperFive = (lowerFive + 5) % 60;

  const labels: number[] = [];

  if (minutes % 5 === 0) {
    // Exactly on a 5-minute mark
    if (lowerFive > 0) labels.push(lowerFive);
    // lowerFive === 0 means :00 → at 12 position, no label to show
  } else {
    // Between two 5-minute marks
    if (lowerFive > 0) labels.push(lowerFive);
    if (upperFive > 0) labels.push(upperFive);
    // Filter 0 because there's no "0" label on the clock (it's the 12 position)
  }

  return {
    hand: 'minute',
    highlightHourNumbers: [],
    highlightFiveMinuteLabels: labels,
  };
}
```

Logic:
- Compute the two 5-minute boundaries the minute hand is between.
- If exactly on a mark, only one label.
- Filter out `0` — there's no "0" five-minute label on the clock face, it corresponds to the 12/top position.
- Level 1 or minutes=0 → empty stage 2 (minute hand at 12 — nothing useful to highlight).

### Interfaces to use
- `ClockTime` from `src/types/game.ts`: `{ hours: number; minutes: number }`
- `ClockFeatures` from `src/types/game.ts`: `{ showNumbers, showFiveMinuteLabels, showMinuteTicks }`
- `VisualHint` from `src/types/game.ts` (C0): `{ stage1: HintHighlight; stage2: HintHighlight }`
- `HintHighlight` from `src/types/game.ts` (C0): `{ hand, highlightHourNumbers, highlightFiveMinuteLabels }`

### Important: Remove old imports
- Remove import of `Question` (no longer needed).
- Remove import of `Hint` (deleted in C0).
- The function no longer takes `templates: string[]` — no i18n dependency.

### Edge cases
1. **Hour 12, minutes > 0**: `nextHour = 12 % 12 + 1 = 1` — correct.
2. **Minutes = 55**: `lowerFive = 55`, `upperFive = 0`. Since `upperFive === 0`, it's filtered → labels = `[55]`.
3. **Minutes = 0**: Stage 2 returns empty. The `useHintSequence` hook (C2) may skip stage 2 for this case.
4. **Minutes = 5**: Exactly on mark → labels = `[5]`.
5. **Minutes = 3**: `lowerFive = 0` (filtered), `upperFive = 5` → labels = `[5]`.
6. **Level 1**: Always minutes=0 → empty stage 2.
7. **`clockFeatures` parameter**: Passed for potential future use (e.g., adjusting hints based on visible features). Not used in current logic but included in the signature for forward compatibility. Mark with a `_clockFeatures` or keep as-is.

### Testing approach
- Unit test with various time/level combinations:
  - `{ hours: 8, minutes: 37 }, level: 4` → stage1: `[8, 9]`, stage2: `[35, 40]`
  - `{ hours: 3, minutes: 0 }, level: 1` → stage1: `[3]`, stage2: empty
  - `{ hours: 12, minutes: 15 }, level: 3` → stage1: `[12, 1]`, stage2: `[15]`
  - `{ hours: 6, minutes: 58 }, level: 5` → stage1: `[6, 7]`, stage2: `[55]` (upperFive=0 filtered)
