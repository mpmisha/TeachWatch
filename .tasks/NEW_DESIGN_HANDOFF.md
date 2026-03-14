# TeachWatch Design Handoff

*Note: The Google Stitch MCP server tools were unavailable during this session. As instructed, I have fallen back to manual design work and generated this comprehensive design specification using my best design judgment based on the product requirements.*

## 1. Design System Updates & Tokens

To align with the "kid-friendly, accessible, and playful" constraints for ages 6-10, I am proposing an update to our design tokens. The new system relies on softer, primary-adjacent pastels and vibrant accents to draw attention while avoiding sensory overload.

### Color Palette Update
| Token | Old Value | New Value | Rationale |
|---|---|---|---|
| **Primary** | `#4361ee` | `#5C7CFA` | Softer, bubblier blue. Easier on the eyes but still high contrast. |
| **Success** | `#00b894` | `#20C997` | Brighter, more "minty" green for positive reinforcement. |
| **Error** | `#d63031` | `#FF6B6B` | Warmer red/coral to feel less "punishing" and more like a gentle correction. |
| **Background** | `#f8f9fa` | `#F8F9FA` | Kept the same for clean contrast. Radial gradients to use `#E5F4FF` as the center. |
| **Surface** | `#ffffff` | `#FFFFFF` | Core surface color. |
| **Gold (Stars)** | `#fdcb6e` | `#FCC419` | Deeper, richer yellow for rewards and progress indicating. |

### Typography & Sizing
*   **Font Family**: `Nunito, 'Baloo 2', 'Comic Sans MS', cursive, sans-serif` (Added Nunito for better legibility on numbers while maintaining a rounded, friendly structure).
*   **Touch Targets**: Strictly enforced `min-height: 60px` and `min-width: 60px` for *all* interactive elements.
*   **Border Radius**: Increased standard card radius from `16px` to `24px` for a softer, "bouncier" feel entirely. Buttons to use `9999px` (pill shape).

---

## 2. Screen Layout Specifications (No-Scroll, Responsive)

### 2.1 Level Selection Screen
*   **Background**: Radial gradient from `#E5F4FF` to `#F8F9FA`.
*   **Header**: 
    *   Large, bold typography for "Choose Your Adventure". 
    *   Settings Gear: Fixed to logical `inset-inline-start: 1rem; inset-block-start: 1rem`. Size: 44x44px minimal, visual footprint 40x40px.
*   **Grid Layout**:
    *   Responsive CSS Grid: `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));`
    *   Gap: `1.5rem` to prevent accidental mis-taps by children.
*   **Level Cards**:
    *   Card styling: White background, 24px border radius, subtle shadow (`0 8px 16px rgba(0,0,0,0.05)`).
    *   Hover/Active state: Transform `translateY(-4px)` with an increased shadow to imply interactivity.
    *   Content: Level Number (dominant size), subtitle, and a pill-shaped badge for the "Best Score" or "Not Tried" state.

### 2.2 Game Session Screen
*   **Layout Structure (Vertical Flexbox, 100dvh)**:
    1.  **Top Bar (15%)**: Contextual info (Current Level, Question X/10).
    2.  **Clock Stage (45%)**: Centered. The analog clock face uses vibrant hands.
        *   *Hour Hand*: `#FF6B6B` (Thick, rounded cap).
        *   *Minute Hand*: `#5C7CFA` (Longer, slightly thinner, rounded cap).
    3.  **Interaction Zone (40%)**: 
        *   2x2 grid of answer buttons for multiple-choice modes.
        *   Buttons must be massive: `min-height: 80px`, taking full width of the cell.
        *   Text size inside buttons: `2rem` (32px) for instant readability.

### 2.3 Success / Feedback Overlays
*   **Animation Requirements**: Pop-in scaling (`scale(0.8)` to `scale(1.0)` with a spring easing).
*   **Correct Answer**: Full-screen semi-transparent overlay (`rgba(32, 201, 151, 0.15)`), showing a large bouncy Star or Checkmark, automatically advancing after 1.5 seconds.
*   **Hint Mode**: If a child waits too long, the correct answer pulses gently (CSS `@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(92,124,250, 0.4); } ... }`).

### 2.4 Summary / High Scores Screen
*   **Reward Focus**: Massive star rating display at the top center.
*   **Trophy Display**: 3D-styled SVG medals that unlock globally.
*   **Action**: A prominent, pill-shaped "Play Next Level" or "Try Again" button at the bottom center.

---

## 3. RTL / LTR Implementation Notes
*   Always use logical CSS properties: `margin-inline-start`, `padding-inline-end`, `border-start-start-radius`.
*   The Settings gear must flip automatically based on the HTML `dir` attribute.
*   Flex row directions will automatically handle the RTL visual order, no explicit row-reverse needed unless addressing a specific numeric input block.

## 4. Next Steps for Developers
1. Update `src/styles/tokens.css` with the revised color palette and border-radius settings.
2. Refactor `<LevelSelect />` and `<LevelCard />` to use the new CSS Grid and Card specifications.
3. Apply the `min-height: 60px` rule globally to all `<Button />` components to enforce the touch-target constraint for kids.