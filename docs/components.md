# Component Reference

The per-component API reference (props, exported functions, types) is generated
automatically with TypeDoc from the TypeScript source in `src/components/`.

## Viewing

- Start here: [docs/components/README.md](components/README.md)
- Each component also has a folder, e.g.
  [components/risk/RiskGauge](components/risk/RiskGauge/README.md).

## Regenerating

```bash
npm run docs:components
```

This runs TypeDoc with the `typedoc-plugin-markdown` plugin and rewrites
`docs/components/` in place. Keep the generated tree in version control — it is
the canonical, up-to-date API map for the components.

The script passes `--readme none` deliberately. Without it TypeDoc inlines the
repository README into the index page and copies every doc it links to into
`docs/components/_media/`, which duplicates the whole documentation set inside
the generated tree. The generated index is meant to be a component map, not a
second copy of `docs/`.

## What is covered

| Area           | Components / functions                                             |
| -------------- | ------------------------------------------------------------------ |
| Alerts         | `AlertsFeed` (default), `AlertCard`, `AlertsSkeleton`, `AlertsError` |
| Chat           | `ChatRoom` (default)                                                |
| Community      | `CommunityPreview` (default), `MessageCard`, `CommunitySkeleton`   |
| Insights       | `InsightCards`, `Sparkline`, `computeThresholdY`                   |
| Layout         | `TopNav`, `Footer`, `LocationSelector`                             |
| Map            | `RiskMap`, `LayerToggle`, `LayerToggle.RiskLayer`, `MapLegend`     |
| Risk           | `RiskGauge`, `RiskScorePanel`                                      |

> Note: the generator may emit warnings about props referenced from
> `src/data/types.ts` (e.g. `Alert`, `RiskLevel`). That is expected — the
> component pages link to those types in prose; the generated pages still
> document every prop where it is used.

## What is not covered

TypeDoc only sees **exported** symbols. `ChatRoom.tsx` is a good example: the
component's internals — `Avatar`, `MessageBubble`, `Composer`, `SignInGate`,
`ChatSkeleton`, `OnlineDot`, and `formatChatTime` — are module-private, so the
generated page shows only the default export's props (it takes none) and its
behaviour note. That is intentional: the internals are free to change without a
docs churn.

Types and hooks outside `src/components/` are also absent from this tree. They
live in prose instead:

- Chat message shapes and `toChatMessages` — [realtime.md](realtime.md)
- Auth context (`useAuth`) — [realtime.md](realtime.md#identity--srcstateauth-contexttsx)
- Data accessors and providers — [data-layer.md](data-layer.md)
