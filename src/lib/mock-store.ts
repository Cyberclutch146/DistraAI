import type {
  Alert,
  CommunityMessage,
  InsightData,
  Region,
  RiskZoneCollection,
  RiskSummary,
  ZoneReport,
} from "@/data/types";
import { REGIONS, findRegion } from "@/data/regions";
import { mockAlerts } from "@/data/mockAlerts";
import { mockRiskZones } from "@/data/mockRiskZones";
import { mockInsights } from "@/data/mockInsights";
import { mockCommunityMessages } from "@/data/mockCommunity";
import { computeRiskSummary } from "./risk-summary";

const ALL_REGION_ID = "kerala";

function filterByRegion<T extends { regionId: string }>(items: T[], regionId?: string): T[] {
  if (!regionId || regionId === ALL_REGION_ID) return items;
  return items.filter((item) => item.regionId === regionId);
}

function filterZonesByRegion(regionId?: string) {
  if (!regionId || regionId === ALL_REGION_ID) return mockRiskZones.features;
  return mockRiskZones.features.filter((zone) => zone.properties.regionId === regionId);
}

export function getMockRegions(): Region[] {
  return REGIONS;
}

export function getMockAlerts(regionId?: string): Alert[] {
  return filterByRegion(mockAlerts, regionId);
}

export function getMockRiskZones(regionId?: string): RiskZoneCollection {
  return {
    type: "FeatureCollection",
    features: filterZonesByRegion(regionId),
  };
}

export function getMockInsights(): InsightData[] {
  return mockInsights;
}

export function getMockCommunity(): CommunityMessage[] {
  return mockCommunityMessages;
}

export function getMockRiskSummary(regionId?: string): RiskSummary | null {
  const region = regionId ? findRegion(regionId) : null;
  if (!region) return null;
  return computeRiskSummary(region, getMockRiskZones(regionId).features, mockInsights);
}

export function getMockZoneReports(regionId?: string): ZoneReport[] {
  const features = getMockRiskZones(regionId).features;
  return features.map((feature) => ({
    id: (feature as { id?: string }).id ?? slugify(feature.properties.name),
    name: feature.properties.name,
    regionId: feature.properties.regionId,
    riskLevel: feature.properties.riskLevel,
    riskType: feature.properties.riskType,
    riskScore: feature.properties.riskScore,
    description: feature.properties.description,
  }));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function isKnownRegion(id?: string): boolean {
  return Boolean(id && findRegion(id));
}