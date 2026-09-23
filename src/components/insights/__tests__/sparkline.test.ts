import { describe, expect, it } from "vitest";
import { computeThresholdY } from "../Sparkline";

const PADDING = 2;
const HEIGHT = 48;

describe("computeThresholdY", () => {
  it("keeps a threshold above the data range clamped to the chart top", () => {
    const y = computeThresholdY(90, 62, 87, PADDING, HEIGHT);
    expect(y).toBeGreaterThanOrEqual(PADDING);
    expect(y).toBeLessThanOrEqual(HEIGHT - PADDING);
  });

  it("keeps a threshold below the data range clamped to the chart bottom", () => {
    const y = computeThresholdY(1, 7.1, 9.2, PADDING, HEIGHT);
    expect(y).toBe(HEIGHT - PADDING);
  });

  it("renders a mid-range threshold inside the visible chart area", () => {
    const y = computeThresholdY(80, 62, 87, PADDING, HEIGHT);
    expect(y).toBeGreaterThan(PADDING);
    expect(y).toBeLessThan(HEIGHT - PADDING);
  });

  it("is deterministic and unaffected by the broken double-normalization", () => {
    const soil = computeThresholdY(90, 62, 87, PADDING, HEIGHT);
    const river = computeThresholdY(9.5, 7.1, 9.2, PADDING, HEIGHT);
    expect(soil).toBeGreaterThanOrEqual(PADDING);
    expect(river).toBeGreaterThanOrEqual(PADDING);
  });
});