# DevOps Engineer — Task

## Chunk C0: Project Scaffolding
- **Phase**: 0
- **Dependencies**: none
- **Files to create**:
  - `package.json`
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `tsconfig.node.json`
  - `vite.config.ts`
  - `eslint.config.js`
  - `index.html`
  - `src/main.tsx`
  - `src/vite-env.d.ts`
  - `.gitignore`
  - `public/favicon.svg`

### Description

Initialize a Vite + React + TypeScript project from scratch. This is a greenfield repo — no source code currently exists.

### Dependencies to install

**Production:**
- `react` (^19)
- `react-dom` (^19)

**Development:**
- `typescript` (~5.7)
- `vite` (^6)
- `@vitejs/plugin-react` (^4)
- `@types/react` (^19)
- `@types/react-dom` (^19)
- `eslint` (^9)
- `@eslint/js` (^9)
- `typescript-eslint` (^8)
- `eslint-plugin-react-hooks` (^5)
- `eslint-plugin-react-refresh` (^0.4)
- `globals` (^15)

### File Details

**`package.json`**: Standard Vite React-TS setup. Scripts:
- `"dev": "vite"`
- `"build": "tsc -b && vite build"`
- `"lint": "eslint ."`
- `"preview": "vite preview"`

Set `"name": "teachwatch"`, `"private": true`, `"version": "0.1.0"`, `"type": "module"`.

**`tsconfig.json`**: Project references setup pointing to `tsconfig.app.json` and `tsconfig.node.json`.

**`tsconfig.app.json`**: Target ES2020, module ESNext, lib `["ES2020", "DOM", "DOM.Iterable"]`, strict mode, jsx `"react-jsx"`, moduleResolution `"bundler"`, include `["src"]`.

**`tsconfig.node.json`**: For Vite config. Target ES2022, module ESNext, include `["vite.config.ts"]`.

**`vite.config.ts`**: Import `@vitejs/plugin-react`, export default config with `plugins: [react()]`.

**`eslint.config.js`**: Flat ESLint config with TypeScript, React hooks, and React refresh plugins.

**`index.html`**: Standard Vite HTML shell. Root div with `id="root"`. Title: "TeachWatch". Link to `/favicon.svg`. Script tag pointing to `/src/main.tsx`.

**`src/main.tsx`**: 
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
Note: `App.tsx` and `index.css` will be created by other chunks (C11 and C7 respectively). This is intentional — the project won't compile until all Phase 3 dependencies are met.

**`src/vite-env.d.ts`**: Standard Vite client types reference: `/// <reference types="vite/client" />`

**`.gitignore`**: Standard Node/Vite ignores: `node_modules`, `dist`, `.env`, `.DS_Store`, `*.local`.

**`public/favicon.svg`**: Simple clock icon SVG favicon.

### Validation
After creating all files: run `npm install` to verify dependencies resolve. Do NOT run `npm run build` yet — it will fail because `App.tsx` doesn't exist until Phase 3.
