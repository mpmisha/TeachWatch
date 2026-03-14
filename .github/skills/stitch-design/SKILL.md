---
name: stitch-design
description: >
  Guides the Designer agent through generating, iterating, and exporting UI designs
  using the Google Stitch MCP API. Covers available tools, prompt engineering for
  kid-friendly educational apps, and a step-by-step workflow for each design task.
---

# Stitch Design Skill

Use this skill whenever you need to generate, refine, or export UI designs with Google Stitch. This is your primary reference for how to interact with the Stitch MCP tools.

## Available Stitch Tools

### Core Tools (always available)

| Tool | What it does | When to use |
|------|-------------|-------------|
| `list_projects` | Lists all your Stitch projects | First call — find or verify the TeachWatch project |
| `get_project` | Gets project details by resource name | Inspect project metadata |
| `list_screens` | Lists all screens in a project | Browse existing designs, get screen IDs |
| `get_screen` | Gets screen details + download URLs | Inspect a specific screen's metadata |
| `generate_screen_from_text` | Generates a new screen from a text prompt | **Primary tool** — create new designs |
| `edit_screens` | Edits existing screens using a text prompt | Refine/modify an existing design |
| `generate_variants` | Generates design variants of a screen | Create alternatives to compare |

### Extended Tools (proxy mode)

| Tool | What it does | When to use |
|------|-------------|-------------|
| `get_screen_code` | Downloads a screen's HTML code | Extract design as implementable HTML/CSS |
| `get_screen_image` | Downloads a screen's screenshot as base64 PNG | Visual review, save as reference image |
| `build_site` | Maps screens to routes, exports full site HTML | Export entire project as navigable pages |
| `list_tools` | Lists all available tools and schemas | Discover capabilities if unsure |

## Workflow: Designing a New Screen

Follow this sequence for every design task:

### 1. Set Up Project Context

```
→ list_projects
  Find or note the TeachWatch project ID

→ list_screens (projectId)
  See existing screens for consistency reference
```

If no TeachWatch project exists yet, generate your first screen — Stitch creates the project automatically.

### 2. Craft the Prompt

Every prompt to `generate_screen_from_text` MUST include these **TeachWatch constraints**:

```
REQUIRED in every prompt:
- "This is a children's educational clock-reading game for ages 6-10"
- "Use large, accessible touch targets (minimum 44×44px tap areas)"
- "Playful and encouraging visual style with bright, warm colors"
- "Must support both LTR (English) and RTL (Hebrew) layouts"
- "Mobile-first responsive design that also works on desktop"
- "Use rounded corners, soft shadows, and child-friendly typography"
- "Include generous whitespace — avoid cluttered layouts"
```

### 3. Generate Multiple Variations

Always generate at least 2 designs to compare:

```
→ generate_screen_from_text (prompt for variation A)
→ generate_variants (screenId from variation A)
  OR
→ generate_screen_from_text (slightly different prompt for variation B)
```

### 4. Review and Refine

```
→ get_screen_image (screenId)    — visually inspect
→ get_screen_code (screenId)     — check HTML/CSS quality
→ edit_screens (screenId, refinement prompt)  — if adjustments needed
```

### 5. Export for Development

```
→ get_screen_code (screenId)     — extract final HTML/CSS
  Adapt the output to React components and CSS modules
```

## Prompt Engineering Guide

### Structure of a Good Prompt

```
[WHAT] — Describe the screen/component purpose
[CONTENT] — Specify exact text, labels, and data to show
[LAYOUT] — Describe arrangement, grid, spacing
[STYLE] — Colors, typography, visual mood
[INTERACTIONS] — Buttons, hover states, animations
[CONSTRAINTS] — TeachWatch requirements (see above)
```

### Template Prompts for TeachWatch

#### Level Selection Screen
```
Design a level selection screen for a children's clock-reading game.
Show 6 levels as large, colorful cards arranged in a 2×3 grid.
Each card displays: a fun clock icon, the level name (e.g., "Full Hours"),
a star rating (0-3 filled stars), and a progress indicator.
Locked levels appear grayed out with a friendly lock icon.
Use bright pastel colors — each level has its own color theme.
Include a playful header with the game title "TeachWatch" and a home button.
The layout must be responsive and work in both LTR and RTL directions.
Use rounded corners (16px), soft drop shadows, and a child-friendly sans-serif font.
Touch targets must be at least 44×44px.
```

#### Game Play Screen
```
Design the main gameplay screen for a children's clock-reading game.
Center: a large analog clock (SVG, 280px diameter) showing a specific time.
Below the clock: a question in large friendly text ("What time does the clock show?").
Below the question: 4 answer buttons arranged in a 2×2 grid, each showing a time.
The correct answer button should look the same as wrong answers (no hint).
Include a progress bar at the top showing "Question 3 of 10".
Add a friendly character or mascot in the corner giving encouragement.
Use a soft gradient background (light blue to white).
All text must be large enough for children to read easily (minimum 18px).
Make it work in both LTR and RTL layouts.
```

#### Results / Summary Screen
```
Design a celebration/results screen for a children's clock-reading game.
Show a large, animated star rating (1-3 stars) at the top with confetti.
Display the score prominently: "You got 8 out of 10!" in large playful text.
Show a simple bar chart of correct vs incorrect answers.
Include two large buttons: "Play Again" (primary, green) and "Back to Levels" (secondary).
Add encouraging text that adapts to score (e.g., "Amazing job!" for high scores).
Use a celebratory color scheme with golds, greens, and warm tones.
Must work in both LTR and RTL layouts with responsive sizing.
```

#### Settings / Parents Screen
```
Design a settings screen for a children's clock-reading game.
This screen is primarily for parents, so use a slightly more mature design.
Include: language toggle (Hebrew/English), sound on/off, reset progress button.
Show current progress summary: levels completed, total stars earned.
Include a "How to Play" section with brief instructions.
Add a "Back" button to return to the game.
Use a clean, organized layout with clear section dividers.
The reset progress button should have a confirmation step (safety).
Support RTL and LTR layouts.
```

## Important Rules

### IDs, Not Names
Stitch tools require **screen IDs** (e.g., `98b50e2ddc9943ef...`), not display names. Always use `list_screens` to get IDs before calling screen-level tools.

### Project ID Required
Every screen tool requires a `projectId`. Get it once from `list_projects` and reuse it.

### Iterate, Don't Settle
If the first generation isn't right:
1. Use `edit_screens` for small tweaks (color changes, spacing adjustments)
2. Use `generate_variants` to explore alternatives of a good starting point
3. Use a new `generate_screen_from_text` with a refined prompt for major changes

### Adapt, Don't Copy-Paste
Stitch outputs raw HTML/CSS. You must:
- Convert to React component structure
- Extract colors/spacing into CSS variables or the project's design token system
- Ensure it matches existing component patterns in `src/`
- Remove any inline styles in favor of CSS modules

### When Stitch is Down
If any Stitch tool returns an error or times out:
1. Note "Stitch unavailable" in your design output
2. Fall back to manual design work — describe layouts in markdown and write CSS directly
3. Do NOT block the pipeline or retry indefinitely
