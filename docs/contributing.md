# Contributing

DistraAI is a small, opinionated codebase. Read
[architecture.md](architecture.md) and [design-system.md](design-system.md)
first — most of the "rules" here are implicit in those docs.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

The dashboard runs with no configuration. The `/chat` view needs a Firebase
project — see [realtime.md](realtime.md) and copy `.env.example` to
`.env.local`.

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
  accessors from `src/lib/data-client.ts` through `useData`. Chat is the
  documented exception and talks to Firestore via `useChat` instead — see
  [realtime.md](realtime.md) and the boundary note in
  [data-layer.md](data-layer.md).
- **Tokens only.** Colours, radii, and shadows come from `globals.css` tokens.
  No hardcoded hex, no arbitrary values where a token exists. Text on an accent
  fill uses `text-text-on-accent` (and `/60` for de-emphasis). The two known
  exceptions — the Leaflet popup HTML string and `RISK_COLORS` — are documented
  in [design-system.md](design-system.md#known-exceptions).
- **No emoji.** Icons are inline SVG with `stroke="currentColor"` and
  `aria-hidden`, sized by Tailwind. Do not add an `icon` field to a data type
  or a label table to hold a glyph. See
  [design-system.md](design-system.md#icons-and-glyphs).
- **Design language.** Warm paper, Fraunces/Karla/JetBrains Mono, one
  terracotta accent. No gradients, no glass, no glow. Reuse the helpers in
  [design-system.md](design-system.md).
- **Client-only modules.** Anything touching the browser (Leaflet especially)
  is imported with `next/dynamic({ ssr: false })`.
- **Firebase is client-only.** `src/lib/firebase.ts` calls `initializeApp` and
  `getAuth` at module load. Never import it — directly or transitively — from a
  server component, a route handler, or any module without `"use client"`. All
  `NEXT_PUBLIC_FIREBASE_*` values are inlined into the browser bundle; that is
  expected, and `firestore.rules` (not the config) is the security boundary.
- **`auth` and `db` can be null.** They are null when the build had no Firebase
  config. Never assume otherwise, and never add a second unguarded call into
  that path: `getAuth()` throws on an empty config, and `AuthProvider` is in
  the root layout, so a regression here 500s every route. A fresh clone without
  `.env.local` must render the whole dashboard.
- **State.** Component-local `useState` unless it must be shared. The two
  globals are region (`RegionProvider`) and auth (`AuthProvider`); there is no
  global store.
- **Gate on auth loading.** Components using `useAuth()` must branch on
  `loading` before `user`, or a signed-in user sees the sign-in gate flash.

## Firestore rules are part of the code

`firestore.rules` is reviewed like application code:

- The database is **deny-by-default**. A new collection fails closed until it
  has a `match` block, so add the block in the same PR as the feature.
- Rules are deployed with the Firebase CLI, not by `next dev`/`next build`. A
  change that is not deployed is not in effect.
- Changing a rule means updating [realtime.md](realtime.md).
- Never widen a rule to work around a client bug; fix the client.

## Quality gates

CI enforces, and local dev should honour, these four:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

- Vitest specs live in `__tests__/` next to the code they cover. If you touch
  scoring rules, data accessors, `Sparkline` math, or the chat message mapping,
  extend the matching test.
- The Vitest environment is `node` (no jsdom, no testing-library). Keep new
  logic in pure, SDK-free modules that can be tested directly — that is why
  `toChatMessages` lives in `src/lib/chat-messages.ts` rather than inside
  `use-chat.ts`.
- Keep the tree able to build on Ubuntu (the CI runner). Windows-mount build
  failures here are environment quirks, not code problems.

## Documentation

- `npm run docs:components` regenerates the component API reference
  ([components.md](components.md)). Re-run it when you add, rename, or change
  the props of anything exported from `src/components/`.
- Feature or behaviour changes usually deserve a line in the relevant docs/
  file and, for bigger shifts, the README.
- If you add a fixture, a route, a token, or a rules block, update the matching
  table — the docs are hand-maintained and drift is the main source of rot.

## Pull request checklist

- [ ] Wire up through `data-client.ts` (no direct fixture imports), or through
      `useAuth`/`useChat` for realtime.
- [ ] Uses design tokens and the editorial helpers; no emoji.
- [ ] `lint`, `typecheck`, `test` pass.
- [ ] Behaviour changes are covered by a Vitest test.
- [ ] New Firestore collection has a `match` block in `firestore.rules`.
- [ ] `npm run docs:components` re-run if `src/components/` changed.
- [ ] Docs touched if public behaviour changed.
