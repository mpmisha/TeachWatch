---
name: screenshot
description: >
  Takes screenshots of the TeachWatch app running locally. Use this skill when you need to capture
  the current visual state of the app — for QA validation, bug documentation, design review, or
  progress reporting. Requires the dev server to be running on localhost.
---

# Screenshot Skill

Captures screenshots of the TeachWatch app running locally using Playwright. Screenshots are saved to the `screenshots/` directory at the project root.

## Prerequisites

- The dev server must be running: `npm run dev` (default: `http://localhost:5173`)
- Playwright browsers must be installed: `npx playwright install`

## Usage

Run the screenshot script from the project root:

```bash
node .github/skills/screenshot/scripts/take-screenshot.mjs [options]
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--url <url>` | Full URL to screenshot | `http://localhost:5173` |
| `--name <name>` | Output filename (without extension) | `screenshot` |
| `--width <px>` | Viewport width | `1280` |
| `--height <px>` | Viewport height | `800` |
| `--fullpage` | Capture the full scrollable page | `false` |
| `--mobile` | Use a mobile viewport (375×667) | `false` |
| `--delay <ms>` | Wait time before capturing (for animations) | `500` |

### Examples

```bash
# Screenshot the home screen
node .github/skills/screenshot/scripts/take-screenshot.mjs --name level-select

# Screenshot a specific route
node .github/skills/screenshot/scripts/take-screenshot.mjs --url http://localhost:5173 --name game-session --delay 1000

# Mobile viewport
node .github/skills/screenshot/scripts/take-screenshot.mjs --name mobile-home --mobile

# Full page capture
node .github/skills/screenshot/scripts/take-screenshot.mjs --name full-page --fullpage
```

### Output

Screenshots are saved to:
```
screenshots/<name>.png
```

The script prints the absolute path of the saved screenshot to stdout for easy reference.

## For Agents

When an agent needs to take a screenshot:

1. Ensure the dev server is running (`npm run dev`)
2. Run the script with appropriate options
3. The screenshot file path is printed to stdout
4. Reference the screenshot in reports or bug descriptions
