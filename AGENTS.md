<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository Guide for Agents

## Project

DistraAI is a Next.js 16 (App Router) disaster-intelligence dashboard prototype:
per-region flood/landslide risk zones, alert feeds, sensor-look insights, and
community ground reports, built with React 19, TypeScript, Tailwind CSS v4, and
Leaflet. All data is bundled sample fixtures today (Kerala districts); the
data-provider seam is designed for a real backend later.

## Before writing code

- **Read Next.js docs first.** The auto block above is serious: this Next
  version differs from training data. When touching Next-specific APIs (fonts,
  routing, dynamic imports, cache, metadata), open the matching guide in
  `node_modules/next/dist/docs/` before writing code.
- **Read the design docs.** `docs/design-system.md`, `docs/architecture.md`,
  `docs/risk-scoring.md`, and `docs/data-layer.md` define conventions that code
  must follow. `docs/contributing.md` has the editing rules.

## Data access (non-negotiable)

- Components and views MUST NOT import fixtures from `src/data/` directly.
- Always call accessors on `src/lib/data-client.ts`, typically through
  `useData(fetcher, deps)` from `src/lib/use-data.ts`.
- Keep returned shapes identical to `src/data/types.ts`. Adding a backend later
  depends on stable shapes.

## Design language

- Warm editorial "field log": parchment canvas (#f9f5ec), ink text (#26211b),
  single terracotta accent (#b05a36). NO gradients, NO glassmorphism blur, NO
  glow effects.
- Typography: `serif-display` (Fraunces) for headlines/scores, `font-data`
  (JetBrains Mono) for numbers/IDs/timestamps, `eyebrow`/`eyebrow-xs` for
  labels, body text in Karla (default).
- Reuse existing utility classes and tokens from `src/app/globals.css`
  (`card*`, `btn-*`, `index-rule`, `animate-*`, `shadow-*`). Do NOT hardcode
  colours; reference tokens.
- Entrances: use `animate-fade-in` / `animate-slide-up` / `animate-clip-reveal`
  / `animate-scale-in` with staggered `animationDelay`. They already respect
  `prefers-reduced-motion`.

## Tailwind v4 specifics

- This repo uses Tailwind v4 (`@import "tailwindcss"`, `@theme` tokens in
  `globals.css`). Some v3 idioms differ:
  - The `!important` modifier is a TRAILING `!` (`text-[9px]!`), not a prefix.
    Prefer avoiding it by adding a proper utility/token instead.
  - Unlayered custom CSS beats layered utilities. If a utility is being
    overridden by base CSS, add a distinct utility (as done for `eyebrow-xs`).
  - Custom shadow/lift utilities (e.g. `shadow-pop`) require tokens declared in
    `@theme`.

## Risk scoring

- The scoring engine is `computeRiskSummary` in `src/lib/risk-summary.ts` —
  rule-based (rainfall mm, soil moisture %, slope stability), NOT an ML model.
  Do not implement or reference ML models unless explicitly asked.
- Threshold changes must be accompanied by updates to
  `src/lib/__tests__/risk-summary.test.ts`.

## Map

- Leaflet components (`src/components/map/*`) are client-only. Import with
  `next/dynamic({ ssr: false })`.
- Keep the CARTO Voyager light basemap; popups stay warm-paper styled.
- Risk zone fills use `RISK_COLORS` from `src/lib/risk-colors.ts`.

## Testing & quality

- Vitest specs live in `__tests__/` next to what they cover (see
  `src/lib/__tests__/` and `src/components/insights/__tests__/`).
- After changes run: `npm run lint`, `npm run typecheck`, `npm run test`.
  `npm run build` may be impossible in this WSL/Windows environment (mount
  chmod/copyFile limits) — see the WSL note in README; rely on the gates above
  plus CI.

## Environment quirks (WSL + Windows drive)

- `git config` writes FAIL on `/mnt/c` (`chmod on .git/config.lock`). If config
  must change, edit `.git/config` with the file editor directly.
- `npm install` of new packages can fail on chmod of bin files. If needed,
  install tooling outside the mount (e.g. `/tmp/opencode/typedoc`) and run it
  with explicit `--tsconfig`/`--out` paths.
- `next build` needs `NEXT_DIST_DIR=/tmp/distraai` when run on this mount.

## Exploring the codebase

- Prefer `grep`/`glob`/`Read` over `find`/`cat`. For broad questions, delegate
  to the `explore` agent; keep the summary of what/where/why concise.
- Reference code as `path:line` when pointing at specific spots.
- The working branch is `opencode-dev`; `main` holds stable state. Do not
  commit unless asked, and never push without being told.
