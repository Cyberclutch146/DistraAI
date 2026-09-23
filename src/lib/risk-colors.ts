import type { RiskLevel } from "@/data/types";

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#5b8049",
  moderate: "#b8892a",
  high: "#c4512c",
  critical: "#a0281b",
};

export function riskColor(level: RiskLevel): string {
  return RISK_COLORS[level];
}