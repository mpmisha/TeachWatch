# Implementation Plan — Visual Overview

```mermaid
flowchart TD
    subgraph "Phase 0: Scaffolding + Shared Contracts"
        C0["C0: Project Scaffolding
📁 package.json, vite.config.ts, index.html, src/main.tsx
🤖 DevOps Engineer"]
        C1["C1: Shared Types + Level Config + Time Utils
📁 src/types/game.ts, src/logic/levelConfig.ts, src/logic/timeUtils.ts
🤖 Game Logic Engineer"]
    end

    subgraph "Phase 1: Core Building Blocks (parallel)"
        C2["C2: Analog Clock SVG
📁 src/components/Clock/*
🤖 SVG Animation Engineer"]
        C3["C3: Question + Distractor Engine + Scoring
📁 src/logic/questionEngine.ts, distractorEngine.ts, scoring.ts
🤖 Game Logic Engineer"]
        C4["C4: UI Primitives (Button, AnswerButtons, ProgressBar)
📁 src/components/common/*, src/components/GameSession/Answer*, Progress*
🤖 React FE Engineer"]
        C5["C5: Level Select Screen
📁 src/components/LevelSelect/*
🤖 React FE Engineer"]
        C6["C6: Hooks (useHighScores, useTimer)
📁 src/hooks/useHighScores.ts, useTimer.ts
🤖 React FE Engineer"]
        C7["C7: Design System (Tokens + Global Styles)
📁 src/styles/tokens.css, src/index.css
🤖 Designer"]
    end

    subgraph "Phase 2: Feature Assembly (parallel)"
        C8["C8: Game Session Screen
📁 src/hooks/useGameSession.ts, src/components/GameSession/Game*, Question*, Feedback*
🤖 React FE Engineer"]
        C9["C9: Summary View
📁 src/components/Summary/*
🤖 React FE Engineer"]
        C10["C10: High Scores View
📁 src/components/HighScores/*
🤖 React FE Engineer"]
    end

    subgraph "Phase 3: Integration"
        C11["C11: App Wiring + Navigation
📁 src/App.tsx, src/App.css
🤖 React FE Engineer"]
    end

    C0 --> C1
    C1 --> C2
    C1 --> C3
    C1 --> C4
    C1 --> C5
    C1 --> C6
    C0 --> C7
    C2 --> C8
    C3 --> C8
    C4 --> C8
    C6 --> C8
    C2 --> C9
    C3 --> C9
    C1 --> C10
    C6 --> C10
    C5 --> C11
    C7 --> C11
    C8 --> C11
    C9 --> C11
    C10 --> C11

    classDef devops fill:#55efc4,color:#000,stroke:#00b894
    classDef reactfe fill:#61dafb,color:#000,stroke:#21a1cb
    classDef svgeng fill:#ff6b6b,color:#fff,stroke:#c0392b
    classDef gamelogic fill:#a29bfe,color:#fff,stroke:#6c5ce7
    classDef designer fill:#ffeaa7,color:#000,stroke:#fdcb6e

    class C0 devops
    class C1,C3 gamelogic
    class C2 svgeng
    class C4,C5,C6,C8,C9,C10,C11 reactfe
    class C7 designer
```

### Legend
| Color | Agent |
|-------|-------|
| 🟢 Green | DevOps Engineer |
| 🟣 Purple | Game Logic Engineer |
| 🔴 Red | SVG Animation Engineer |
| 🔵 Blue | Expert React Frontend Engineer |
| 🟡 Yellow | Designer |
