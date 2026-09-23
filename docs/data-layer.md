# Data Layer — mock and api providers

Components never touch data files directly. They call typed accessors on
`src/lib/data-client.ts`, which resolves a provider from
`NEXT_PUBLIC_DATA_PROVIDER`:

| Value      | Behaviour                                                        |
| ---------- | ---------------------------------------------------------------- |
| `mock`     | (default) Serves `src/data/` fixtures straight from memory.      |
| `api`      | Fetches from the `/api/*` route handlers, which currently serve the same fixtures. |

Switching to live data means keeping the accessor signatures and implementing
each function against your backend — components and hooks do not change.

## Accessors

```ts
getRegions(): Region[]
getRiskZones(regionId): RiskZoneCollection
getAlerts(regionId): Promise<Alert[]>
getInsights(regionId): Promise<InsightData[]>
getCommunity(): Promise<CommunityMessage[]>
getZoneReports(regionId): ZoneReport[]
```

`useData(fetcher, deps)` (`src/lib/use-data.ts`) turns any of these into
`{ data, loading, error }`, refetching when `deps` change.

## Fixtures

`src/data/` holds the domain types (`types.ts`) and the sample data:

| File                | What it provides                                  |
| ------------------- | ------------------------------------------------- |
| `regions.ts`        | Kerala districts + their map centering            |
| `mockRiskZones.ts`  | GeoJSON risk zones per region                     |
| `mockAlerts.ts`     | Active alerts per region                          |
| `mockInsights.ts`   | Live sensor-look insights (rainfall, soil, etc.)  |
| `mockCommunity.ts`  | Ground reports from the community                 |

Kerala's nine districts carry full fixtures; other regions resolve to empty
results, which the UI renders as honest empty states.

## Adding a region

1. Add a `Region` entry in `src/data/regions.ts` (id, name, sub label, map
   center/zoom).
2. Optionally add matching entries to `mockRiskZones.ts`, `mockAlerts.ts`,
   `mockInsights.ts`, and report fixtures — keyed by `regionId`.
3. `getRiskZones` will now return zones for the new id, and the layout renders
   correct empty states if you skip step 2.

## Swapping in a backend

- Keep `NEXT_PUBLIC_DATA_PROVIDER` unset or `api`.
- The `/api/*` route handlers (`src/app/api/`) are thin proxies over the mock
  store today. Replace their bodies with real queries while returning the exact
  same shapes defined in `src/data/types.ts`.
- The UI consumes API responses through the same accessor types, so a swap is
  invisible to components.

## Conventions

- Never import fixture files from a component — always go through
  `data-client.ts`.
- Keep returned shapes identical to `src/data/types.ts` across providers.
- Add tests beside the store (Vitest) — see the existing suite in
  `src/lib/__tests__/mock-store.test.ts`.