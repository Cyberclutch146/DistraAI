# Risk Scoring — the rules that make the numbers

All risk numbers on the dashboard, map, and reports come from one small engine:
`src/lib/risk-summary.ts`. It is deliberately rule-based and readable — the goal
is transparency, not forecasting.

## From readings to a score

For a region, the engine combines three factors:

| Factor             | Input                                    | Thresholds → level              |
| ------------------ | ---------------------------------------- | ------------------------------- |
| Rainfall intensity | latest `rainfall` insight (mm)           | ≥150 critical · ≥100 high · ≥60 moderate |
| Soil moisture      | latest `soil-saturation` insight (%)     | ≥90 critical · ≥80 high · ≥60 moderate |
| Slope stability    | any zones already `high`/`critical` landslide risk | affects average + trend |

The average risk score of the region's zones (from their `riskScore` properties)
drives three outputs:

- **Label** — `levelForScore`: `≥80 critical`, `≥60 high`, `≥40 moderate`,
  else `low`.
- **Trend** — `up` when any zone is critical or the average is high, otherwise
  `stable`.
- **Confidence** — a pseudo-confidence that rises with the average score,
  capped at 99%. It communicates *model* uncertainty about the reading, not
  statistical error.

The engine returns a `RiskSummary` (see `src/data/types.ts`) containing the
score, level, trend, confidence, timestamp, and the three factor rows shown in
the dashboard's `RiskScorePanel`.

## Why heuristics?

This is a prototype. The rules are calibrated to produce plausible numbers for
demonstration and to be *legible* — anyone can open the file and change a
threshold. The UI never hides this: the dashboard and footer note that scores
are estimates for planning and training only.

## Replacing with a real model

The contract to keep is the `RiskSummary` return type. To swap in an ML model:

1. Keep `computeRiskSummary(region, zones, insights)` as the entry point.
2. Replace the factor thresholds with your model's outputs (or make the factors
   scores separately and combine them).
3. Update `confidence` to reflect the model's actual calibration if available.
4. Everything downstream — gauge, panel, map fills, reports — renders whatever
   `RiskSummary` says, no changes needed.

## Tests

The scoring rules are covered by Vitest in
`src/lib/__tests__/risk-summary.test.ts` — extend it whenever a threshold
changes, so a tweak to the rules can never silently move the pins on the map.