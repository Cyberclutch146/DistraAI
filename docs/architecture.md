# Architecture — How the app is put together

DistraAI is a Next.js 16 App Router application built with React 19, TypeScript,
Tailwind CSS v4, Leaflet, and Firebase. This document walks the data flow, state,
routing, and folder layout.

## At a glance

```
src/
├── data/            Domain types + sample fixtures (keyed by region)
├── lib/             Data client, mock store, risk engine, data hooks,
│                    Firebase client + chat hooks
├── state/           Region context (synced to ?region=), auth context
├── components/      Map, gauges, feeds, chat, layout chrome
└── app/             Routes + api/ handlers + error/loading/not-found states

firestore.rules      Access control for the one real (Firestore) collection
firebase.json        Points the CLI at the rules file
```

## Data flow

The app has **two** data paths, and they are deliberately separate.

### 1. Fixtures (everything except chat)

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

### 2. Realtime (chat only)

```
useAuth()  ──► user
     │
     ▼
useChat(user) ──► onSnapshot(Firestore) ──► toChatMessages() ──► messages[]
     │
     └────────► addDoc(Firestore)       ◄── sendMessage(text)
```

- This path does **not** go through `data-client.ts`. Firestore has its own
  client (`src/lib/firebase.ts`), its own hook (`src/lib/use-chat.ts`), and its
  own access control (`firestore.rules`).
- The snapshot arrives as untyped `DocumentData`; `toChatMessages` in
  `src/lib/chat-messages.ts` maps it to `ChatMessage[]` and is kept in a
  separate, SDK-free module so it can be unit tested in a plain Node
  environment.
- The listener is gated on a signed-in `user`, and always passes an
  `onSnapshot` error callback: the rules deny anonymous reads, and an unhandled
  listener error would otherwise leave the room silently empty.

Full setup and the security model: [realtime.md](realtime.md).

## State

Two React contexts, both global; everything else is component-local.

- **Region** — `RegionProvider` (`src/state/region-context.tsx`) holds the
  selected region and syncs it to the `?region=` URL parameter, so a dashboard
  view is shareable. Consumers use `useRegion()`.
- **Auth** — `AuthProvider` (`src/state/auth-context.tsx`) resolves the current
  Firebase user via `onAuthStateChanged` and exposes
  `{ user, loading, configured, signIn, signOut }` through `useAuth()`. It is
  mounted once in `src/app/layout.tsx`, so it is available app-wide even though
  only `/chat` consumes it today. Gate UI on `loading` to avoid flashing the
  sign-in gate for an already-signed-in user. `configured` is `false` when the
  build had no Firebase credentials — the provider then initialises nothing and
  reports a signed-out state, because `getAuth()` throws on an empty config and
  this context sits in the root layout.
- **Transient UI state** — map layers, alert filters, the location picker's
  open/closed state, and the chat composer draft all stay local to their
  components with `useState`. There is no global store.

## Routing and views

| Route          | View                        | Data                                  |
| -------------- | --------------------------- | ------------------------------------- |
| `/`            | Home (field-log landing)    | —                                     |
| `/dashboard`   | Briefing + map + feeds      | zones, insights, alerts, community    |
| `/map`         | Full-screen risk map        | risk zones per region                 |
| `/alerts`      | Full alerts feed            | alerts per region                     |
| `/community`   | Ground reports              | community messages                    |
| `/chat`        | Live responder chat         | **Firestore `chat_messages`**         |
| `/reports`     | Per-zone written reports    | zone reports per region               |

Every view mounts `TopNav` + `Footer`. Each route is a thin server `page.tsx`
(reading `?region=`, wrapping in `RegionProvider`, exporting `metadata`)
delegating to a client `view.tsx` that holds the interactive parts — `chat/`
follows the same split. Loading and error states are handled inline by
`useData` consumers; `not-found.tsx` and `global-error.tsx` carry the same
editorial voice.

The six `navItems` in `src/components/layout/TopNav.tsx` are the single source
of truth for the top navigation; adding a route means adding it there too.

## The map

`src/components/map/RiskMap.tsx` is mounted **client-only** through
`next/dynamic({ ssr: false })` because Leaflet touches the DOM. It renders:

- The standard **OpenStreetMap** raster basemap with attribution
  (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). This is the public tile
  server — fine for development, not for production traffic; see the
  [tile usage policy](https://operations.osmfoundation.org/policies/tiles/).
- A `GeoJSON` overlay of risk zones tinted by `RISK_COLORS[riskLevel]`.
- Layer toggling between `flood`, `landslide`, and `combined` zones.
- Popups (warm paper styled) with the zone name, level, score, and description.

Zone popups are built as an HTML **string** with inline `style` attributes,
because Leaflet takes markup rather than JSX. That is the one place in the app
where a colour is written as a literal instead of a token — the values mirror
the `--text-*` and `--border-*` tokens by hand.

The map recenters when the selected region changes and re-fetches zones per
region.

## Styling pipeline

- Tokens live in `src/app/globals.css` (`@theme` block plus unlayered base
  styles). Tailwind v4 generates utilities on top.
- Fonts are loaded in `src/app/layout.tsx` and exposed as CSS variables.
- Components compose utilities; colours always reference tokens, never
  hardcoded values — including text on accent fills, which uses
  `text-text-on-accent`. Icons are inline SVG, never emoji.
- See [design-system.md](design-system.md).

## Scripts & CI

- `npm run lint` / `typecheck` / `test` / `build` — the CI gates, run via
  GitHub Actions on Ubuntu (`.github/workflows/ci.yml`).
- `npm run docs:components` — regenerates the API reference in
  `docs/components/` with TypeDoc.
- Tests are Vitest, colocated in `__tests__/` next to the code they cover
  (e.g. `src/lib/__tests__/risk-summary.test.ts`). The test environment is
  `node`, so pure logic is factored into SDK-free modules
  (`src/lib/chat-messages.ts`) rather than tested through a DOM.

## Extending

The cheapest wins, in order:

1. **New data** — add fixtures and register them with the mock store
   ([data-layer.md](data-layer.md)).
2. **New region** — add a `Region` entry and (optionally) fixtures
   ([data-layer.md](data-layer.md)).
3. **Real backend** — implement the provider functions (`src/lib/data-client.ts`)
   against your API and set `NEXT_PUBLIC_DATA_PROVIDER=api`
   ([data-layer.md](data-layer.md)).
4. **A new realtime feature** — presence, typing indicators, per-region rooms:
   add a rules block first, then a hook ([realtime.md](realtime.md#extending)).
   Rules are deny-by-default, so the feature fails closed without them.
5. **Real risk model** — keep the `computeRiskSummary` contract and replace the
   heuristics inside ([risk-scoring.md](risk-scoring.md)).
