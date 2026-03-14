---
name: translation-review
description: >
  Generates a side-by-side markdown comparison of translations for human review.
  Use to audit translation quality, spot awkward phrasing, or review new language additions.
---

# Translation Review Skill

Generates `TRANSLATION_REVIEW.md` at the project root with a side-by-side comparison of all strings between English (source) and a target language.

## Usage

```bash
node .github/skills/translation-review/scripts/review.mjs --lang he
node .github/skills/translation-review/scripts/review.mjs --lang ar
```

## Output

Creates `TRANSLATION_REVIEW.md` with:

```markdown
# Translation Review — Hebrew (he)

| Key | English (source) | Hebrew (target) | Notes |
|-----|-----------------|-----------------|-------|
| appTitle | TeachWatch | גאון שעון | — |
| correct | Correct! ✓ | !נכון ✓ | — |
| startLevel | Start level {level}: {name} | התחל שלב {level}: {name} | Dynamic — check placeholders |
```

## When to Use

- After the Translation Engineer improves translations — review before merging
- When adding a new language — verify all strings are natural and complete
- For periodic quality audits of existing translations
