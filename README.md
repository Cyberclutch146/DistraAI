# DistraAI

> A field dispatch for disaster intelligence — a prototype dashboard that watches
> flood and landslide risk across a region and tells the story in plain, calm type.

DistraAI is a Next.js disaster-intelligence dashboard. It collects
satellite-era signals — rainfall, soil saturation, slope stability — folds them
into a single 0–100 risk score per zone, and presents the result the way a field
station would: a map, a briefing, a stream of dispatches, ground reports from
people on the ground, and a live responder chat.

The risk surfaces run on bundled sample data, but the seams to a real backend
are already cut. Routes, state, and components talk to a data provider
interface, so swapping mock fixtures for live feeds is a configuration change,
not a rewrite. The community chat at `/chat` has already made that jump — it is
backed by Firebase Authentication and Cloud Firestore.

## The story of the numbers

The heart of the dashboard is `computeRiskSummary` in `src/lib/risk-summary.ts`.
It turns environmental readings into a decision you can act on:

- **Rainfall intensity** — heavy rain in the catchment, measured in millimetres.
- **Soil moisture** — how saturated the ground already is, as a percentage.
- **Slope stability** — whether monitored slopes are already flagged high-risk.

Each factor is weighed against thresholds, combined into a 0–100 score, and
labelled `low` → `moderate` → `high` → `critical`. The same engine drives the
gauge on the dashboard, the zone fills on the map, and the severity bars on the
alerts feed. It is deliberately transparent: you can read every rule in one
small file, adjust a threshold, and see the effect immediately.

## The field dispatch (design)

The interface is built to feel like a well-kept field log rather than a generic
dashboard:

- **Paper, not glass** — a parchment canvas, ink-black type, and a single
  terracotta accent. No gradients, no blur, no glow.
- **Typographic hierarchy** — *Fraunces* for display serifs, *Karla* for body
  text, *JetBrains Mono* for data and coordinates.
- **Earthy risk colours** — moss for low, ochre for moderate, burnt orange for
  high, deep red for critical.
- **Drawn, not typed** — icons are inline SVG in the accent or ink colour. No
  emoji anywhere in the product.
- **Calm motion** — small fade/slide entrances, all disabled for users who
  prefer reduced motion.

Every colour, typeface, and spacing token lives in `src/app/globals.css`.
See [docs/design-system.md](docs/design-system.md).

## The map

A Leaflet canvas atop the standard **OpenStreetMap** basemap, with the required
attribution on every tile layer. Risk zones arrive as GeoJSON polygons, tinted
by risk level, and can be shown combined or split into flood and landslide
layers. Click a zone for its briefing. The map is mounted client-only via
dynamic import to keep the server bundle lean.

The public OSM tile server is fine for development and demos. It is not
appropriate for production traffic — see the
[tile usage policy](https://operations.osmfoundation.org/policies/tiles/) and
switch `TileLayer` in `src/components/map/RiskMap.tsx` to a hosted provider or
your own cache if this goes live.

## The dispatches

- **Alerts** — a severity-barred feed of active warnings, filterable by level.
- **Ground reports** — community messages with locations, typed as reports,
  updates, or questions.
- **Live chat** — a real-time room for responders, backed by Firestore.

Alerts and ground reports stream in styled to match the field-log aesthetic;
the chat is described next.

## Live chat

`/chat` is the one screen backed by a real database. Members sign in with
Google, messages are written to a Firestore collection, and everyone in the
room sees them arrive live via a snapshot listener — no polling, no refresh.

```
AuthProvider (src/state/auth-context.tsx)   →  useAuth()  →  { user, loading, signIn, signOut }
useChat(user)     (src/lib/use-chat.ts)     →  onSnapshot →  messages[]
                    └─ toChatMessages() (src/lib/chat-messages.ts) — pure, unit tested
firestore.rules   →  auth-gated reads, uid must match author, append-only
```

Access control lives in `firestore.rules`, not in the client: any signed-in
user can read the room, but can only write messages stamped with their own uid,
and nothing can be edited or deleted. The database denies everything not
explicitly opened, so a new collection fails closed until it is added there.

To run it, you need a Firebase project and the config in `.env.local`:

```bash
# Firebase Console → enable Authentication (Google) + Cloud Firestore
cp .env.example .env.local     # then paste your NEXT_PUBLIC_FIREBASE_* values
firebase deploy --only firestore:rules
```

Full walkthrough — project setup, the document schema, a line-by-line reading of
the rules, and how to add presence or typing indicators — is in
[docs/realtime.md](docs/realtime.md).

Leaving the config out is safe: the dashboard is unaffected, and `/chat` shows
the setup steps instead of a sign-in button that could not work.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (see **WSL note** below —
dev sometimes binds an explicit port in this workspace).

The dashboard works immediately with no configuration. Chat does not — see
[Live chat](#live-chat) above. `NEXT_PUBLIC_*` values are inlined at build
time, so restart the dev server after changing `.env.local`.

## Environment variables

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `NEXT_PUBLIC_DATA_PROVIDER` | no (`mock`) | `mock` reads fixtures, `api` fetches `/api/*` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | for `/chat` | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | for `/chat` | ” |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | for `/chat` | ” |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | for `/chat` | ” |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | for `/chat` | ” |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | for `/chat` | ” |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | no | Unused; Analytics is not initialised |

See [`.env.example`](.env.example). All of these are `NEXT_PUBLIC_`, so they are
inlined into the client bundle at build time — rebuild after changing them. The
Firebase web config is public by design; `firestore.rules` is the security
boundary.

## Scripts

| Command                | Runs                                                      |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Start the dev server                                      |
| `npm run build`       | Production build (Turbopack)                              |
| `npm run start`       | Serve the production build                                |
| `npm run lint`        | ESLint (flat config)                                      |
| `npm run typecheck`   | `tsc --noEmit`                                            |
| `npm run test`        | Vitest unit tests                                         |
| `npm run docs:components` | Regenerate component docs into `docs/components/`    |

CI runs lint → typecheck → test → build on every push and PR
(`.github/workflows/ci.yml`).

## Architecture in brief

- `src/data/` — shared domain types (`types.ts`) and the sample fixtures that
  stand in for live feeds.
- `src/lib/` — `data-client.ts` (the provider seam), a mock store, the risk
  scoring engine, data hooks, and the Firebase client (`firebase.ts`,
  `use-chat.ts`, `chat-messages.ts`).
- `src/state/` — two contexts: region (synced to `?region=`) and auth (Google
  sign-in).
- `src/components/` — map, gauges, alert, community, and chat surfaces; layout
  chrome.
- `src/app/` — routes, `api/` handlers, and loading/error/not-found states.
- `firestore.rules` — the access control for the one real collection.

Note the split: fixtures flow through `data-client.ts` and never touch a
component directly, while realtime chat talks to Firestore through its own
hooks. The two paths are deliberately separate — see
[docs/data-layer.md](docs/data-layer.md) for where the seam ends.

The full story, including the provider pattern and how to extend it, lives in
[docs/architecture.md](docs/architecture.md) and
[docs/data-layer.md](docs/data-layer.md).

## Reading the docs

The repository keeps its story in `docs/`:

| Doc | What it covers |
| --- | -------------- |
| [docs/design-system.md](docs/design-system.md) | Tokens, type, utilities, component recipes |
| [docs/architecture.md](docs/architecture.md) | Data flow, state, routes, folder map |
| [docs/data-layer.md](docs/data-layer.md) | `mock` vs `api` providers, adding regions |
| [docs/realtime.md](docs/realtime.md) | Firebase auth, the chat log, security rules |
| [docs/risk-scoring.md](docs/risk-scoring.md) | The scoring engine, factors, thresholds |
| [docs/components.md](docs/components.md) | Auto-generated API reference for components |
| [docs/contributing.md](docs/contributing.md) | How to work in this repo |

## Known limitations

- **Sample data, mostly.** Nine Kerala districts carry mock zones and alerts;
  the rest show honest empty states. All API handlers serve the same fixtures.
  Chat is the single exception — it is genuinely persisted.
- **Heuristic scoring.** Risk scores are rule-based and calibrated for
  demonstration, not validated forecasting. The UI says so too.
- **Chat is a prototype room.** One global channel with a 120-message window,
  no per-region rooms, no moderation, and no rate limiting. Details in
  [docs/realtime.md](docs/realtime.md#known-limitations).
- **Security rules are manual.** `firestore.rules` only takes effect once
  deployed with the Firebase CLI; a local `next dev` will not apply them.

## WSL note

Turbopack and Node's `copyFile` cannot write to Windows drives (`/mnt/c`).
For `next build`, prefer Linux (CI) or send the output elsewhere:

```bash
NEXT_DIST_DIR=/tmp/distraai next build
```

(`next.config.ts` reads `NEXT_DIST_DIR` when set. The same mount blocks `npm`
from chmod-ing binaries — installing new dependencies reproduces `EPERM` unless
run on a non-drvfs location.)
