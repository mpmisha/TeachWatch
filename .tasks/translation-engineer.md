# Translation Engineer — Task

## Chunk C5: Remove old hint translations + clean up i18n types
- **Phase**: 1
- **Dependencies**: C0 (shared types — specifically, old `Hint` type is removed)
- **Files to create/modify**:
  - `src/i18n/locales/en.json` (modify)
  - `src/i18n/locales/he.json` (modify)
  - `src/i18n/types.ts` (modify)

### Description
Remove translation keys and TypeScript types that were part of the old text-based hint system. These are no longer needed because hints are now visual (on-clock highlighting).

---

### en.json Changes

**Remove these keys:**

```json
"hintClose": "Got it!",
"hintLevelMessages": [
  "The hour hand is pointing near the {hour}",
  "The hour hand is near {hour}. Is the minute hand pointing up (:00) or down (:30)?",
  "The minute hand is near the number {nearestFive}. Each number means 5 minutes.",
  "The minute hand is past {nearestFive} ({nearestFiveMinutes} min). Count the extra ticks!",
  "Remember: {hour} on the hour hand. The minute hand is near where {nearestFive} would be.",
  "The hour hand is near {hour}. Count ticks from the top for the minutes."
],
```

**Update `hintButton`** — remove embedded emoji:
```json
"hintButton": "Hint"
```
(was: `"hintButton": "Hint 💡"`)

**Keep unchanged:**
- `"hintsEnabled": "Show Hints"` — still used in Settings toggle.

---

### he.json Changes

**Remove these keys:**

```json
"hintClose": "!הבנתי",
"hintLevelMessages": [
  "מחוג השעות מצביע ליד ה-{hour}",
  "מחוג השעות ליד {hour}. האם מחוג הדקות מצביע למעלה (:00) או למטה (:30)?",
  "מחוג הדקות ליד המספר {nearestFive}. כל מספר שווה 5 דקות.",
  "מחוג הדקות עבר את {nearestFive} ({nearestFiveMinutes} דק׳). ספרו את השנתות הנוספות!",
  "זכרו: {hour} במחוג השעות. מחוג הדקות ליד המקום של {nearestFive}.",
  "מחוג השעות ליד {hour}. ספרו שנתות מלמעלה עבור הדקות."
],
```

**Update `hintButton`** — remove embedded emoji:
```json
"hintButton": "רמז"
```
(was: `"hintButton": "💡 רמז"`)

**Keep unchanged:**
- `"hintsEnabled": "הצגת רמזים"` — still used in Settings toggle.

---

### types.ts Changes

In `TranslationStrings` interface, **remove:**
```ts
hintClose: string;
hintLevelMessages: string[];
```

In `RawTranslationStrings` interface, **remove:**
```ts
hintClose: string;
hintLevelMessages: string[];
```

**Keep:**
```ts
hintButton: string;
hintsEnabled: string;
```

---

### Verification

After changes:
1. Check that `resolveTranslations.ts` does NOT reference `hintClose` or `hintLevelMessages`. Currently it doesn't (these were simple pass-through keys in the `...rest` spread) — but verify the spread doesn't break now that these keys are missing from the raw object.
2. The `...rest` spread in `resolveTranslations.ts` destructures specific function-keys and spreads the rest. Since `hintClose` and `hintLevelMessages` were part of `...rest`, removing them from JSON means they simply won't be in the resulting object. The TypeScript types (updated above) will no longer expect them, so this is type-safe.
3. Run `npx tsc --noEmit` to verify no type errors.

### Edge Cases
- Ensure no trailing commas are left in JSON after removing keys (some formatters auto-fix this, but double-check).
- Ensure both JSON files are valid JSON after edits.
- The `hintEngine.ts` (C1) no longer depends on translations at all, so no cross-dependency to worry about.
