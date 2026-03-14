---
description: "Quick fix workflow for minor bug fixes, small tweaks, and simple changes that don't need the full pipeline."
agent: Orchestrator
---

# Quick Fix Workflow

For small changes that don't need planning, design, or parallel execution.

## When to Use

- Minor bug fixes, small tweaks, typo corrections
- Single-file changes or simple adjustments
- Tasks that don't need planning or design

## Steps

1. Identify the right agent for the task (usually Expert React Frontend Engineer or Game Logic Engineer)
2. Delegate the fix directly — no Planner needed, no task files
3. If the fix involves user-facing strings, call the **Translation Engineer** afterward
4. Commit and push with a meaningful commit message
5. Include the co-author trailer: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`
