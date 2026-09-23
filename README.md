# DistraAI

A Next.js disaster intelligence dashboard prototype. It visualizes risk zones,
active alerts, and live sensor insights per region, backed by bundled sample
data. All routes are browsable with an in-memory data source; the API route
handlers exist so a real backend can be swapped in.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, and Leaflet.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Runs                                                        |
| -------------------- | ----------------------------------------------------------- |
| `npm run dev`        | Start the dev server                                        |
| `npm run build`      | Production build (Turbopack)                                |
| `npm run start`      | Serve the production build                                  |
| `npm run lint`       | ESLint (flat config)                                        |
| `npm run typecheck`  | `tsc --noEmit`                                              |
| `npm run test`       | Vitest unit tests                                           |

CI runs lint → typecheck → test → build on every push/PR
(`.github/workflows/ci.yml`).

## Data source

Components read data through `src/lib/data-client.ts`, which resolves a data
provider from `NEXT_PUBLIC_DATA_PROVIDER` (default `mock`, see `.env.example`):

- `mock` — bundled sample fixtures served directly to the app.
- `api` — fetches from the `/api/*` route handlers, which currently serve the
  same sample fixtures. Replace these handlers with real database queries when
  a backend is ready.

## Structure

- `src/data/` — shared domain types and sample fixtures, keyed by region.
- `src/lib/` — data client, mock store, risk-score computation, and hooks.
- `src/state/` — region selection context (synced to the `?region=` URL param).
- `src/components/` — dashboards widgets, map, layout.
- `src/app/` — routes plus `api/` handlers and loading/error/not-found states.

Every region is selectable from the global location picker. Kerala's nine
districts carry sample risk zones and alerts; other regions show empty states.

## WSL note

Turbopack and Node's `copyFile` cannot write to Windows drives (`/mnt/c`).
For `next build`, prefer running it on Linux (CI) or point the output elsewhere:

```bash
NEXT_DIST_DIR=/tmp/distraai next build
```

(`next.config.ts` reads `NEXT_DIST_DIR` when set.)