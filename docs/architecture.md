# Architecture — How the app is put together

DistraAI is a Next.js 16 App Router application built with React 19, TypeScript,
Tailwind CSS v4, and Leaflet. This document walks the data flow, state, routing,
and folder layout.

## At a glance

```
src/
├── data/            Domain types + sample fixtures (keyed by region)
├── lib/             Data client, mock store, risk engine, hooks
├── state/           Region context (synced to ?region= URL param)
├── components/      Map, gauges, feeds, layout chrome
└── app/             Routes + api/ handlers + error/loading/not-found states
```

## Data flow

```
Component ── useData(fetcher) ──► data-client ──► provider (mock | api)
                                                │
   getAlerts / getRiskZones / getInsights /      │
   getZoneReports / getCommunity / getRegions ◄──┘
              │
              ▼
       (loading | data | error)
```

- Components never import mock fixtures. They call typed accessors from
  `src/lib/data-client.ts`.
- `useData` (`src/lib/use-data.ts`) wraps a fetcher and returns
  `{ data, loading, error }`, re-running when its dependency array changes.
- The active provider is chosen at runtime by `NEXT_PUBLIC_DATA_PROVIDER`
  (defaults to `mock`). See [data-layer.md](data-layer.md).
- The `mock` provider reads from `src/lib/mock-store.ts`, which serves the
  fixture collections in `src/data/`.

## State

- **Region** — `RegionProvider` (`src/state/region-context.tsx`) holds the
  selected region and syncs it to the `?region=` URL parameter, so a dashboard
  view is shareable. Consumers use `useRegion()`.
- **Transient UI state** — map layers, alert filters, the location picker's
  open/closed state all stay local to their components with `useState`. There is
  no global store.

## Routing and views

| Route          | View                        | Data                                  |
| -------------- | --------------------------- | ------------------------------------- |
| `/`            | Home (field-log landing)    | —                                     |
| `/dashboard`   | Briefing + map + feeds      | zones, insights, alerts, community    |
| `/map`         | Full-screen risk map        | risk zones per region                 |
| `/alerts`      | Full alerts feed            | alerts per region                     |
| `/community`   | Ground reports              | community messages                    |
| `/reports`     | Per-zone written reports    | zone reports per region               |

Every view mounts `TopNav` + `Footer`. Loading and error states are handled
inline by `useData` consumers; `not-found.tsx` and `global-error.tsx` carry the
same editorial voice.

## The map

`src/components/map/RiskMap.tsx` is mounted **client-only** through
`next/dynamic({ ssr: false })` because Leaflet touches the DOM. It renders:

- A **CARTO Voyager** light basemap.
- A `GeoJSON` overlay of risk zones tinted by `RISK_COLORS[riskLevel]`.
- Layer toggling between `flood`, `landslide`, and `combined` zones.
- Popups (warm paper styled) with the zone name, level, score, and description.

The map recenters when the selected region changes and re-fetches zones per
region.

## Styling pipeline

- Tokens live in `src/app/globals.css` (`@theme` block plus unlayered base
  styles). Tailwind v4 generates utilities on top.
- Fonts are loaded in `src/app/layout.tsx` and exposed as CSS variables.
- Components compose utilities; colours always reference tokens, never
  hardcoded values. See [design-system.md](design-system.md).

## Scripts & CI

- `npm run lint` / `typecheck` / `test` / `build` — the CI gates, run via
  GitHub Actions on Ubuntu (`.github/workflows/ci.yml`).
- `npm run docs:components` — regenerates the API reference in
  `docs/components/` with TypeDoc.
- Tests are Vitest, colocated in `__tests__/` next to the code they cover
  (e.g. `src/lib/__tests__/risk-summary.test.ts`).

## Extending

The cheapest wins, in order:

1. **New data** — add fixtures and register them with the mock store
   ([data-layer.md](data-layer.md)).
2. **New region** — add a `Region` entry and (optionally) fixtures
   ([data-layer.md](data-layer.md)).
3. **Real backend** — implement the provider functions (`src/lib/data-client.ts`)
   against your API and set `NEXT_PUBLIC_DATA_PROVIDER=api`
   ([data-layer.md](data-layer.md)).
4. **Real risk model** — keep the `computeRiskSummary` contract and replace the
   heuristics inside ([risk-scoring.md](risk-scoring.md)).