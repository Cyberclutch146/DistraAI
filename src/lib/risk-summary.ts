import type {
  InsightData,
  Region,
  RiskFactor,
  RiskLevel,
  RiskZoneFeature,
  RiskSummary,
} from "@/data/types";

export function levelForScore(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

function parseIntValue(value: string | undefined): number {
  const parsed = parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function rainfallIntensityFactor(insights: InsightData[]): RiskFactor {
  const rainfall = insights.find((i) => i.id === "rainfall");
  const mm = parseIntValue(rainfall?.value);
  const level: RiskLevel =
    mm >= 150 ? "critical" : mm >= 100 ? "high" : mm >= 60 ? "moderate" : "low";
  return { label: "Rainfall intensity", value: mm > 0 ? `${mm}mm` : "—", level };
}

export function soilMoistureFactor(insights: InsightData[]): RiskFactor {
  const soil = insights.find((i) => i.id === "soil-saturation");
  const pct = parseIntValue(soil?.value);
  const level: RiskLevel =
    pct >= 90 ? "critical" : pct >= 80 ? "high" : pct >= 60 ? "moderate" : "low";
  return { label: "Soil moisture", value: pct > 0 ? `${pct}%` : "—", level };
}

export function slopeStabilityFactor(zones: RiskZoneFeature[]): RiskFactor {
  const unstable = zones.some(
    (zone) =>
      (zone.properties.riskType === "landslide" ||
        zone.properties.riskType === "combined") &&
      (zone.properties.riskLevel === "high" ||
        zone.properties.riskLevel === "critical")
  );
  return unstable
    ? { label: "Slope stability", value: "Low", level: "high" }
    : { label: "Slope stability", value: "Stable", level: "low" };
}

export function computeRiskSummary(
  region: Region,
  zones: RiskZoneFeature[],
  insights: InsightData[]
): RiskSummary | null {
  if (zones.length === 0) return null;

  const scores = zones.map((zone) => zone.properties.riskScore);
  const maxScore = Math.max(...scores);
  const avgScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  const level = levelForScore(avgScore);
  const trend: RiskSummary["trend"] =
    maxScore >= 80 ? "up" : avgScore >= 60 ? "up" : "stable";

  return {
    regionId: region.id,
    regionName: region.name,
    score: avgScore,
    level,
    trend,
    trendDelta: trend === "up" ? "+5" : "0",
    confidence: Math.min(99, 70 + Math.round(avgScore / 4)),
    updatedAt: new Date(),
    factors: [
      rainfallIntensityFactor(insights),
      soilMoistureFactor(insights),
      slopeStabilityFactor(zones),
    ],
  };
}