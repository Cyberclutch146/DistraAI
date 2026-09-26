export type RiskLevel = "low" | "moderate" | "high" | "critical";
export type RiskKind = "flood" | "landslide" | "combined";
export type TrendDirection = "up" | "down" | "stable";

export interface Alert {
  id: string;
  severity: RiskLevel;
  regionId: string;
  region: string;
  description: string;
  timestamp: Date;
  type: RiskKind;
}

export interface RiskZoneProperties {
  name: string;
  regionId: string;
  riskLevel: RiskLevel;
  riskType: RiskKind;
  riskScore: number;
  description: string;
}

export interface RiskZoneFeature {
  type: "Feature";
  properties: RiskZoneProperties;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface RiskZoneCollection {
  type: "FeatureCollection";
  features: RiskZoneFeature[];
}

export interface InsightData {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: TrendDirection;
  trendValue: string;
  sparklineData: number[];
  threshold?: number;
  status: "normal" | "warning" | "danger";
}

export interface CommunityMessage {
  id: string;
  username: string;
  initials: string;
  avatarColor: string;
  message: string;
  timestamp: Date;
  location: string;
  type: "report" | "update" | "question";
}

export type RegionType = "state" | "district" | "metro";

export interface Region {
  id: string;
  name: string;
  subLabel: string;
  parent?: string;
  type: RegionType;
  center: { lat: number; lng: number };
  zoom: number;
}

export interface RiskFactor {
  label: string;
  value: string;
  level: RiskLevel;
}

export interface RiskSummary {
  regionId: string;
  regionName: string;
  score: number;
  level: RiskLevel;
  trend: TrendDirection;
  trendDelta: string;
  confidence: number;
  updatedAt: Date;
  factors: RiskFactor[];
}

export interface ZoneReport {
  id: string;
  name: string;
  regionId: string;
  riskLevel: RiskLevel;
  riskType: RiskKind;
  riskScore: number;
  description: string;
}