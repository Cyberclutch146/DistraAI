import { describe, expect, it } from "vitest";
import { computeRiskSummary, levelForScore } from "../risk-summary";
import { mockInsights } from "@/data/mockInsights";
import { mockRiskZones } from "@/data/mockRiskZones";
import { findRegion } from "@/data/regions";

const kerala = findRegion("kerala")!;
const wayanad = findRegion("wayanad")!;
const kochi = findRegion("kochi")!;
const mumbai = findRegion("mumbai")!;

function zonesFor(regionId: string) {
  if (regionId === "kerala") return mockRiskZones.features;
  return mockRiskZones.features.filter((zone) => zone.properties.regionId === regionId);
}

describe("levelForScore", () => {
  it("maps scores to calibrated risk levels", () => {
    expect(levelForScore(92)).toBe("critical");
    expect(levelForScore(80)).toBe("critical");
    expect(levelForScore(72)).toBe("high");
    expect(levelForScore(60)).toBe("high");
    expect(levelForScore(47)).toBe("moderate");
    expect(levelForScore(40)).toBe("moderate");
    expect(levelForScore(24)).toBe("low");
  });
});

describe("computeRiskSummary", () => {
  it("returns null when the region has no zones", () => {
    expect(computeRiskSummary(mumbai, zonesFor("mumbai"), mockInsights)).toBeNull();
  });

  it("aggregates Kerala's state-level score from all zones", () => {
    const summary = computeRiskSummary(kerala, zonesFor("kerala"), mockInsights);
    expect(summary).not.toBeNull();
    expect(summary!.score).toBe(60);
    expect(summary!.level).toBe("high");
    expect(summary!.regionName).toBe("Kerala");
    expect(summary!.factors).toHaveLength(3);
  });

  it("reflects Wayanad's critical landslide exposure", () => {
    const summary = computeRiskSummary(wayanad, zonesFor("wayanad"), mockInsights);
    expect(summary!.score).toBe(92);
    expect(summary!.level).toBe("critical");
    const slope = summary!.factors.find((f) => f.label === "Slope stability");
    expect(slope!.value).toBe("Low");
    expect(slope!.level).toBe("high");
  });

  it("produces distinct output per region (selection actually changes data)", () => {
    const a = computeRiskSummary(kerala, zonesFor("kerala"), mockInsights);
    const b = computeRiskSummary(kochi, zonesFor("kochi"), mockInsights);
    const c = computeRiskSummary(wayanad, zonesFor("wayanad"), mockInsights);
    expect(b!.score).toBeGreaterThan(a!.score);
    expect(c!.score).toBeGreaterThan(a!.score);
    expect(c!.level).toBe("critical");
    expect(new Set([a!.level, b!.level, c!.level]).size).toBeGreaterThan(1);
  });
});