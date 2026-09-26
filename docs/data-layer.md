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

## What does *not* go through this seam

The provider seam covers the **fixture-shaped** domain: regions, risk zones,
alerts, insights, community messages, and zone reports. It is deliberately
narrow, and two things sit outside it:

- **Realtime chat.** The `/chat` view reads and writes Firestore directly via
  `useAuth` and `useChat`, with access control in `firestore.rules`. It has its
  own `ChatMessage` type in `src/lib/chat-messages.ts` — deliberately *not*
  `src/data/types.ts`, because chat documents are validated by security rules
  and arrive as untyped Firestore snapshots, not as trusted fixtures.
- **The auth session.** Firebase identity comes from `AuthProvider`, not from a
  data accessor.

Why keep them apart: the accessors return fixture data synchronously and are
safe to render optimistically, while realtime data is asynchronous, mutable, and
gated. Folding a live listener into `useData`'s `{ data, loading, error }`
shape would mean either a second provider mode (`firestore`) that most views do
not need, or a per-accessor capability flag. One extra hook plus one rules file
is cheaper and easier to reason about.

If you later want community reports or alerts to persist through the same
backend, add a `firestore` provider mode here **and** move the chat onto it —
rather than letting two conventions for "fetch data" coexist indefinitely.

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

`InsightData` has no icon field — the interface draws its own inline SVG and
carries no emoji or image slot.

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
- Realtime collections are a separate concern: rules first, then a hook
  ([realtime.md](realtime.md)).
