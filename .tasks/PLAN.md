# Implementation Plan — Refactor i18n to per-language JSON files

## Summary

Refactor the TeachWatch translation system from a single `translations.ts` file (which contains inline TypeScript objects with function properties) to separate per-language JSON files with a runtime interpolation layer. The key challenge is that JSON cannot contain functions, so the 9 template-function keys (e.g., `levelLabel(3)`) must be stored as placeholder strings in JSON (`"Level {level}"`) and wrapped into real functions at runtime. The `TranslationStrings` interface and `useTranslation()` hook API remain unchanged so **zero components need modification**.

---

## Current State Inventory

### Template Function Keys (9 keys — stored as `string` in JSON, resolved to functions at runtime)

| Key | Params | EN Template |
|-----|--------|-------------|
| `startLevel` | `level: number, name: string` | `"Start level {level}: {name}"` |
| `levelGameSession` | `level: number` | `"Level {level} game session"` |
| `clockAriaLabel` | `hours: number, minutes: string` | `"Analog clock showing {hours}:{minutes}"` |
| `scoreOutOf10` | `score: number` | `"{score} out of 10"` |
| `completedIn` | `duration: string` | `"Completed in {duration}"` |
| `starsAriaLabel` | `stars: number, max: number` | `"{stars} out of {max} stars"` |
| `levelLabel` | `level: number` | `"Level {level}"` |
| `levelAriaLabel` | `level: number, name: string` | `"Level {level}: {name}"` |
| `scoreOf10` | `score: number` | `"{score}/10"` |

### Structured Keys (2 keys — pass through as-is from JSON)

| Key | Type | Notes |
|-----|------|-------|
| `hintLevelMessages` | `string[]` | Already uses `{placeholder}` syntax; `hintEngine.ts` does its own replacement |
| `levels` | `LevelTranslation[]` | Array of 6 objects with `name`, `description`, `learningGoal`, `tips: string[]` |

### Simple String Keys (~45 keys)

All remaining keys are plain `string` values — pass through directly from JSON.

### Consumer Components (16 files using `useTranslation()`)

`App.tsx`, `LevelSelect.tsx`, `LevelCard.tsx`, `LevelIntro.tsx`, `GameSession.tsx`, `QuestionView.tsx`, `ProgressBar.tsx`, `AnswerButtons.tsx`, `FeedbackOverlay.tsx`, `HintButton.tsx`, `Summary.tsx`, `StarRating.tsx`, `TrickyTimes.tsx`, `HighScores.tsx`, `Medal.tsx`, `Settings.tsx`, `LanguageToggle.tsx`, plus `useGameSession.ts` hook. **None will change.**

---

## Architecture

```
src/i18n/
  locales/
    en.json                  ← NEW: all English strings (flat strings, placeholder templates, arrays)
    he.json                  ← NEW: all Hebrew strings
  types.ts                   ← NEW: Language, TranslationStrings, RawTranslationStrings, LevelTranslation
  resolveTranslations.ts     ← NEW: interpolate() + resolveTranslations(raw) → TranslationStrings
  translations.ts            ← MODIFIED: imports JSON + resolver, exports resolved translations
  LanguageContext.tsx         ← MODIFIED: import types from types.ts instead of translations.ts
  useTranslation.ts          ← UNCHANGED
  index.ts                   ← MODIFIED: re-export from types.ts
```

### Key Design Decisions

1. **Placeholder syntax**: `{paramName}` — matches the pattern already used in `hintLevelMessages`.
2. **No external libraries**: Custom `interpolate()` function (~5 lines) does `{key}` → value replacement.
3. **Static JSON imports**: Use Vite's built-in `import en from './locales/en.json'` (synchronous, tree-shakeable). Dynamic `import()` for lazy loading can be added as a follow-up.
4. **Type safety preserved**: `TranslationStrings` interface is unchanged (functions and all). A new `RawTranslationStrings` type mirrors it but with all function keys typed as `string`. The `resolveTranslations()` function bridges the two with full compile-time safety.
5. **Adding a new language**: Add `xx.json` in `locales/`, add `'xx'` to the `Language` union, register in `translations.ts`.
6. **RTL mapping**: Stays in `LanguageContext.tsx` — per-language direction is context-level config, not in JSON.

---

## Phase 0: Shared Contracts

- **Chunk C0**: Create shared types file
  - Files: `src/i18n/types.ts` (create)
  - Dependencies: none
  - Agent: Expert React Frontend Engineer

  Contains:
  - `Language` — type union `'en' | 'he'`
  - `LevelTranslation` — interface (same as current: `name`, `description`, `learningGoal`, `tips: string[]`)
  - `TranslationStrings` — interface (identical to current — functions and all). This is the public API type.
  - `RawTranslationStrings` — new interface that mirrors `TranslationStrings` but every function key becomes `string`. The 9 template keys: `startLevel`, `levelGameSession`, `clockAriaLabel`, `scoreOutOf10`, `completedIn`, `starsAriaLabel`, `levelLabel`, `levelAriaLabel`, `scoreOf10`. All other keys match `TranslationStrings` types exactly.

---

## Phase 1 (parallel)

- **Chunk C1**: Create JSON locale files
  - Files: `src/i18n/locales/en.json` (create), `src/i18n/locales/he.json` (create)
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

  Extract all translations from the current `en` and `he` objects in `translations.ts` into pure JSON form. Template function keys become placeholder strings using `{paramName}` syntax. All values are strings, string arrays, or objects. Ensure key names exactly match `RawTranslationStrings`. Example structure:
  ```json
  {
    "appTitle": "TeachWatch",
    "startLevel": "Start level {level}: {name}",
    "levelLabel": "Level {level}",
    "hintLevelMessages": ["The short hand is pointing near the {hour}", "..."],
    "levels": [{ "name": "Hours Only", "description": "...", "learningGoal": "...", "tips": ["..."] }]
  }
  ```

- **Chunk C2**: Build the translation resolver
  - Files: `src/i18n/resolveTranslations.ts` (create)
  - Dependencies: C0
  - Agent: Expert React Frontend Engineer

  Exports:
  - `interpolate(template: string, params: Record<string, unknown>): string` — replaces `{key}` with `String(params[key])`. Only replaces keys that exist in `params` (leaves `{unknown}` untouched).
  - `resolveTranslations(raw: RawTranslationStrings): TranslationStrings` — takes the raw JSON shape and returns a fully-typed `TranslationStrings` object.

  The resolver explicitly constructs each template function with named params matching the `TranslationStrings` signatures:
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
  All simple string keys and structured keys (`levels`, `hintLevelMessages`) are spread from `raw` directly.

---

## Phase 2 (depends on C0, C1, C2)

- **Chunk C3**: Integration — rewire the i18n module
  - Files: `src/i18n/translations.ts` (modify), `src/i18n/LanguageContext.tsx` (modify), `src/i18n/index.ts` (modify)
  - Dependencies: C0, C1, C2
  - Agent: Expert React Frontend Engineer

  Changes:

  1. **`src/i18n/translations.ts`**:
     - Remove: the `Language` type, `LevelTranslation` interface, `TranslationStrings` interface, and the two large inline `en`/`he` objects.
     - Add: import JSON files (`import enRaw from './locales/en.json'`, `import heRaw from './locales/he.json'`), import `resolveTranslations` from `./resolveTranslations`, import types from `./types`.
     - Re-export all types from `./types` for backward compatibility (components importing `Language` from `./translations` still work).
     - Export `translations: Record<Language, TranslationStrings>` built by calling `resolveTranslations()` on each JSON import (with `as RawTranslationStrings` cast on the Vite JSON imports).

  2. **`src/i18n/LanguageContext.tsx`**:
     - Update the import line: change `from './translations'` to `from './types'` for `Language` and `TranslationStrings`. Keep importing `translations` from `'./translations'`.
     - Or: leave as-is if `translations.ts` re-exports everything from `./types`.

  3. **`src/i18n/index.ts`**:
     - Add `export * from './types'` to ensure all type exports are available.
     - Keep existing re-exports from `./translations`, `./LanguageContext`, `./useTranslation`.
     - Verify no duplicate export names conflict.

---

## Edge Cases

1. **Missing placeholder in JSON**: If a template string omits `{param}`, `interpolate()` returns the string with unreplaced text. No crash — just incorrect display. Same risk as the current system (typo in template literal).
2. **Extra/unknown `{placeholders}`**: `interpolate()` must only replace keys present in the `params` map. Guard: use a regex replacer that checks `key in params` before substituting.
3. **`hintLevelMessages` vs `interpolate()`**: The hint engine (`hintEngine.ts`) does its own `String.replace()`. The `hintLevelMessages` strings pass through as-is from JSON. No overlap or conflict.
4. **Vite JSON import typing**: Vite infers a generic type for `.json` imports. Use `as RawTranslationStrings` when passing to `resolveTranslations()`. Optional follow-up: add a ambient module declaration for stricter typing.
5. **`levels` fallback pattern**: Components like `LevelCard` and `HighScores` use `t.levels[config.level - 1] ?? fallback`. This continues to work unchanged since `levels` remains an array.
6. **`noUnusedLocals` in tsconfig**: All new exports/imports must be consumed. Verify no dead imports after integration.
7. **Unicode / RTL in JSON**: JSON supports UTF-8 natively. Hebrew strings render correctly. The `dir` attribute is set by `LanguageContext` based on language code, not from JSON.

---

## Validation Checklist

- [ ] `npx tsc --noEmit` passes (type safety check)
- [ ] `npm run dev` starts without errors
- [ ] Switch language EN ↔ HE in Settings — all strings update correctly
- [ ] Template functions work: level labels, aria labels, scores in LevelIntro, GameSession, HighScores, Summary
- [ ] Hint system works: hints show localized templates with clock values filled in
- [ ] `levels` data renders in LevelSelect, LevelIntro, GameSession, HighScores
- [ ] All 16+ consuming components display correct translations in both languages

---

## Open Questions

1. **Lazy loading**: Should language JSON files be dynamically imported (`import()`) to reduce initial bundle? Current approach uses static imports for simplicity. Dynamic loading adds an async initialization / loading state in `LanguageProvider`. Can be deferred to a follow-up task.
2. **JSON schema validation**: Should we add a build-time check that both JSON files have the same keys? Useful as more languages are added. Could be a simple unit test or a custom lint rule. Not required for this task.
3. **Vite JSON ambient types**: Consider a `src/i18n/locales/json.d.ts` to strongly type JSON imports. Optional — the `as RawTranslationStrings` cast is sufficient.

