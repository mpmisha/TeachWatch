---
name: test-plan
description: >
  Generates a comprehensive test plan markdown file covering all test flows for the TeachWatch app.
  Use this skill to create or update the master test plan that serves as a reference for all
  current and future testing scenarios.
---

# Test Plan Skill

Creates and maintains a structured test plan document (`TEST_PLAN.md`) at the project root. This file is the single source of truth for all test scenarios — manual, automated, and exploratory.

## When to Use

- At the start of a QA cycle to define all test flows
- After new features are added, to update the plan with new scenarios
- When reviewing test coverage to identify gaps

## Output

The skill produces `TEST_PLAN.md` at the project root with this structure:

```markdown
# TeachWatch — Test Plan

## Overview
[Brief summary of what's being tested and the testing strategy]

## Test Environment
- Browser targets (Chromium, Firefox, WebKit)
- Viewports: Desktop (1280×800), Mobile (375×667)
- Dev server URL: http://localhost:5173

## Test Flows

### 1. Level Selection
| ID | Scenario | Steps | Expected Result | Viewport | Priority |
|----|----------|-------|-----------------|----------|----------|
| LS-01 | Display all 6 levels | Open app | All 6 level cards visible with correct labels | Desktop + Mobile | P0 |
| LS-02 | Select a level | Click level 1 card | Navigate to game session with level 1 constraints | Desktop + Mobile | P0 |
| ... | ... | ... | ... | ... | ... |

### 2. Gameplay Loop
| ID | Scenario | Steps | Expected Result | Viewport | Priority |
|----|----------|-------|-----------------|----------|----------|
| GL-01 | Clock displays correct time | Start level 1 | Hour hand points to correct hour on clock face | Desktop + Mobile | P0 |
| ... | ... | ... | ... | ... | ... |

### 3. Clock Rendering
...

### 4. Answer Feedback
...

### 5. Distractor Validation
...

### 6. Progress Tracking
...

### 7. Summary View
...

### 8. High Scores & Persistence
...

### 9. Accessibility
...

### 10. Responsive / Mobile
...

## Coverage Matrix
| Area | Automated (E2E) | Manual | Not Covered |
|------|-----------------|--------|-------------|
| Level Selection | ✅ | — | — |
| ... | ... | ... | ... |

## Revision History
| Date | Author | Changes |
|------|--------|---------|
| YYYY-MM-DD | QA Engineer | Initial test plan |
```

## Rules for the Test Plan

- **Every scenario must specify Viewport** — Desktop, Mobile, or both
- **Use consistent IDs** — prefix by area (LS = Level Select, GL = Gameplay Loop, CR = Clock Rendering, AF = Answer Feedback, DV = Distractor Validation, PT = Progress Tracking, SV = Summary View, HS = High Scores, AC = Accessibility, RM = Responsive/Mobile)
- **Priority levels**: P0 = must pass for release, P1 = important, P2 = nice to have
- **Steps must be actionable** — a tester should be able to follow them without guessing
- **Expected results must be verifiable** — describe what the tester should observe
- **Reference the game design doc** — scenarios should trace back to `GameDocs/TeachWatchGame.md`
- **Include edge cases** — midnight, 12:30, level boundaries, all distractor trap types
- **Update the revision history** every time the plan changes
