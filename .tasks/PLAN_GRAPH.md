# Implementation Plan — Visual Overview

```mermaid
flowchart TD
    subgraph "Phase 0: Shared Contracts"
        C0["C0: New Types & Interfaces\n📁 src/types/game.ts\n🤖 React FE Engineer"]
    end

    subgraph "Phase 1 (parallel)"
        C1["C1: Rewrite hintEngine\n📁 src/logic/hintEngine.ts\n🤖 Game Logic Engineer"]
        C2["C2: useHintSequence Hook\n📁 src/hooks/useHintSequence.ts\n🤖 React FE Engineer"]
        C3["C3: Clock SVG Highlighting\n📁 src/components/Clock/*\n🤖 SVG Animation Engineer"]
        C4["C4: Redesign Hint Button\n📁 HintButton.tsx + CSS\n🤖 Designer"]
        C5["C5: Clean Up Translations\n📁 locales/*.json, types.ts\n🤖 Translation Engineer"]
    end

    subgraph "Phase 2 (parallel)"
        C6["C6: Wire useGameSession\n📁 src/hooks/useGameSession.ts\n🤖 React FE Engineer"]
        C7["C7: Wire QuestionView + GameSession\n📁 QuestionView.tsx, GameSession.tsx\n🤖 React FE Engineer"]
    end

    subgraph "Phase 3: Verification"
        C8["C8: Smoke Test & Cleanup\n📁 all modified files\n🤖 QA Engineer"]
    end

    C0 --> C1
    C0 --> C2
    C0 --> C3
    C0 --> C4
    C0 --> C5
    C1 --> C6
    C2 --> C6
    C2 --> C7
    C3 --> C7
    C4 --> C7
    C6 --> C7
    C5 --> C8
    C6 --> C8
    C7 --> C8

    classDef reactfe fill:#61dafb,color:#000,stroke:#21a1cb
    classDef svgeng fill:#ff6b6b,color:#fff,stroke:#c0392b
    classDef gamelogic fill:#a29bfe,color:#fff,stroke:#6c5ce7
    classDef designer fill:#ffeaa7,color:#000,stroke:#fdcb6e
    classDef translation fill:#fd79a8,color:#fff,stroke:#e84393
    classDef qa fill:#55efc4,color:#000,stroke:#00b894

    class C0,C2,C6,C7 reactfe
    class C3 svgeng
    class C1 gamelogic
    class C4 designer
    class C5 translation
    class C8 qa
```

### Legend
| Color | Agent |
|-------|-------|
| 🔵 Blue | Expert React Frontend Engineer |
| 🔴 Red | SVG Animation Engineer |
| 🟣 Purple | Game Logic Engineer |
| 🟡 Yellow | Designer |
| 🩷 Pink | Translation Engineer |
| 🟢 Green | QA Engineer |

### Dependency Summary
- **Phase 0** (C0) has no dependencies — runs first.
- **Phase 1** (C1–C5) all depend only on C0 — run in parallel.
- **Phase 2** (C6–C7): C6 depends on C0+C1+C2; C7 depends on C2+C3+C4+C6.
- **Phase 3** (C8) depends on C5+C6+C7 — final verification.
