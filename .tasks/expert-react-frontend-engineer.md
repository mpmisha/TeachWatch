# Expert React Frontend Engineer — Tasks

## Task T1 — Chunk C0: Create shared i18n types file
- **Phase**: 0
- **Dependencies**: none
- **Files to create/modify**:
  - `src/i18n/types.ts` (create)
- **Description**: Create a new TypeScript file containing all type definitions needed by the refactored i18n system. This file has zero imports — all types are self-contained.
- **What to define**:
  1. `Language` — type alias: `'en' | 'he'`
  2. `LevelTranslation` — interface with `name: string`, `description: string`, `learningGoal: string`, `tips: string[]`
  3. `TranslationStrings` — interface identical to the current one in `translations.ts`. This is the **public API type** that all components see. It includes both simple string keys AND function keys. Copy it exactly from the current `translations.ts`. Functions:
     - `startLevel: (level: number, name: string) => string`
     - `levelGameSession: (level: number) => string`
     - `clockAriaLabel: (hours: number, minutes: string) => string`
     - `scoreOutOf10: (score: number) => string`
     - `completedIn: (duration: string) => string`
     - `starsAriaLabel: (stars: number, max: number) => string`
     - `levelLabel: (level: number) => string`
     - `levelAriaLabel: (level: number, name: string) => string`
     - `scoreOf10: (score: number) => string`
  4. `RawTranslationStrings` — new interface that mirrors `TranslationStrings` exactly, **except** every function key above becomes `string`. All other keys (simple strings, `hintLevelMessages: string[]`, `levels: LevelTranslation[]`) are identical.
- **Edge cases**:
  - Ensure `RawTranslationStrings` and `TranslationStrings` have exactly the same key names. If a key is added to one, it must be added to the other.
  - Export everything — all types are used by other i18n files.

---

## Task T2 — Chunk C1: Create JSON locale files
- **Phase**: 1
- **Dependencies**: C0 (shared types)
- **Files to create/modify**:
  - `src/i18n/locales/en.json` (create)
  - `src/i18n/locales/he.json` (create)
- **Description**: Extract all translations from the `en` and `he` objects in the current `src/i18n/translations.ts` into separate JSON files. The JSON files must conform to the `RawTranslationStrings` shape defined in C0.
- **Key transformations**:
  - **Simple string keys**: Copy value directly. Example: `"appTitle": "TeachWatch"`
  - **Template function keys** (9 keys): Convert the function body's template literal into a placeholder string. Examples:
    - `startLevel: (level, name) => \`Start level ${level}: ${name}\`` → `"startLevel": "Start level {level}: {name}"`
    - `levelGameSession: (level) => \`Level ${level} game session\`` → `"levelGameSession": "Level {level} game session"`
    - `clockAriaLabel: (hours, minutes) => \`Analog clock showing ${hours}:${minutes}\`` → `"clockAriaLabel": "Analog clock showing {hours}:{minutes}"`
    - `scoreOutOf10: (score) => \`${score} out of 10\`` → `"scoreOutOf10": "{score} out of 10"`
    - `completedIn: (duration) => \`Completed in ${duration}\`` → `"completedIn": "Completed in {duration}"`
    - `starsAriaLabel: (stars, max) => \`${stars} out of ${max} stars\`` → `"starsAriaLabel": "{stars} out of {max} stars"`
    - `levelLabel: (level) => \`Level ${level}\`` → `"levelLabel": "Level {level}"`
    - `levelAriaLabel: (level, name) => \`Level ${level}: ${name}\`` → `"levelAriaLabel": "Level {level}: {name}"`
    - `scoreOf10: (score) => \`${score}/10\`` → `"scoreOf10": "{score}/10"`
  - **`hintLevelMessages`**: Copy the string array as-is (already has `{placeholder}` syntax).
  - **`levels`**: Copy the array of objects as-is (name, description, learningGoal, tips).
  - **Hebrew file**: Same structure, same transformations, with Hebrew text.
- **Critical details**:
  - The `correct` key in EN has a Unicode check mark: `"Correct! ✓"` — use the actual character, not the `\u2713` escape (JSON supports UTF-8).
  - Same for HE `correct`: `"!נכון ✓"`
  - Preserve exact whitespace and punctuation.
  - The `levelIntroGoalLabel` key contains an emoji: `"🎯 What you'll learn:"` — include emoji directly.
  - Key order should match the `TranslationStrings` interface for readability.
- **Reference**: Read the full `en` and `he` objects in `src/i18n/translations.ts` (lines 85–400) for exact values.
- **Edge cases**:
  - Both JSON files must have identical keys (different values). Missing keys will cause runtime errors.
  - JSON has no trailing commas — ensure valid JSON syntax.

---

## Task T3 — Chunk C2: Build the translation resolver
- **Phase**: 1
- **Dependencies**: C0 (shared types)
- **Files to create/modify**:
  - `src/i18n/resolveTranslations.ts` (create)
- **Description**: Create a module that converts raw JSON translations (typed as `RawTranslationStrings`) into the full `TranslationStrings` object with real functions for template keys.
- **Interfaces to import**: `RawTranslationStrings`, `TranslationStrings` from `./types`
- **What to implement**:
  1. **`interpolate(template: string, params: Record<string, unknown>): string`**
     - Replace every `{key}` in the template with `String(params[key])`.
     - Only replace if `key` exists in `params` — leave `{unknown}` untouched.
     - Use a single `String.replace()` with regex: `/\{(\w+)\}/g`
     - Example: `interpolate("Level {level}", { level: 3 })` → `"Level 3"`
  2. **`resolveTranslations(raw: RawTranslationStrings): TranslationStrings`**
     - Spread all simple string keys from `raw` into the result object.
     - Spread `levels` and `hintLevelMessages` from `raw` (pass-through).
     - Override the 9 template function keys with wrapper functions:
       ```ts
       startLevel: (level, name) => interpolate(raw.startLevel, { level, name }),
       levelGameSession: (level) => interpolate(raw.levelGameSession, { level }),
       clockAriaLabel: (hours, minutes) => interpolate(raw.clockAriaLabel, { hours, minutes }),
       scoreOutOf10: (score) => interpolate(raw.scoreOutOf10, { score }),
       completedIn: (duration) => interpolate(raw.completedIn, { duration }),
       starsAriaLabel: (stars, max) => interpolate(raw.starsAriaLabel, { stars, max }),
       levelLabel: (level) => interpolate(raw.levelLabel, { level }),
       levelAriaLabel: (level, name) => interpolate(raw.levelAriaLabel, { level, name }),
       scoreOf10: (score) => interpolate(raw.scoreOf10, { score }),
       ```
     - The return type must be `TranslationStrings`.
- **Implementation note on spreading**: Since `RawTranslationStrings` has `startLevel: string` but `TranslationStrings` has `startLevel: (...) => string`, you can't naively spread. Recommended approach:
  - Destructure (or omit) the 9 template keys from `raw`.
  - Spread the rest.
  - Add the 9 function overrides.
  - TypeScript's structural typing will validate the result matches `TranslationStrings`.
  - Alternatively, build the object explicitly without spreading to avoid type casting.
- **Edge cases**:
  - `interpolate` must not crash if `params` is empty or if the template has no placeholders.
  - `interpolate` should use `String(value)` to coerce numbers to strings safely.
  - Export both `interpolate` and `resolveTranslations` (interpolate is useful for testing).

---

## Task T4 — Chunk C3: Integration — rewire the i18n module
- **Phase**: 2
- **Dependencies**: C0, C1, C2
- **Files to create/modify**:
  - `src/i18n/translations.ts` (modify)
  - `src/i18n/LanguageContext.tsx` (modify)
  - `src/i18n/index.ts` (modify)
- **Description**: Connect all the pieces: make `translations.ts` load JSON files through the resolver, update imports, ensure backward-compatible exports.

### `src/i18n/translations.ts` changes:
- **Remove**: The `Language` type, `LevelTranslation` interface, `TranslationStrings` interface, and the two large `en`/`he` inline objects (the entire file content).
- **Replace with**:
  ```ts
  import enRaw from './locales/en.json';
  import heRaw from './locales/he.json';
  import { resolveTranslations } from './resolveTranslations';
  import type { Language, RawTranslationStrings, TranslationStrings } from './types';

  // Re-export types for backward compatibility
  export type { Language, TranslationStrings, LevelTranslation } from './types';
  export type { RawTranslationStrings } from './types';

  export const translations: Record<Language, TranslationStrings> = {
    en: resolveTranslations(enRaw as RawTranslationStrings),
    he: resolveTranslations(heRaw as RawTranslationStrings),
  };
  ```
- The `as RawTranslationStrings` cast is needed because Vite infers a generic type for JSON imports.

### `src/i18n/LanguageContext.tsx` changes:
- Current import: `import { translations, type Language, type TranslationStrings } from './translations';`
- Since `translations.ts` re-exports `Language` and `TranslationStrings`, this import **may not need to change**. Verify it compiles. If there are issues, update to import types from `'./types'` directly.

### `src/i18n/index.ts` changes:
- Current content:
  ```ts
  export * from './translations';
  export * from './LanguageContext';
  export * from './useTranslation';
  ```
- Add: `export * from './types';`
- Note: If `translations.ts` re-exports everything from `./types`, the `export * from './types'` in `index.ts` may cause duplicate exports. Check for conflicts. If `translations.ts` uses `export type { X } from './types'`, then `index.ts` re-exporting from both should work since type-only exports don't conflict with value exports. If there IS a conflict, remove the re-exports from `translations.ts` and only export from `index.ts`.

### Validation after integration:
- Run `npx tsc --noEmit` — must pass with zero errors
- Run `npm run dev` — app must start
- Manually verify: EN and HE strings display correctly, template functions produce correct output, hints work, levels array renders correctly
- **No components should be modified.** If any component fails, the integration is wrong.

### Edge cases:
- `noUnusedLocals` is enabled in tsconfig — ensure no unused imports
- `RawTranslationStrings` export is optional from `translations.ts` (only needed if external code wants the raw type) — but including it ensures it's accessible
- If Vite's JSON import produces a default export with nested `default` key, verify the import syntax is `import enRaw from './locales/en.json'` (default import) not `import { default as enRaw }`

