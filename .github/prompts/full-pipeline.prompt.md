---
description: "Full end-to-end pipeline for major features: spec → planning (with clarification loop) → design → parallel development → integration → QA → translation → commit. Use for non-trivial work that requires planning and multiple agents."
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

### Stage 1: Product Specification
1. Call the **Product Manager** with the user's request
2. The PM creates `.tasks/SPEC.md` with detailed feature spec, user behaviors, acceptance criteria, and edge cases
3. Read `.tasks/SPEC.md` to verify it covers the request comprehensively
4. If the spec has open questions that the user should answer, surface them to the user before proceeding

### Stage 2: Planning (with Clarification Loop)
1. Call the **Planner** with a reference to the PM's spec: "Read the spec at `.tasks/SPEC.md` and create an implementation plan"
2. The Planner creates `.tasks/PLAN.md`, `.tasks/PLAN_GRAPH.md`, and per-agent task files
3. **If the Planner reports missing details or has questions:**
   - Read the Planner's questions from `.tasks/PLAN.md` (Open Questions section)
   - Call the **Product Manager** with the Planner's questions: "The Planner needs clarification on the following: [questions]. Read the spec at `.tasks/SPEC.md`, update it with the answers, and respond with the clarifications."
   - Call the **Planner** again: "The PM has updated `.tasks/SPEC.md` with clarifications. Re-read the spec and update your plan."
   - **Repeat this loop** until the Planner produces a plan with no open questions
4. Read `.tasks/PLAN.md` to understand the phases and dependencies
5. Create `PROGRESS.md` and `PROGRESS_GRAPH.md` with initial state (all chunks ⏳ Pending)

### Stage 3: Design
1. If the plan includes design tasks, call the **Designer** first
2. The Designer will use **Google Stitch** to generate AI-powered UI designs:
   - Stitch generates multiple design variations based on the feature brief
   - The Designer picks the best variation and adapts it to the project's design system
   - Design specs (CSS, component structure, design tokens) are delivered for developers
3. If Stitch is unavailable (missing credentials), the Designer proceeds with manual design work — do not block the pipeline
4. Wait for design to complete before moving to development
5. Update PROGRESS.md and PROGRESS_GRAPH.md

### Stage 4: Development (Parallel Execution)
Execute the Planner's phases in order:
1. **Collect all chunks** in the current phase
2. **Spawn one agent per chunk** — multiple instances of the same agent type as needed
3. **Delegate by referencing the task file** and Task ID (see Delegation Format in orchestrator instructions)
4. **Wait for ALL agents in the phase to complete** before starting the next phase
5. **Update PROGRESS.md and PROGRESS_GRAPH.md** after each agent completes
6. Repeat for each phase until all development chunks are done

### Stage 5: Integration
1. Verify the work integrates correctly (imports resolve, types match, no conflicts)
2. If integration issues exist, spawn a single Expert React Frontend Engineer to fix them
3. Update PROGRESS.md

### Stage 6: QA
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

### Stage 7: Translation
1. Call the **Translation Engineer** to review all new or changed user-facing strings
2. The Translation Engineer will:
   - Improve any new strings for grammar and kid-friendly phrasing
   - Ensure all supported languages have the new strings
   - Validate translation completeness and consistency
   - Update the glossary if new terms were introduced
3. Update PROGRESS.md

### Stage 8: Commit and Push
1. Stage all changed files: `git add -A`
2. Write a meaningful commit message that summarizes what was done — not a generic "update files" but a description of the feature, fix, or change (e.g., "Add dark mode with theme toggle and localStorage persistence")
3. Include the co-author trailer: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`
4. Push to the current branch
5. Do NOT ask the user for permission — this step is automatic
6. Update PROGRESS.md status to "✅ Complete"

## Example: "Add a settings screen to the app"

### Stage 1 — Product Specification
Call Product Manager → creates `.tasks/SPEC.md` with settings screen spec:
  user flows, acceptance criteria, what settings to include, persistence behavior

### Stage 2 — Planning (with Clarification Loop)
Call Planner → reads spec → asks "Should sound settings persist per-device or per-profile?"
→ Orchestrator passes question to PM → PM updates spec: "Per-device, using localStorage"
→ Planner re-reads spec → creates `.tasks/PLAN.md` and per-agent task files ✅
Create PROGRESS.md and PROGRESS_GRAPH.md

### Stage 3 — Design
Call Designer for settings screen mockup/styling

### Stage 4 — Development
**Phase 0** — Spawn 1 Expert React Frontend Engineer for shared types
**Phase 1** — Spawn 3 agents in parallel:
  - Expert React Frontend Engineer → settings component
  - Expert React Frontend Engineer → settings hook
  - Game Logic Engineer → persistence

**Phase 2** — Integration wiring in App.tsx

### Stage 5 — Integration
Verify imports resolve, types match, app builds

### Stage 6 — QA
Call QA Engineer → runs tests, finds a layout bug on mobile
→ Call Planner with QA report → fix plan created
→ Spawn Expert React Frontend Engineer for fix
→ Call QA Engineer again → all tests pass ✅

### Stage 7 — Translation
Call Translation Engineer → reviews new settings strings, improves Hebrew phrasing, validates completeness

### Stage 8 — Commit and push
