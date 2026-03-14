---
name: translation-validation
description: >
  Validates translation files for completeness, placeholder consistency, and type safety.
  Run after any translation change to catch missing keys, broken dynamic strings, or
  empty values.
---

# Translation Validation Skill

Validates that all language translations in `src/i18n/translations.ts` are complete and consistent.

## Usage

```bash
node .github/skills/translation-validation/scripts/validate.mjs
```

## What It Checks

1. **Missing keys** — every key in the English source must exist in every other language
2. **Extra keys** — keys that exist in a target language but not in English (likely typos)
3. **Empty strings** — translated values that are empty or whitespace-only
4. **Type mismatches** — if English has a function, the target must also be a function (and vice versa)
5. **Placeholder consistency** — `{variable}` patterns in template strings must match between source and target
6. **Array length** — arrays (like `hintLevelMessages`) must have the same length across languages

## Output

- ✅ All checks passed — no issues found
- ❌ Lists each issue with the key, language, and what's wrong

## When to Run

- After improving existing translations
- After adding a new language
- Before committing translation changes
