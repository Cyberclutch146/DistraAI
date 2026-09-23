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

## What is covered

| Area           | Components / functions                                             |
| -------------- | ------------------------------------------------------------------ |
| Alerts         | `AlertsFeed` (default), `AlertCard`, `AlertsSkeleton`, `AlertsError` |
| Community      | `CommunityPreview` (default), `MessageCard`, `CommunitySkeleton`   |
| Insights       | `InsightCards`, `Sparkline`, `computeThresholdY`                   |
| Layout         | `TopNav`, `Footer`, `LocationSelector`                             |
| Map            | `RiskMap`, `LayerToggle`, `LayerToggle.RiskLayer`, `MapLegend`     |
| Risk           | `RiskGauge`, `RiskScorePanel`                                      |

> Note: the generator may emit warnings about props referenced from
> `src/data/types.ts` (e.g. `Alert`, `RiskLevel`). That is expected — the
> component pages link to those types in prose; the generated pages still
> document every prop where it is used.