# DistraAI

> A field dispatch for disaster intelligence — a prototype dashboard that watches
> flood and landslide risk across a region and tells the story in plain, calm type.

DistraAI is a Next.js disaster-intelligence dashboard prototype. It collects
satellite-era signals — rainfall, soil saturation, slope stability — folds them
into a single 0–100 risk score per zone, and presents the result the way a field
station would: a map, a briefing, a stream of dispatches, and ground reports from
people on the ground.

Everything runs on bundled sample data today, but the seams to a real backend are
already cut. Routes, state, and components talk to a data provider interface, so
swapping mock fixtures for live feeds is a configuration change, not a rewrite.

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
- **Calm motion** — small fade/slide entrances, all disabled for users who
  prefer reduced motion.

Every colour, typeface, and spacing token lives in `src/app/globals.css`.
See [docs/design-system.md](docs/design-system.md).

## The map

A Leaflet canvas atop a **CARTO Voyager** basemap. Risk zones arrive as GeoJSON
polygons, tinted by risk level, and can be shown combined or split into flood and
landslide layers. Click a zone for its briefing. The map is mounted
client-only via dynamic import to keep the server bundle lean.

## The dispatches

- **Alerts** — a severity-barred feed of active warnings, filterable by level.
- **Ground reports** — community messages with locations, typed as reports,
  updates, or questions.

Both stream in styled to match the field-log aesthetic.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (see **WSL note** below —
dev sometimes binds an explicit port in this workspace).

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
  scoring engine, and data hooks.
- `src/state/` — the region context, synced to the `?region=` URL parameter.
- `src/components/` — map, gauges, alert and community feeds, layout chrome.
- `src/app/` — routes, `api/` handlers, and loading/error/not-found states.

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
| [docs/risk-scoring.md](docs/risk-scoring.md) | The scoring engine, factors, thresholds |
| [docs/components.md](docs/components.md) | Auto-generated API reference for components |
| [docs/contributing.md](docs/contributing.md) | How to work in this repo |

## Known limitations

- **Sample data only.** Nine Kerala districts carry mock zones and alerts; the
  rest show honest empty states. All API handlers serve the same fixtures.
- **Heuristic scoring.** Risk scores are rule-based and calibrated for
  demonstration, not validated forecasting. The UI says so too.
- **No persistence.** Community reports and alerts live in memory and reset on
  reload.

## WSL note

Turbopack and Node's `copyFile` cannot write to Windows drives (`/mnt/c`).
For `next build`, prefer Linux (CI) or send the output elsewhere:

```bash
NEXT_DIST_DIR=/tmp/distraai next build
```

(`next.config.ts` reads `NEXT_DIST_DIR` when set. The same mount blocks `npm`
from chmod-ing binaries — installing new dependencies reproduces `EPERM` unless
run on a non-drvfs location.)