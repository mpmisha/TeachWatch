# TeachWatch — Complete Product Spec for Visual Design

## 1. Product Overview

**TeachWatch** (Hebrew: "גאון שעון") is a children's educational web game that teaches kids how to read analog clocks. The game uses progressive difficulty, playful feedback, and scaffolded visual aids to help children build an internal mental model of how clock hands map to time.

### Target Audience

- **Primary**: Children aged 6–10 who are learning to read analog clocks
- **Secondary**: Parents and teachers who want a fun, self-guided practice tool

### Product Goal

Turn clock-reading from an abstract school concept into a fun, self-paced game where a child can go from "I don't understand the hands" to "I can read a blank clock" — across 6 progressive levels, in 10-question sessions.

### Platforms & Languages

- **Platform**: Web app (responsive — desktop, tablet, phone). Touch-first design.
- **Languages**: Hebrew (RTL, primary/default) and English (LTR)
- **App name**: "TeachWatch" (English) / "גאון שעון" (Hebrew)

### Design Principles

| Principle | What It Means |
|---|---|
| **Encourage, never punish** | Celebrate effort. Wrong answers are learning moments, not failures. |
| **No scrolling** | Every screen fits above the fold. Clock + buttons always visible together. |
| **Touch-first** | All tap targets ≥ 60px. Generous spacing between interactive elements. |
| **Mobile-first** | Design for phone first, then scale up to tablet/desktop. |
| **Kid-readable** | Big fonts, simple words, high contrast. A 7-year-old should understand every screen without adult help. |
| **RTL-ready** | Every layout must work in both LTR (English) and RTL (Hebrew). Use logical properties (start/end), never left/right. |

---

## 2. Design Tokens (Current System)

These are the current design tokens. The designer may propose new ones, but this documents the existing system.

| Token | Value | Usage |
|---|---|---|
| **Font** | `'Baloo 2', 'Comic Sans MS', cursive, sans-serif` | Display font for all text |
| **Primary** | `#4361ee` | Buttons, active states, focus rings |
| **Success** | `#00b894` | Correct answers, badges, level intro |
| **Error** | `#d63031` | Wrong answers, error states |
| **Background** | `#f8f9fa` | Page background |
| **Surface** | `#ffffff` | Cards, panels |
| **Text** | `#2d3436` | Body text |
| **Text Secondary** | `#636e72` | Labels, captions |
| **Gold** | `#fdcb6e` | Stars, medals, accents |
| **Hint Amber** | `#f9a825` | Hint system glow color |
| **Touch Min** | `60px` | Minimum size for any tap target |
| **Border Radius** | `4px / 8px / 16px / 9999px` | sm / normal / lg / full |
| **Shadows** | `0 1px 2px` / `0 2px 8px` / `0 4px 16px` | sm / normal / lg |

---

## 3. Global Elements

### 3.1 Settings Gear Button (Persistent)

- **Position**: Fixed top-left corner (LTR) or top-right corner (RTL) of every screen
- **Appearance**: 40×40px round button with a ⚙️ gear SVG icon, `currentColor` stroke
- **Behavior**: Tapping navigates to the Settings screen from any other screen
- **Z-index**: Sits above all page content
- **Note**: Every screen has `padding-top: 60px` to clear this button

### 3.2 App Wrapper

- **Direction**: `dir="rtl"` for Hebrew (default), `dir="ltr"` for English
- **Full viewport**: The app fills `100dvh` — no scrolling by design
- **Background**: Each screen has its own radial-gradient background (see per-screen specs)

---

## 4. Screen-by-Screen Specification

### 4.1 Level Select (Home Screen)

**Purpose**: The landing page. The child picks a difficulty level.

**Layout**:

```
┌─────────────────────────────────────┐
│ ⚙ (gear, top-left)                 │
│                                     │
│ "Choose Your Adventure"  [🏆 Trophy]│
│  TeachWatch                    Room │
│                                     │
│ ┌──────────┐  ┌──────────┐         │
│ │  Level 1  │  │  Level 2  │        │
│ │ Hours Only│  │ Half-Hour │        │
│ │ 🎯 Goal  │  │ 🎯 Goal  │         │
│ │ Best: 8/10│  │ Not tried │        │
│ └──────────┘  └──────────┘         │
│ ┌──────────┐  ┌──────────┐         │
│ │  Level 3  │  │  Level 4  │        │
│ │ 5-Min     │  │ Minute    │        │
│ │ Jumps     │  │ Tracker   │        │
│ └──────────┘  └──────────┘         │
│ ┌──────────┐  ┌──────────┐         │
│ │  Level 5  │  │  Level 6  │        │
│ │ Standard  │  │ The Expert│        │
│ └──────────┘  └──────────┘         │
└─────────────────────────────────────┘
```

**Components**:

1. **Header row**:
   - **Eyebrow text** (small caps): "Choose Your Adventure" / "בחרו את ההרפתקה"
   - **App title** (large, bold): "TeachWatch" / "גאון שעון"
   - **Trophy Room button** (pill-shaped, orange gradient): "Trophy Room" / "חדר הגביעים" — navigates to High Scores

2. **Level grid**: 2 columns, 3 rows (6 cards). On desktop (≥880px), 3 columns.

3. **Each Level Card**:
   - **Level number badge** (square, rounded corners, 38px)
   - **Medal emoji** (if played): 🥇 (10/10), 🥈 (8-9/10), 🥉 (6-7/10), or "—" (unplayed/low)
   - **Level name** (bold)
   - **Learning goal** (smaller text, 2-line clamp)
   - **Record row** (if played): "Best: 8/10" or "Not tried yet" / "עוד לא שיחקנו"
   - **Interaction**: Tap entire card → navigate to Level Intro screen
   - **Hover**: Lifts card 2px with deeper shadow
   - **Active**: Card presses back down

**Background**: Warm gradient — radial gold top-left, radial green bottom-right, base cream-to-peach.

---

### 4.2 Level Intro (Briefing Screen)

**Purpose**: A "mission briefing" that explains what the child will practice before the game starts. Reduces anxiety and sets expectations.

**Layout**:

```
┌────────────────────────────────────┐
│ ⚙                                 │
│                                    │
│         ┌──────────────┐           │
│         │  [ Level 3 ] │  badge    │
│         │              │           │
│         │  Here's the  │  kicker   │
│         │   Plan!      │           │
│         │              │           │
│         │ FIVE-MINUTE  │  title    │
│         │   JUMPS      │           │
│         │              │           │
│         │ Count by     │  desc     │
│         │ fives around │           │
│         │ the clock.   │           │
│         │              │           │
│         │ 🎯 What      │  goal     │
│         │ you'll learn │  (amber   │
│         │              │  card)    │
│         │ 💡 Top Tips: │  tips     │
│         │ ✅ Tip 1     │  (green   │
│         │ ✅ Tip 2     │  card)    │
│         │ ✅ Tip 3     │           │
│         │              │           │
│         │ ┌──────────┐ │           │
│         │ │ Let's Go!│ │  CTA      │
│         │ └──────────┘ │           │
│         │   Back       │  link     │
│         └──────────────┘           │
└────────────────────────────────────┘
```

**Components**:

1. **Level badge**: Green pill — "Level 3" / "שלב 3"
2. **Kicker**: "Here's the Plan!" / "הנה התוכנית!" (uppercase, small)
3. **Level title**: Large, bold — e.g. "Five-Minute Jumps" / "קפיצות של 5 דקות"
4. **Description**: Centered, secondary color — e.g. "Count by fives around the clock."
5. **Goal card** (amber/gold background):
   - Label: "🎯 What you'll learn:" / "🎯 מה נלמד:"
   - Content: The learning goal text (bold)
6. **Tips card** (green background):
   - Label: "💡 Top Tips:" / "💡 טיפים חשובים:"
   - List: Each tip prefixed with ✅ emoji. 3 tips per level.
7. **Start button**: Full-width pill, primary gradient, bold text — "Let's Go!" / "!יאללה"
   - 3D "push" effect: 10px box-shadow below. On press → shadow shrinks, button moves down 5px.
8. **Back link**: Underlined text link below the button — "Back" / "חזרה"

**Per-Level Tips** (all 6 levels):

| Level | Tips (English) |
|---|---|
| 1 — Hours Only | Look at the hour hand only · The hour hand points to the hour · Ignore the minute hand for now |
| 2 — The Half-Hour | The minute hand pointing down means :30 · First check the hour hand · Down = half past! |
| 3 — Five-Minute Jumps | Each number on the clock means 5 minutes · Count by 5s: 5, 10, 15, 20... · The number 3 = 15 minutes! |
| 4 — The Minute Tracker | Count the small ticks between the numbers · Each tiny tick = 1 minute · First find the nearest big number, then count ticks |
| 5 — Standard Clock | No helper labels — you've got this! · Remember: each number = 5 minutes · Use what you learned in earlier levels |
| 6 — The Expert | No numbers at all — trust your instincts! · Think about where 12, 3, 6, 9 would be · You're a clock-reading master! |

**Background**: Blue-tint top-left, green-tint bottom-right, base white-to-cream.

**Card**: Max-width 600px, 4px primary-blue border, rounded corners.

---

### 4.3 Game Session (Core Gameplay)

**Purpose**: The main game loop. 10 questions per session. The child reads an analog clock and picks the correct digital time from 4 choices.

**Layout**:

```
┌────────────────────────────────────┐
│ ⚙                                 │
│                                    │
│ [Quit]  Level 3 – Five-Min Jumps  │
│                                    │
│ ○ ○ ○ ○ ○ ● ● ● ● ●  progress    │
│                                    │
│  💡 Tip banner (Q1 only)          │
│                                    │
│         ┌────────────┐             │
│         │            │             │
│         │   🕐 CLOCK │             │
│         │            │             │
│         └────────────┘             │
│                                    │
│            ✨ (hint)               │
│                                    │
│  ┌──────┐ ┌──────┐                │
│  │ 3:00 │ │ 4:00 │  answer        │
│  ├──────┤ ├──────┤  buttons       │
│  │ 2:00 │ │ 5:00 │                │
│  └──────┘ └──────┘                │
└────────────────────────────────────┘
```

#### 4.3.1 Header

- **Quit button**: Small pill — "Quit" / "יציאה" — returns to Level Select
- **Level title**: Center-aligned — "Level 3 – Five-Minute Jumps" / "שלב 3 – קפיצות של 5 דקות"
- **Progress bar**: Row of 10 dots in a translucent white container:
  - **Upcoming** (unanswered): Hollow circle, teal border, 45% opacity
  - **Correct** (past, correct): Solid teal fill (`#0f766e`)
  - **Incorrect** (past, wrong): Solid red fill (`#ef4444`)
  - **Current** (active question): Solid amber fill (`#f59e0b`), pulsing scale animation (1.06 → 1.24, 900ms, infinite)

#### 4.3.2 Tip Banner (First Question Only)

- Appears above the clock ONLY on question 1
- Yellow gradient background, 2px gold border, rounded
- 💡 icon on the left, tip text on the right (bold, dark gold color)
- Shows tip from the level's tips array
- Fade-in animation (0.4s ease-out, slides down 8px)

#### 4.3.3 The Clock (SVG)

The clock is the central visual element. It's an SVG rendered at `clamp(220px, 48vw, 380px)`.

**Clock elements** (appear/disappear per level):

| Element | L1 | L2 | L3 | L4 | L5 | L6 | Description |
|---|---|---|---|---|---|---|---|
| **Clock rim** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Outer circle, always visible |
| **Hour numbers** (1-12) | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Large numbers at each hour position |
| **Minute ticks** (60 marks) | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | Small marks around the rim. Every 5th tick is longer/thicker. |
| **5-minute labels** (5,10,15...55) | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | Small numbers inside the hour ring showing "5, 10, 15..." |
| **Hour hand** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Short, thick. Extends from center to ~25 units. |
| **Minute hand** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Long, thin. Extends from center to ~40 units. |
| **Center dot** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Small circle at the pivot point |

**Clock rotation formulas**:
- Minute hand: $R_{min} = minutes \times 6°$
- Hour hand: $R_{hour} = (hours \bmod 12 \times 30°) + (minutes \times 0.5°)$

**Clock animation states**:

| State | Visual Effect | Duration |
|---|---|---|
| `idle` | Static clock, no animation | — |
| `correct` | Hands pulse green | 1500ms |
| `incorrect` | Hands wiggle red | 1500ms |
| `sweeping` | Hands rotate smoothly to next time | 600ms |

**Transition between questions**: After feedback (1500ms), hands sweep to the new position (600ms), then the new answer buttons appear.

#### 4.3.4 Visual Hint System

When hints are enabled, a ✨ button appears between the clock and the answer buttons.

**Hint trigger button**:
- 44×44px circle, translucent white background, `backdrop-filter: blur(4px)`, thin gray border
- Amber sparkle emoji: ✨
- Hover: white background, amber shadow, scale up to 1.08
- Active (hint playing): Amber background, white emoji, amber glow shadow
- Disabled while answer feedback is showing

**Hint animation sequence** (two stages, 3 seconds each):

**Stage 1 — Hour hand hint (3s)**:
- The hour hand gets a vivid amber/orange gradient stroke (`#ff8f00` → `#f9a825` → `#e65100`), increased stroke-width, multi-layer SVG glow filter, and a pulsing "throb" animation
- The bounding hour numbers (the two numbers the hour hand is between) get glowing halos — circle behind each number with amber fill, pulse-then-breathe animation
- The halo numbers render as an overlay ABOVE the hands (white text, dark outline)
- Non-active elements dim: minute hand at 55% opacity, ticks at 20%, non-hinted numbers at 15%, rim tints amber

**Stage 2 — Minute hand hint (3s)**:
- Same treatment moves to the minute hand — amber gradient, glow, throb
- The bounding 5-minute labels get the halo treatment
- Hour hand now dims to 55%

**After 6s total**: All highlights fade, clock returns to normal

**On level 5/6** (where numbers or labels are hidden): The hint temporarily reveals the relevant numbers during that stage. They appear with a pop animation and disappear when the stage ends.

#### 4.3.5 Answer Buttons

- **4 buttons** in a 2×2 grid (2 columns, 2 rows)
- Each button: Full-width within its column, min-height 68px, rounded corners (16px)
- **Format**: Digital time string — e.g. "3:00", "10:25", "6:12"
- **Font size**: `clamp(1.25rem, 2.5vw, 1.75rem)`, centered
- **States**:
  - Default: Primary color background, white text
  - Hover: Lifts 1px, slight brightness increase
  - Active (pressed): Pushes down 1px, slight brightness decrease
  - Disabled: 60% opacity
  - Correct highlight: Green background (`#00b894`), scales up slightly
  - Incorrect highlight: Red background (`#d63031`), scales up slightly — then the correct answer also highlights green

**Answer feedback flow**:
1. Child taps a button
2. All buttons become disabled immediately
3. If **correct**: The tapped button turns green. Feedback overlay shows "Correct! ✓" / "!נכון ✓". Clock hands pulse green.
4. If **incorrect**: The tapped button turns red (NOT shown — the correct button turns green to teach the right answer). Feedback overlay shows "Oops, not quite!" / "!אופס, לא בדיוק". Clock hands wiggle red.
5. After 1500ms: Buttons fade out, "Next question..." transition text appears, hands sweep to new time.
6. After 600ms more: New answer buttons appear.

**Distractor logic** (what the wrong answers are):
- **Hour Trap**: Correct minutes, but hour ±1
- **Swap Trap**: Misreading minute hand as the hour (e.g., time is 3:10, distractor is 3:02)
- **Mirror Trap**: Visual symmetry error (e.g., :15 ↔ :45)

#### 4.3.6 Feedback Overlay

- Transparent full-screen overlay on top of the game area
- Large text: "Correct! ✓" (green) or "Oops, not quite!" (red)
- `pointer-events: none` — doesn't block interaction (buttons are already disabled)
- Fades in/out with 200ms opacity transition
- Text has white text-shadow for readability

---

### 4.4 Summary (After-Action Report)

**Purpose**: After 10 questions, show the child how they did. Celebrate success, turn mistakes into learning moments.

**Layout**:

```
┌────────────────────────────────────┐
│ ⚙                                 │
│                                    │
│         ┌──────────────────┐       │
│         │  All Done!       │       │
│         │  Great effort!   │       │
│         │                  │       │
│         │  ★ ★ ★           │ stars │
│         │                  │       │
│         │  8 out of 10     │ score │
│         │  Completed in    │       │
│         │  1m 23s          │ time  │
│         │                  │       │
│         │  Tricky Times:   │       │
│         │ ┌────┐ ┌────┐   │ wrong │
│         │ │🕐  │ │🕐  │   │ clocks│
│         │ │✓4:30│ │✓9:15│  │       │
│         │ │✗5:30│ │✗9:45│  │       │
│         │ └────┘ └────┘   │       │
│         │                  │       │
│         │[Try Again][Levels]│ CTAs │
│         └──────────────────┘       │
└────────────────────────────────────┘
```

**Components**:

1. **Eyebrow**: "All Done!" / "!סיימנו" (uppercase)
2. **Title**: "Great effort!" / "!כל הכבוד" (large, bold)
3. **Star rating**: 1-3 stars
   - 9-10 correct → ★★★ (3 stars)
   - 7-8 correct → ★★ (2 stars)
   - 0-6 correct → ★ (1 star)
   - Filled stars: Gold color with glow shadow
   - Empty stars: Gray
   - Each star animates in with a bounce (staggered: 0ms, 90ms, 180ms delay)
4. **Score**: "8 out of 10" / "8 מתוך 10" (bold)
5. **Time**: "Completed in 1m 23s" / "הושלם תוך 1m 23s"
6. **Perfect round banner** (only when 10/10): Green tinted card — "Perfect round! Every answer was right on time!" / "!סיבוב מושלם! כל תשובה הייתה מדויקת"
7. **Tricky Times section** (only when score < 10):
   - Title: "Tricky Times" / "זמנים מאתגרים"
   - Grid of cards (auto-fit, min 170px), one per wrong answer:
     - Mini clock SVG (86px) showing the time they got wrong
     - "Correct: 4:30" (green label)
     - "You picked: 5:30" (red label)
   - This turns failures into a teaching moment — the child can study what they got wrong.
8. **Action buttons** (2-column grid, bottom of card):
   - "Try Again" / "נסו שוב" (primary) — replays same level
   - "Level Select" / "בחירת שלב" (secondary) — returns to home

**Background**: Gold/cream gradients.

**Card**: Max-width 960px, 1px border, 24px radius, cream background, grid layout.

---

### 4.5 Trophy Room (High Scores)

**Purpose**: Persistent progress tracker. Shows the child's best performance across all 6 levels.

**Layout**:

```
┌────────────────────────────────────┐
│ ⚙                                 │
│                                    │
│ Progress Tracker      [Back]       │
│ Trophy Room                        │
│                                    │
│ ┌──────────┐  ┌──────────┐        │
│ │ Level 1  🥇│  │ Level 2  🥈│     │
│ │ Hours Only│  │ Half-Hour │       │
│ │           │  │           │       │
│ │ Best: 10  │  │ Best: 8   │       │
│ │ Time: 45s │  │ Time: 1m  │       │
│ │ Mar 14    │  │ Mar 13    │       │
│ └──────────┘  └──────────┘        │
│ ┌──────────┐  ┌- - - - - -┐       │
│ │ Level 3  🥉│  │ Level 4   │      │
│ │ 5-Min     │  │ Minute    │       │
│ │ Jumps     │  │ Tracker   │       │
│ │ Best: 7   │  │           │       │
│ │ Time: 2m  │  │ Not tried │       │
│ │ Mar 12    │  │   yet     │       │
│ └──────────┘  └- - - - - -┘       │
│ ┌- - - - - -┐  ┌- - - - - -┐     │
│ │ Level 5   │  │ Level 6    │      │
│ │ Standard  │  │ The Expert │      │
│ │ Not tried │  │ Not tried  │      │
│ └- - - - - -┘  └- - - - - -┘     │
└────────────────────────────────────┘
```

**Components**:

1. **Header**:
   - Eyebrow: "Progress Tracker" / "מעקב התקדמות"
   - Title: "Trophy Room" / "חדר הגביעים" (large, bold)
   - Back button (orange pill): "Back" / "חזרה"

2. **Score grid**: 2 columns, same grid as Level Select

3. **Each score card** (played level):
   - Level label: "Level 1" / "שלב 1"
   - Medal: 🥇 (10/10), 🥈 (8-9), 🥉 (6-7), — (< 6)
   - Level name (bold)
   - Stats list:
     - Best Score: "8/10"
     - Fastest Time: "1m 23s"
     - Last Played: localized date ("Mar 14, 2026")

4. **Each score card** (unplayed level):
   - Dashed border instead of solid
   - Muted colors (60% opacity text)
   - "Not tried yet" / "עוד לא שיחקנו" centered

**Medal thresholds**:

| Score | Medal | Emoji |
|---|---|---|
| 10/10 | Gold | 🥇 |
| 8-9/10 | Silver | 🥈 |
| 6-7/10 | Bronze | 🥉 |
| 0-5/10 | None | — |

**Data persistence**: Stored in `localStorage`. Only updates if new score is higher, or same score with faster time.

---

### 4.6 Settings

**Purpose**: Let the child (or parent) change language, toggle hints, and reset progress.

**Layout**:

```
┌────────────────────────────────────┐
│ ⚙                                 │
│                                    │
│ Settings                    [Back] │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ Language                     │   │
│ │                              │   │
│ │ Language    [ EN | עב ]      │   │
│ └──────────────────────────────┘   │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ Show Hints                   │   │
│ │                              │   │
│ │ Show Hints  [ ON | OFF ]     │   │
│ └──────────────────────────────┘   │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ Reset All Scores             │   │
│ │                              │   │
│ │ [ Reset All Scores ]         │   │
│ └──────────────────────────────┘   │
└────────────────────────────────────┘
```

**Components**:

1. **Header**: Title "Settings" / "הגדרות" + Back button (secondary style)

2. **Language card**:
   - Title: "Language" / "שפה"
   - Segmented control (pill toggle) with two options: **EN** | **עב**
   - Active segment: Primary color background, white text
   - Inactive segment: Transparent, border
   - When toggled: The entire app immediately switches language AND text direction (RTL ↔ LTR)
   - Default: Hebrew (עב)

3. **Hints card**:
   - Title: "Show Hints" / "הצג רמזים"
   - Segmented control: **ON** | **OFF**
   - Same visual style as language toggle
   - Controls whether the ✨ hint button appears during gameplay
   - Default: ON
   - Persisted to `localStorage`

4. **Reset scores card**:
   - Title: "Reset All Scores" / "איפוס כל הציונים"
   - Single danger button
   - **3-state behavior**:
     1. Default: "Reset All Scores" / "איפוס כל הציונים"
     2. First tap: Text changes to "Are you sure? This will erase all your high scores." / "?בטוחים? זה ימחק את כל שיאי הניקוד" — auto-reverts after 3 seconds if not confirmed
     3. Second tap (within 3s): Executes reset, text changes to "Scores have been reset!" / "!הציונים אופסו" — reverts to default after 1.5s
   - This 2-tap confirmation protects children from accidentally erasing progress

**Background**: Blue/green radial gradient on light base, matching other screens.

---

## 5. The Analog Clock — Detailed Visual Spec

The clock is an SVG rendered in a `100×100` viewBox. Center at `(50, 50)`.

### 5.1 Base Elements

| Element | Shape | Position | Style |
|---|---|---|---|
| **Rim** | Circle | cx=50, cy=50, r=48 | Stroke, no fill |
| **Hour numbers** (1-12) | Text | At radius 38 from center, at each 30° position | Bold, ~7px font. Only on Levels 1-5. |
| **5-minute labels** (5,10...55) | Text | At radius 32 from center | Smaller, ~5px font. Only on Levels 3-4. |
| **Minute ticks** (60 marks) | Lines | From radius 44-48 (short) or 42-48 (long, every 5th) | Thin strokes. Levels 2-6. |
| **Hour hand** | Line | From (50,50) to (50,25) | Short, thick (stroke-width ~3) |
| **Minute hand** | Line | From (50,50) to (50,10) | Long, thin (stroke-width ~2) |
| **Center dot** | Circle | cx=50, cy=50, r=2 | Solid fill |
| **Hand cap** | Circle | cx=50, cy=50, r=1.2 | Covers the hand junction |

### 5.2 Level-Specific Clock Variations

| Level | Clock Look |
|---|---|
| **Level 1** | Hour numbers (1-12) + hands + center dot. No ticks, no labels. A very clean, friendly clock. |
| **Level 2** | Add minute ticks (60 marks around the rim). Still no 5-minute labels. |
| **Level 3** | Add 5-minute labels inside the number ring (5, 10, 15... 55). The "training wheels" level. |
| **Level 4** | Same as Level 3 — everything visible. Most information-dense clock. |
| **Level 5** | Remove 5-minute labels. Still has hour numbers and ticks. |
| **Level 6** | Remove ALL numbers. Only ticks and hands remain. The "naked clock." |

### 5.3 Clock Size

- The clock SVG is sized with `clamp(220px, 48vw, 380px)` — responsive.
- On a phone: ~220-260px
- On a tablet: ~300-340px
- On desktop: ~380px

---

## 6. User Flows

### 6.1 Happy Path — Complete a Level

```
Level Select
    ↓ tap Level 3 card
Level Intro
    ↓ read tips, tap "Let's Go!"
Game Session (Q1)
    ↓ see tip banner + clock + 4 answers
    ↓ tap correct answer
    ↓ green feedback (1.5s) → sweep (0.6s)
Game Session (Q2-Q10)
    ↓ repeat 9 more times
    ↓ (no tip banner after Q1)
Summary
    ↓ see stars + score + time
    ↓ if any wrong → see Tricky Times
    ↓ tap "Try Again" or "Level Select"
Level Select (or Game Session again)
```

### 6.2 Using a Hint

```
Game Session (any question)
    ↓ child is unsure
    ↓ tap ✨ hint button
    ↓ Stage 1: hour hand glows (3s)
    ↓ Stage 2: minute hand glows (3s)
    ↓ returns to normal
    ↓ child picks answer
```

- Hints can be triggered once per question (button is disabled during feedback)
- If the child answers before the hint finishes, the hint auto-cancels
- Hints don't affect scoring — no penalty for using them

### 6.3 Wrong Answer Flow

```
Game Session
    ↓ tap wrong answer
    ↓ wrong button stays default (no red highlight)
    ↓ correct button highlights green
    ↓ overlay: "Oops, not quite!"
    ↓ clock hands wiggle red (1.5s)
    ↓ sweep to next question (0.6s)
    ↓ progress bar: red dot for that question
```

### 6.4 Settings Flow

```
Any screen
    ↓ tap ⚙ gear icon
Settings
    ↓ switch language → app reflows RTL/LTR instantly
    ↓ toggle hints → affects next game session
    ↓ reset scores → 2-tap confirmation
    ↓ tap "Back"
Previous screen (always → Level Select)
```

### 6.5 Trophy Room Flow

```
Level Select
    ↓ tap "Trophy Room" button
High Scores
    ↓ browse all 6 levels
    ↓ see medals, best scores, times
    ↓ tap "Back"
Level Select
```

---

## 7. Content & Copy Reference

All user-facing strings exist in two languages. Below is the complete English copy. The Hebrew translations exist in the codebase.

### Navigation & Chrome

| Key | English | Purpose |
|---|---|---|
| appTitle | TeachWatch | App name (HE: "גאון שעון") |
| chooseYourAdventure | Choose Your Adventure | Level Select eyebrow |
| trophyRoom | Trophy Room | Trophy button & page title |
| settings | Settings | Gear button label |
| settingsTitle | Settings | Settings page title |
| back | Back | Back button text |
| quit | Quit | Quit game button |
| language | Language | Settings label |

### Game Session

| Key | English | Purpose |
|---|---|---|
| preparingQuestions | Getting your questions ready... | Loading state |
| questionProgress | Question progress | Aria label for progress bar |
| currentQuestion | Current question | Aria label prefix |
| nextQuestion | Next question... | Transition text |
| correct | Correct! ✓ | Correct feedback |
| notQuite | Oops, not quite! | Wrong feedback |
| hintButton | Hint | Hint button aria label |

### Summary

| Key | English | Purpose |
|---|---|---|
| sessionComplete | All Done! | Eyebrow |
| greatEffort | Great effort! | Title |
| scoreOutOf10 | {score} out of 10 | Score display |
| completedIn | Completed in {duration} | Time display |
| perfectRound | Perfect round! Every answer was right on time! | Perfect score message |
| tryAgain | Try Again | Replay button |
| levelSelect | Level Select | Return button |
| trickyTimes | Tricky Times | Wrong answers section title |
| correctLabel | Correct: | Correct answer label |
| youPicked | You picked: | User's wrong answer label |

### Level Intro

| Key | English | Purpose |
|---|---|---|
| levelIntroTitle | Here's the Plan! | Kicker text |
| levelIntroGoalLabel | 🎯 What you'll learn: | Goal section label |
| levelIntroTipsLabel | 💡 Top Tips: | Tips section label |
| levelIntroStart | Let's Go! | CTA button |
| levelLabel | Level {level} | Level number label |

### High Scores

| Key | English | Purpose |
|---|---|---|
| progressTracker | Progress Tracker | Eyebrow |
| bestScore | Best Score | Stat label |
| fastestTime | Fastest Time | Stat label |
| lastPlayed | Last Played | Stat label |
| scoreOf10 | {score}/10 | Score format |
| notPlayedYet | Not tried yet | Empty level text |
| goldMedal / silverMedal / bronzeMedal / noMedal | Gold/Silver/Bronze/No medal | Medal aria labels |

### Settings

| Key | English | Purpose |
|---|---|---|
| hintsEnabled | Show Hints | Toggle label |
| resetScores | Reset All Scores | Button default text |
| resetScoresConfirm | Are you sure? This will erase all your high scores. | Confirmation text |
| resetScoresDone | Scores have been reset! | Success text |

---

## 8. Interaction & Animation Inventory

| Animation | Where | Duration | Easing | Description |
|---|---|---|---|---|
| **Dot pulse** | Progress bar (current) | 900ms, infinite | ease-in-out | Scale 1.06 → 1.24 → 1.06 |
| **Tip fade-in** | Game session (Q1) | 400ms | ease-out | Opacity 0→1, translateY -8→0 |
| **Star bounce-in** | Summary | 340ms per star | cubic-bezier(0.18, 0.9, 0.25, 1.2) | Scale 0.5→1, staggered 90ms |
| **Button hover lift** | All buttons | 140ms | ease | translateY -1px, subtle brightness |
| **Button press** | All buttons | 140ms | ease | translateY +1px, slight dim |
| **3D push button** | "Let's Go!" CTA | 150ms | ease | Box-shadow 10px→5px, translateY 0→5px |
| **Card hover lift** | Level cards | 140ms | ease | translateY -2px, deeper shadow |
| **Clock hand sweep** | Game session | 600ms | CSS transition | Hands rotate to new time position |
| **Correct pulse** | Clock hands | 1500ms | — | Green pulse effect |
| **Incorrect wiggle** | Clock hands | 1500ms | — | Red wiggle effect |
| **Hint hand throb** | Hinted hand | 1.2s, infinite | ease-in-out | Stroke-width pulses |
| **Hint halo pop** | Number halos | 300ms | cubic-bezier(0.34, 1.56, 0.64, 1) | Scale 0→1, overshoot |
| **Hint halo breathe** | Number halos | 2s, infinite | ease-in-out | Opacity 0.85↔1 + scale 1↔1.08 |
| **Hint number pop** | Overlay numbers | 300ms | cubic-bezier(0.34, 1.56, 0.64, 1) | Scale 0.3→1, overshoot |
| **Feedback fade** | Overlay text | 200ms | ease | Opacity transition |

**Reduced motion**: All keyframe animations are disabled when `prefers-reduced-motion: reduce`. Transitions remain but with instant timing.

---

## 9. Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| **≤ 480px** (small phone) | Summary card: tighter padding, single-column action buttons. Tricky Times: 2-column grid, 74px clocks. |
| **≤ 500px** (phone) | Level Select: tighter padding/gap, smaller Trophy button. |
| **≤ 600px** (large phone) | Level Intro card: tighter padding, full-width CTA, larger relative title. |
| **≤ 720px** (tablet portrait) | Game session: less padding, header wraps, smaller level title, smaller tip text. |
| **≥ 880px** (tablet landscape / desktop) | Level Select grid: 3 columns instead of 2. |

---

## 10. Accessibility

| Feature | Implementation |
|---|---|
| **Semantic roles** | `progressbar`, `list`/`listitem`, `img` (for stars/medals), `group` (for toggles) |
| **ARIA labels** | All interactive elements have labels: clock ("Analog clock showing 3:15"), buttons, progress bar, sections |
| **aria-pressed** | Toggle buttons in Settings (language, hints) |
| **aria-live** | Answer area and feedback overlay are live regions |
| **Focus visible** | 3px solid outline on all focusable elements (primary blue or accent orange) |
| **Screen reader text** | `.sr-only` class for visually hidden labels |
| **Color alone** | Information is not conveyed by color alone — shapes and text reinforce meaning |
| **Reduced motion** | All animations respect `prefers-reduced-motion: reduce` |

---

## 11. State Persistence

| Data | Storage | Key | Behavior |
|---|---|---|---|
| **High scores** | `localStorage` | `teachwatch-high-scores` | Per-level: best score, fastest time, last played. Only overwrites if better. |
| **Language** | `localStorage` | `teachwatch-language` | `'en'` or `'he'`. Default: `'he'` |
| **Hints enabled** | `localStorage` | `teachwatch-hints-enabled` | `'true'` or `'false'`. Default: `true` |
| **Game session** | In-memory only | — | Not persisted. Leaving mid-game loses progress. |

---

## 12. Edge Cases & Error Handling

| Scenario | Behavior |
|---|---|
| **localStorage unavailable** | App works normally with defaults. Errors are silently caught. Scores won't persist. |
| **Corrupted stored data** | Falls back to empty high scores. No crash. |
| **All 10 answers wrong** | Summary still shows encouraging "Great effort!" + 1 star. Tricky Times shows all 10 clocks. |
| **All 10 answers correct** | Summary shows "Perfect round!" banner instead of Tricky Times. 3 stars. |
| **Refreshing mid-game** | Session is lost. Returns to Level Select (default view). |
| **Very fast completion** | Time shows as "0s" minimum. No negative times. |
| **Long session time** | Time formats as "Xm Ys" for durations ≥ 60s. |
| **Clock near midnight/noon** | Hour rotation formula handles 12→1 wrap correctly. |
| **Hint on Level 6** (no numbers) | Numbers temporarily appear during hint highlighting, then vanish. |
| **Hint on Level 1** (hours only) | Stage 2 (minute hand) still runs but doesn't highlight any 5-minute labels. |
| **Double-tapping answer** | Answer lock (`isAnswerLocked`) prevents processing more than one answer per question. |
| **Settings → Back** | Always returns to Level Select, not the previous screen. |

---

## 13. Level Reference Table

| # | Name (EN) | Name (HE) | Description | Allowed Times | Clock Elements Shown |
|---|---|---|---|---|---|
| 1 | Hours Only | שעות בלבד | Read the hour hand on a friendly clock | X:00 only | Numbers, hands |
| 2 | The Half-Hour | חצי שעה | Learn what happens when the minute hand points down | X:00, X:30 | Numbers, ticks, hands |
| 3 | Five-Minute Jumps | קפיצות של 5 דקות | Count by fives around the clock | X:00, X:05, X:10... X:55 | Numbers, ticks, 5-min labels, hands |
| 4 | The Minute Tracker | עוקב הדקות | Read any minute on the clock | Any minute X:00-X:59 | Numbers, ticks, 5-min labels, hands |
| 5 | Standard Clock | שעון רגיל | A real clock — no helper labels! | Any minute | Numbers, ticks, hands (NO labels) |
| 6 | The Expert | המומחה | No numbers at all — just the hands and ticks! | Any minute | Ticks, hands (NO numbers, NO labels) |

---

## 14. Existing Screenshots

Reference screenshots are available in the `screenshots/` folder:
- `screenshots/web/` — 8 desktop screenshots
- `screenshots/mobile/` — 8 mobile screenshots

---

## 15. Open Questions for Designer

1. **Onboarding**: Should there be a first-launch tutorial/welcome screen? Currently there is none.
2. **Sound effects**: The game design doc mentions sounds (correct/incorrect), but none are implemented. Should the visual design account for sound on/off toggle?
3. **Character/mascot**: Would a clock mascot character benefit the experience for the target age group?
4. **Level unlock**: Currently all 6 levels are accessible from the start. Should levels be locked until the previous one is completed?
5. **Confetti/celebrations**: Should there be confetti or celebration animations on 3-star or perfect scores?
6. **Parent mode**: Should there be a separate parent dashboard or is the Trophy Room sufficient?
