import type {
  Alert,
  CommunityMessage,
  InsightData,
  Region,
  RiskZoneCollection,
  RiskSummary,
  ZoneReport,
} from "@/data/types";
import {
  getMockAlerts,
  getMockCommunity,
  getMockInsights,
  getMockRegions,
  getMockRiskSummary,
  getMockRiskZones,
  getMockZoneReports,
} from "./mock-store";

export type DataProvider = "mock" | "api";

export function getDataProvider(): DataProvider {
  const configured = process.env.NEXT_PUBLIC_DATA_PROVIDER ?? process.env.DATA_PROVIDER;
  return configured === "api" ? "api" : "mock";
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export function getRegions(): Promise<Region[]> {
  if (getDataProvider() === "api") return apiGet<Region[]>("/api/regions");
  return Promise.resolve(getMockRegions());
}

export function getAlerts(regionId?: string): Promise<Alert[]> {
  if (getDataProvider() === "api") {
    const query = regionId ? `?region=${encodeURIComponent(regionId)}` : "";
    return apiGet<Alert[]>(`/api/alerts${query}`);
  }
  return Promise.resolve(getMockAlerts(regionId));
}

export function getRiskZones(regionId?: string): Promise<RiskZoneCollection> {
  if (getDataProvider() === "api") {
    const query = regionId ? `?region=${encodeURIComponent(regionId)}` : "";
    return apiGet<RiskZoneCollection>(`/api/zones${query}`);
  }
  return Promise.resolve(getMockRiskZones(regionId));
}

export function getInsights(): Promise<InsightData[]> {
  if (getDataProvider() === "api") return apiGet<InsightData[]>("/api/insights");
  return Promise.resolve(getMockInsights());
}

export function getCommunity(): Promise<CommunityMessage[]> {
  if (getDataProvider() === "api") return apiGet<CommunityMessage[]>("/api/community");
  return Promise.resolve(getMockCommunity());
}

export function getRiskSummary(regionId: string): Promise<RiskSummary | null> {
  if (getDataProvider() === "api") {
    const query = `?region=${encodeURIComponent(regionId)}`;
    return apiGet<RiskSummary | null>(`/api/risk-summary${query}`);
  }
  return Promise.resolve(getMockRiskSummary(regionId));
}

export function getZoneReports(regionId?: string): Promise<ZoneReport[]> {
  if (getDataProvider() === "api") {
    const query = regionId ? `?region=${encodeURIComponent(regionId)}` : "";
    return apiGet<ZoneReport[]>(`/api/reports${query}`);
  }
  return Promise.resolve(getMockZoneReports(regionId));
}