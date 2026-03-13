# TeachWatch Game Design

## 1. Gameplay Loop

The game is structured into sessions. A session consists of 10 questions.

1. Start: The child selects a level from the home screen.
2. The Question: A clock is rendered with a random time based on level constraints. Four buttons appear below.
3. Feedback:
	- Correct: The clock hands pulse green, a "Success" sound plays, and the progress bar advances.
	- Incorrect: The clock hands wiggle red. The correct answer is briefly highlighted before moving to the next question.
4. End: After 10 questions, the Summary View appears.

## 2. Detailed Level Progression

The level system acts as a scaffolding logic, removing visual aids as the child's internal model of time improves.

| Level | Feature Set | Time Constraints | Learning Goal |
| --- | --- | --- | --- |
| 1 | Hours Only | Only $hh:00$ | Understanding the "Little Hand" and its position. |
| 2 | The Half-Hour | $hh:00$ and $hh:30$ | Introduction of the "Big Hand" and its 180-degree flip. |
| 3 | Five-Minute Jumps | Intervals of 5 (e.g., $10:25$) | Learning the "Secret Identity" of numbers (e.g., $4 = 20$). |
| 4 | The Minute Tracker | Any minute (e.g., $6:12$) | Counting individual ticks between 5-minute labels. |
| 5 | Standard Clock | All intervals | Removing the 5-minute helper labels; relying on memory. |
| 6 | The Expert | All intervals | Removing all numbers; relying on spatial orientation only. |

## 3. Implementation Logic

### The SVG Coordinate System

Use a $100 \times 100$ viewbox. This makes the center $(50, 50)$ and allows you to use percentages for lengths.

- The Hour Hand: Should be shorter and thicker (length: 25-30 units).
- The Minute Hand: Should be longer and thinner (length: 40-45 units).

### The Rotation Formulas

To make the clock look real, the hour hand must not stay static on the number; it must drift toward the next hour as minutes pass.

Minute hand rotation ($R_{min}$):

$$
R_{min} = minutes \cdot 6^\circ
$$

Hour hand rotation ($R_{hour}$):

$$
R_{hour} = (hours \pmod{12} \cdot 30^\circ) + (minutes \cdot 0.5^\circ)
$$

### The Question and Distractor Engine

Instead of random numbers, the wrong answers should be targeted distractors.

- The Hour Trap: The correct minutes, but the hour is incremented by 1.
- The Swap Trap: If the time is $3:10$, a distractor should be $3:02$ (mistaking the 2 for "2 minutes").
- The Mirror Trap: For $hh:15$, a distractor could be $hh:45$ (visual symmetry error).

## 4. Summary and High-Score Views

### The Summary View (After-Action Report)

After the 10th question, transition to a full-screen overlay:

- Performance Score: A visual star rating (1-3 stars) based on accuracy.
- Tricky Times Section: Display a small grid of the clocks she got wrong. Show what the time was and what she clicked. This turns a fail into a teaching moment.
- Action Buttons: "Try Again" (same level) or "Level Select."

### The High-Score View (Progress Tracking)

Since this is a local web app, use `localStorage` to persist a simple JSON object.

Structure: Store a record for each level containing:

- Best Score (e.g., 10/10).
- Fastest Time (total seconds to complete the 10 questions).
- Last Played (date string).

Visual: A simple table or trophy room where each level shows a gold, silver, or bronze medal based on her best performance.

## 5. UI/UX Developer Tips for Kids

- No Scrolling: Keep the entire game above the fold. An 8-year-old should see the clock and the buttons simultaneously without moving the page.
- Touch Targets: Ensure the buttons are large (at least 60px height) and have enough gutter between them to prevent accidental clicks.
- Smooth Sweeping: When moving from Question A to Question B, use a CSS transition on the `transform` property of the SVG hands. Watching the hands spin to the new position helps the brain visualize the rotation.