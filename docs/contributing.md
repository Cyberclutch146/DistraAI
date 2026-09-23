# Contributing

DistraAI is a small, opinionated codebase. Read
[architecture.md](architecture.md) and [design-system.md](design-system.md)
first — most of the "rules" here are implicit in those docs.

## Setup

```bash
npm install
npm run dev        # http://localhost:3001
```

If you are on WSL against a Windows drive (`/mnt/c`):

- `npm install` of *new* packages may fail with `EPERM`/chmod errors — run
  installs on a Linux path or in the container.
- `next build` needs `NEXT_DIST_DIR=/tmp/distraai` (see README's WSL note).

## Branches

- `main` holds stable, released state.
- `opencode-dev` is the working branch for anything built with an AI coding
  assistant. Commit there; merge to `main` when a slice is stable.

Suggested PR flow:

1. Branch from `opencode-dev` (or push to it directly).
2. Make focused commits with conventional messages (below).
3. Open the PR early; the title names the slice.

## Commit messages

Use conventional commits so the log reads like a changelog:

```
feat: add per-region risk zone overlay
fix: clamp sparkline threshold to the chart area
refactor: route alerts through the data client
style: warm editorial pass on the dashboard
docs: document the risk scoring engine
test: cover soil moisture thresholds
```

One logical change per commit. No A.I.-style commentary ("Generated with…")
— the diff speaks for itself.

## Code conventions

- **Data access.** Never import fixtures from `src/data/` in a component. Call
  accessors from `src/lib/data-client.ts` through `useData`.
- **Tokens only.** Colours, radii, and shadows come from `globals.css` tokens.
  No hardcoded hex, no arbitrary values where a token exists.
- **Design language.** Warm paper, Fraunces/Karla/JetBrains Mono, one
  terracotta accent. No gradients, no glass, no glow. Reuse the helpers in
  [design-system.md](design-system.md).
- **Client-only modules.** Anything touching the browser (Leaflet especially)
  is imported with `next/dynamic({ ssr: false })`.
- **State.** Component-local `useState` unless it must be shared; region is the
  only global, via `RegionProvider`.

## Quality gates

CI enforces, and local dev should honour, these four:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

- Vitest specs live in `__tests__/` next to the code they cover. If you touch
  scoring rules, data accessors, or `Sparkline` math, extend the matching test.
- Keep the tree able to build on Ubuntu (the CI runner). Windows-mount build
  failures here are environment quirks, not code problems.

## Documentation

- `npm run docs:components` regenerates the component API reference
  ([components.md](components.md)).
- Feature or behaviour changes usually deserve a line in the relevant docs/
  file and, for bigger shifts, the README.

## Pull request checklist

- [ ] Wire up through `data-client.ts` (no direct fixture imports).
- [ ] Uses design tokens and the editorial helpers.
- [ ] `lint`, `typecheck`, `test` pass.
- [ ] Behavior changes are covered by a Vitest test.
- [ ] Docs touched if public behaviour changed.