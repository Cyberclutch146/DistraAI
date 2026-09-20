"use client";

import RiskGauge from "./RiskGauge";
import { getRiskBgClass } from "@/lib/utils";

const riskData = {
  score: 72,
  level: "high" as const,
  trend: "up" as const,
  trendDelta: "+5",
  confidence: 87,
  lastUpdated: new Date(),
  region: "Kerala",
  factors: [
    { label: "Rainfall intensity", value: "High", level: "high" },
    { label: "Soil moisture", value: "87%", level: "moderate" },
    { label: "Slope stability", value: "Low", level: "high" },
  ],
};

export default function RiskScorePanel() {
  const trendIcon =
    riskData.trend === "up" ? "↑" : riskData.trend === "down" ? "↓" : "→";
  const trendColorClass =
    riskData.trend === "up"
      ? "text-risk-high"
      : riskData.trend === "down"
        ? "text-risk-low"
        : "text-text-secondary";

  return (
    <div className="card-static p-5 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Risk Assessment
          </h2>
          <p className="text-[11px] text-text-tertiary mt-0.5">{riskData.region} Region</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getRiskBgClass(riskData.level)}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {riskData.level}
        </span>
      </div>

      {/* Gauge */}
      <div className="flex justify-center mb-1">
        <RiskGauge score={riskData.score} />
      </div>

      {/* Trend & Confidence */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="rounded-xl bg-bg-primary/60 border border-border-subtle p-3">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-text-tertiary mb-1.5">
            24h Trend
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-lg font-bold ${trendColorClass}`}>
              {trendIcon}
            </span>
            <span className={`font-data text-sm font-bold ${trendColorClass}`}>
              {riskData.trendDelta}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-bg-primary/60 border border-border-subtle p-3">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-text-tertiary mb-1.5">
            Confidence
          </div>
          <div className="flex items-center gap-2">
            <span className="font-data text-sm font-bold text-text-primary">
              {riskData.confidence}%
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-border-subtle overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-1000"
                style={{ width: `${riskData.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key factors */}
      <div className="border-t border-border-subtle pt-3 flex-1">
        <div className="text-[9px] font-semibold uppercase tracking-widest text-text-tertiary mb-2.5">
          Key Risk Factors
        </div>
        <div className="space-y-2">
          {riskData.factors.map((factor) => (
            <div key={factor.label} className="flex items-center justify-between rounded-lg bg-bg-primary/30 px-3 py-2">
              <span className="text-xs text-text-secondary">{factor.label}</span>
              <span className={`font-data text-xs font-semibold ${factor.level === "high" ? "text-risk-high" : "text-risk-moderate"}`}>
                {factor.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-3 pt-3 border-t border-border-subtle">
        <div className="font-data text-[10px] text-text-tertiary">
          Updated {riskData.lastUpdated.toLocaleTimeString("en-US", { hour12: false })} ·
          Model v2.4.1
        </div>
      </div>
    </div>
  );
}
