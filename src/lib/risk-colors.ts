import type { RiskLevel } from "@/data/types";

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#3dba6c",
  moderate: "#e8b930",
  high: "#d94444",
  critical: "#a62020",
};

export function riskColor(level: RiskLevel): string {
  return RISK_COLORS[level];
}