# QA Engineer — Task

## Chunk C6: Manual QA validation of the Hint feature
- **Phase**: 3
- **Dependencies**: C4, C5 (all implementation chunks must be complete)
- **Files**: none (validation only)
- **Description**: Validate the complete Hint feature across all dimensions — functionality, persistence, i18n, responsiveness, and accessibility.

### Test Checklist

#### Functional Tests
1. [ ] **Hint button visibility (enabled)**: Start a game session at each level (1-6). Verify the Hint button appears on every question.
2. [ ] **Hint button visibility (disabled)**: Toggle hints OFF in Settings. Start a game session. Verify the Hint button does NOT appear on any question.
3. [ ] **Hint popup content**: Click the Hint button on Level 1 with a visible hour (e.g., 3:00). Verify the popup says something like "The short hand is pointing near the 3".
4. [ ] **Level-specific hints**: Spot-check at least one question per level (1-6) to verify the template changes appropriately (e.g., Level 2 mentions ":00 or :30", Level 3 mentions "5 minutes").
5. [ ] **Hint dismiss — button**: Click "Got it!" in the popup. Verify it closes.
6. [ ] **Hint dismiss — backdrop**: Click the dark backdrop behind the popup. Verify it closes.
7. [ ] **Hint resets on question advance**: Open hint on Q1, answer correctly. On Q2, verify the popup is NOT still showing.
8. [ ] **Hint during feedback**: Answer a question. While the correct/incorrect animation plays, verify the Hint button is disabled (not clickable).
9. [ ] **Multiple hint views**: Open and close the hint multiple times on the same question. Should work every time.

#### Persistence Tests
10. [ ] **Settings toggle persists**: Toggle hints OFF in Settings. Reload the page. Go to Settings — toggle should still be OFF.
11. [ ] **Default state**: Clear localStorage (`localStorage.removeItem('teachwatch-hints-enabled')`). Reload. Hints should default to ON.
12. [ ] **Mid-game toggle**: Start a game with hints ON. Quit. Toggle hints OFF in Settings. Start a new game. Hint button should be gone.

#### i18n / RTL Tests
13. [ ] **English hints**: Switch to English. Verify hint text is in English.
14. [ ] **Hebrew hints**: Switch to Hebrew. Verify hint text is in Hebrew.
15. [ ] **RTL layout**: In Hebrew mode, verify:
    - Hint button aligns correctly in the question view
    - Popup text is right-aligned
    - Close button is properly positioned
16. [ ] **Translation completeness**: Verify `hintButton`, `hintClose`, `hintsEnabled`, and all 6 `hintLevelMessages` entries exist in both `en` and `he`.

#### Responsive Tests
17. [ ] **Mobile (375px width)**: Verify hint popup fits within viewport, no horizontal overflow. Popup should be ~90vw.
18. [ ] **Desktop (1280px width)**: Verify popup is centered with max-width ~400px. Not stretched full width.
19. [ ] **Tablet (768px)**: Spot-check that layout looks reasonable.

#### Accessibility Tests
20. [ ] **Dialog role**: Inspect the popup — it should have `role="dialog"` and `aria-modal="true"`.
21. [ ] **Focus management**: When popup opens, focus should move to the close button. When popup closes, focus should return to the hint button.
22. [ ] **Keyboard dismiss**: With popup open, press Escape. Popup should close.
23. [ ] **Settings toggle a11y**: The hints toggle button should have `aria-pressed="true"` or `"false"`.
24. [ ] **Screen reader**: Hint button should announce its label. Popup content should be readable.

#### Regression Tests
25. [ ] **Game flow unchanged**: Play a complete 10-question session with hints enabled — answer all questions. Verify score, summary, and star rating work correctly.
26. [ ] **Game flow without hints**: Play a complete session with hints disabled. Same verification.
27. [ ] **Settings page**: Verify the language toggle and reset scores still work after adding the hints card.
28. [ ] **No layout shifts**: Verify the hint button doesn't cause layout jumps when it appears/disappears.

### Test Environments
- Chrome (latest) on desktop
- Chrome DevTools mobile emulation (iPhone SE / 375px)
- If available: Safari on iOS, Chrome on Android

### Edge Case Scenarios
- Level 1, time 12:00 → hint mentions "12"
- Level 4, time 6:58 → hint computes nearestFiveMinutes correctly (60 → clamped to 0)
- Level 6, time 1:01 → hint gives spatial-only guidance
- Very long Hebrew hint text → popup handles text overflow with word-break
