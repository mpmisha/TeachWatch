---
description: "Full end-to-end pipeline for major features: planning → design → parallel development → integration → QA → translation → commit. Use for non-trivial work that requires planning and multiple agents."
agent: Orchestrator
---

# Full Pipeline Workflow

This is the end-to-end workflow for significant features and changes. Every stage must complete before moving to the next.

## When to Use

- The request involves planning, design, and non-trivial development
- New features, new screens, or significant changes to existing features
- Work that requires multiple agents or parallel execution
- Changes that touch multiple files across different domains (UI, logic, styling)

## Stages

### Stage 1: Planning
1. Call the **Planner** with the user's request
2. The Planner creates `.tasks/PLAN.md`, `.tasks/PLAN_GRAPH.md`, and per-agent task files
3. Read `.tasks/PLAN.md` to understand the phases and dependencies
4. Create `PROGRESS.md` and `PROGRESS_GRAPH.md` with initial state (all chunks ⏳ Pending)

### Stage 2: Design
1. If the plan includes design tasks, call the **Designer** first
2. Wait for design to complete before moving to development
3. Update PROGRESS.md and PROGRESS_GRAPH.md

### Stage 3: Development (Parallel Execution)
Execute the Planner's phases in order:
1. **Collect all chunks** in the current phase
2. **Spawn one agent per chunk** — multiple instances of the same agent type as needed
3. **Delegate by referencing the task file** and Task ID (see Delegation Format in orchestrator instructions)
4. **Wait for ALL agents in the phase to complete** before starting the next phase
5. **Update PROGRESS.md and PROGRESS_GRAPH.md** after each agent completes
6. Repeat for each phase until all development chunks are done

### Stage 4: Integration
1. Verify the work integrates correctly (imports resolve, types match, no conflicts)
2. If integration issues exist, spawn a single Expert React Frontend Engineer to fix them
3. Update PROGRESS.md

### Stage 5: QA
1. Call the **QA Engineer** to test the implemented work
2. The QA Engineer will:
   - Run existing tests to check for regressions
   - Write new E2E tests for the implemented feature
   - Test on both desktop and mobile viewports
   - Take screenshots for documentation
3. **If the QA Engineer reports issues:**
   - Document the issues in PROGRESS.md under "Issues / Blockers"
   - Call the **Planner** with the QA report to create a fix plan
   - The Planner creates updated task files for the fixes
   - Execute the fix plan (spawn agents as needed)
   - Call the **QA Engineer** again to verify the fixes
   - Repeat this loop until QA passes with no issues
4. Update PROGRESS.md and PROGRESS_GRAPH.md

### Stage 6: Translation
1. Call the **Translation Engineer** to review all new or changed user-facing strings
2. The Translation Engineer will:
   - Improve any new strings for grammar and kid-friendly phrasing
   - Ensure all supported languages have the new strings
   - Validate translation completeness and consistency
   - Update the glossary if new terms were introduced
3. Update PROGRESS.md

### Stage 7: Commit and Push
1. Stage all changed files: `git add -A`
2. Write a meaningful commit message that summarizes what was done — not a generic "update files" but a description of the feature, fix, or change (e.g., "Add dark mode with theme toggle and localStorage persistence")
3. Include the co-author trailer: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`
4. Push to the current branch
5. Do NOT ask the user for permission — this step is automatic
6. Update PROGRESS.md status to "✅ Complete"

## Example: "Add a settings screen to the app"

### Stage 1 — Planning
Call Planner → creates `.tasks/PLAN.md` and per-agent task files
Create PROGRESS.md and PROGRESS_GRAPH.md

### Stage 2 — Design
Call Designer for settings screen mockup/styling

### Stage 3 — Development
**Phase 0** — Spawn 1 Expert React Frontend Engineer for shared types
**Phase 1** — Spawn 3 agents in parallel:
  - Expert React Frontend Engineer → settings component
  - Expert React Frontend Engineer → settings hook
  - Game Logic Engineer → persistence

**Phase 2** — Integration wiring in App.tsx

### Stage 4 — Integration
Verify imports resolve, types match, app builds

### Stage 5 — QA
Call QA Engineer → runs tests, finds a layout bug on mobile
→ Call Planner with QA report → fix plan created
→ Spawn Expert React Frontend Engineer for fix
→ Call QA Engineer again → all tests pass ✅

### Stage 6 — Translation
Call Translation Engineer → reviews new settings strings, improves Hebrew phrasing, validates completeness

### Stage 7 — Commit and push
