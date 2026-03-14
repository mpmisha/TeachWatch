---
name: glossary
description: >
  Centralized terminology glossary for TeachWatch translations. Defines how key game
  terms must be translated in each supported language. All translation work must reference
  this glossary to maintain consistency.
---

# TeachWatch Translation Glossary

This glossary defines the canonical translation for key game terms across all supported languages. The Translation Engineer **must** consult this file before any translation work and **must not** deviate from these terms without updating the glossary first.

## How to Use

1. Before translating, read this entire glossary
2. Use the exact terms listed for the target language
3. If a term is missing for your target language, add it here first
4. If you believe a term should change, update the glossary, then update all translation files to match

## Core Game Terms

| English | Hebrew (he) | Context |
|---------|-------------|---------|
| TeachWatch | גאון שעון | App name — localized, not transliterated |
| clock | שעון | The analog clock display |
| hour hand | מחוג השעות | The short hand on the clock |
| minute hand | מחוג הדקות | The long hand on the clock |
| hour | שעה | A unit of time |
| minute | דקה | A unit of time |
| half hour | חצי שעה | 30-minute mark |
| o'clock | בדיוק | On the hour (e.g., "3 o'clock") |
| level | שלב | A difficulty level in the game |
| question | שאלה | A single quiz question |
| correct | נכון | Correct answer feedback |
| incorrect | לא נכון | Wrong answer feedback |
| score | ניקוד | Points earned |
| star | כוכב | Star rating (1-3) |
| hint | רמז | In-game hint |
| try again | נסה שוב | Retry prompt |

## Level Names

| English | Hebrew (he) | Notes |
|---------|-------------|-------|
| Hours Only | שעות בלבד | Level 1 |
| The Half-Hour | חצי שעה | Level 2 |
| Five-Minute Jumps | קפיצות של חמש | Level 3 |
| The Minute Tracker | עוקב הדקות | Level 4 |
| Standard Clock | שעון רגיל | Level 5 |
| The Expert | המומחה | Level 6 |

## UI Terms

| English | Hebrew (he) | Context |
|---------|-------------|---------|
| Start | התחל | Begin a level |
| Next | הבא | Next question |
| Back | חזרה | Return to previous screen |
| Settings | הגדרות | Settings screen |
| High Scores | שיאים | High scores / trophy room |
| Trophy Room | חדר הגביעים | High scores display |
| Summary | סיכום | End-of-session summary |

## Encouragement Phrases (Tone Guide)

Encouragement should feel like a warm, enthusiastic teacher — not formal or robotic.

| English Tone | Hebrew Tone | Notes |
|-------------|-------------|-------|
| "Great job!" | "!כל הכבוד" | Enthusiastic, natural |
| "Keep going!" | "!המשך כך" | Encouraging |
| "Almost there!" | "!כמעט שם" | Supportive |
| "You got this!" | "!אתה יכול" | Confident |

## Adding a New Language

When adding a new language, create a new column in each table above:

```markdown
| English | Hebrew (he) | Arabic (ar) | Context |
|---------|-------------|-------------|---------|
| clock   | שעון        | ساعة        | The analog clock display |
```

Then populate every row. Do not leave any cell empty — every term must be defined before translation work begins.

## Direction Reference

| Language | Code | Direction |
|----------|------|-----------|
| English | en | LTR |
| Hebrew | he | RTL |

Add new languages to this table as they are supported.
