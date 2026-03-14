# Game Logic Engineer — Task

## Chunk C1: Hint generation engine
- **Phase**: 1
- **Dependencies**: C0 (shared types and translation templates must exist)
- **Files to create**:
  - `src/logic/hintEngine.ts`
- **Description**: Create a pure-function hint engine that generates contextual, level-appropriate hint text for a given question.

### `src/logic/hintEngine.ts`

```ts
import type { Question, Hint } from '../types/game';

/**
 * Generate a contextual hint for a question based on the level and translation templates.
 *
 * @param question - The current question with a ClockTime
 * @param level - Level number (1-6)
 * @param templates - Array of 6 hint template strings from translations (t.hintLevelMessages)
 * @returns A Hint object with the filled-in text
 */
export function generateHint(question: Question, level: number, templates: string[]): Hint
```

### Logic

1. **Clamp level index**: `const idx = Math.min(Math.max(level - 1, 0), templates.length - 1)`
2. **Select template**: `let text = templates[idx]`
3. **Compute placeholders** from `question.time`:
   - `{hour}` → `question.time.hours` (number 1-12)
   - `{minutes}` → `question.time.minutes` (number 0-59)
   - `{nearestFive}` → the clock face number closest to where the minute hand points:
     ```ts
     const nearestFiveNum = Math.round(question.time.minutes / 5) % 12 || 12;
     ```
     This maps: 0→12, 5→1, 10→2, 15→3, ..., 55→11, 58→12
   - `{nearestFiveMinutes}` → the 5-minute multiple closest to the actual minutes:
     ```ts
     const nearestFiveMin = Math.round(question.time.minutes / 5) * 5;
     ```
     This gives: 0→0, 3→5, 7→5, 8→10, 58→60 (handle 60→0 if needed, but in context "past 12 (60 min)" is unlikely since minutes max at 59 → rounds to 60, which is edge)
4. **Replace placeholders**: Use simple string replacement:
   ```ts
   text = text
     .replace(/\{hour\}/g, String(question.time.hours))
     .replace(/\{minutes\}/g, String(question.time.minutes))
     .replace(/\{nearestFive\}/g, String(nearestFiveNum))
     .replace(/\{nearestFiveMinutes\}/g, String(nearestFiveMin));
   ```
5. **Return**: `{ text }`

### Edge Cases to Handle

| Scenario | `minutes` | `{nearestFive}` | `{nearestFiveMinutes}` | Notes |
|----------|-----------|-----------------|----------------------|-------|
| Exact hour | 0 | 12 | 0 | Top of clock |
| Near hour | 1 | 12 | 0 | Rounds down to 0 |
| Half hour | 30 | 6 | 30 | Bottom of clock |
| Near end | 58 | 12 | 60 | 60 is technically correct in template context ("past 12 (60 min)") but unusual. Consider clamping to 0 or leaving as-is since levels 4+ handle all minutes |
| Near end | 59 | 12 | 60 | Same as above |
| Quarter | 15 | 3 | 15 | Standard |
| Between fives | 23 | 5 | 25 | Rounds to nearest 5 |

**Decision on {nearestFiveMinutes} = 60**: Clamp to 0 to avoid confusion: `const nearestFiveMin = Math.round(minutes / 5) * 5 % 60;`

### Testing Considerations

This is a pure function — easy to unit test. Key test cases:
- Level 1, time 3:00 → "The short hand is pointing near the 3"
- Level 2, time 7:30 → "The short hand is near 7. Is the long hand pointing up (:00) or down (:30)?"
- Level 3, time 4:20 → "The long hand is near the number 4. Each number means 5 minutes."
- Level 4, time 9:23 → "The long hand is past 5 (25 min). Count the extra ticks!"
- Level 6, time 12:00 → "The short hand is about 12 hours around. Count ticks from the top for minutes."
- Edge: Level 0 (clamped to 1), Level 7 (clamped to 6)
- Edge: minutes=59 → nearestFive=12, nearestFiveMinutes=0

### Existing Code References

- `src/logic/timeUtils.ts` — `formatTime()`, `randomTimeForLevel()` for pattern reference
- `src/logic/distractorEngine.ts` — similar pure-function engine pattern
- `src/types/game.ts` — `Question` and `Hint` type definitions (from C0)

