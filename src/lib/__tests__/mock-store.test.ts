import { describe, expect, it } from "vitest";
import {
  getMockAlerts,
  getMockCommunity,
  getMockRegions,
  getMockRiskSummary,
  getMockRiskZones,
  getMockZoneReports,
} from "../mock-store";

describe("getMockAlerts", () => {
  it("returns all alerts without a region filter", () => {
    expect(getMockAlerts()).toHaveLength(9);
  });

  it("returns all alerts for the state-level Kerala region", () => {
    expect(getMockAlerts("kerala")).toHaveLength(9);
  });

  it("filters alerts to a single district", () => {
    const alerts = getMockAlerts("wayanad");
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe("critical");
    expect(alerts[0].regionId).toBe("wayanad");
  });

  it("returns none for unmonitored regions", () => {
    expect(getMockAlerts("mumbai")).toHaveLength(0);
  });

  it("counts the true critical alerts (ground truth is 1)", () => {
    const critical = getMockAlerts().filter((alert) => alert.severity === "critical");
    expect(critical).toHaveLength(1);
  });
});

describe("getMockRiskZones", () => {
  it("filters zones per selected region", () => {
    const kerala = getMockRiskZones("kerala");
    const kochi = getMockRiskZones("kochi");
    expect(kerala.features).toHaveLength(9);
    expect(kochi.features).toHaveLength(1);
    expect(kochi.features[0].properties.name).toBe("Kochi Metro");
  });
});

describe("getMockRiskSummary", () => {
  it("returns null for regions without zones", () => {
    expect(getMockRiskSummary("mumbai")).toBeNull();
    expect(getMockRiskSummary("unknown-region")).toBeNull();
  });

  it("derives district summaries from the district's own zones", () => {
    const summary = getMockRiskSummary("wayanad");
    expect(summary!.level).toBe("critical");
    expect(summary!.score).toBe(92);
  });
});

describe("getMockZoneReports", () => {
  it("returns one report per monitored zone for the region", () => {
    expect(getMockZoneReports("kerala")).toHaveLength(9);
    expect(getMockZoneReports("idukki")).toHaveLength(1);
  });

  it("returns empty reports for unmonitored regions", () => {
    expect(getMockZoneReports("assam")).toHaveLength(0);
  });
});

describe("getMockRegions / getMockCommunity", () => {
  it("exposes regions and community messages through the data layer", () => {
    expect(getMockRegions().length).toBeGreaterThanOrEqual(7);
    expect(getMockCommunity().length).toBeGreaterThan(0);
  });
});