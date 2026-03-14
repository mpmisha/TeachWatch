# Implementation Plan — Visual Overview

```mermaid
flowchart TD
    subgraph "Phase 0: Shared Contracts"
        C0["C0: i18n Types\n📁 src/i18n/types.ts\n🤖 React FE Engineer"]
    end

    subgraph "Phase 1 (parallel)"
        C1["C1: JSON Locale Files\n📁 src/i18n/locales/en.json\n📁 src/i18n/locales/he.json\n🤖 React FE Engineer"]
        C2["C2: Translation Resolver\n📁 src/i18n/resolveTranslations.ts\n🤖 React FE Engineer"]
    end

    subgraph "Phase 2: Integration"
        C3["C3: Rewire i18n Module\n📁 src/i18n/translations.ts\n📁 src/i18n/LanguageContext.tsx\n📁 src/i18n/index.ts\n🤖 React FE Engineer"]
    end

    C0 --> C1
    C0 --> C2
    C1 --> C3
    C2 --> C3

    classDef reactfe fill:#61dafb,color:#000,stroke:#21a1cb

    class C0,C1,C2,C3 reactfe
```

### Legend
| Color | Agent |
|-------|-------|
| 🔵 Blue | Expert React Frontend Engineer |

### Dependency Summary
- **C0** → no deps (create first)
- **C1, C2** → depend on C0 (can run in parallel)
- **C3** → depends on C0 + C1 + C2 (integration phase)

