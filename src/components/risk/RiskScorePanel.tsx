"use client";

import RiskGauge from "./RiskGauge";
import { getRiskSummary } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { useRegion } from "@/state/region-context";
import { getRiskColorClass, getRiskBgClass } from "@/lib/utils";
import type { RiskSummary } from "@/data/types";

function SummaryBody({ summary }: { summary: RiskSummary }) {
  const trendIcon = summary.trend === "up" ? "↑" : summary.trend === "down" ? "↓" : "→";
  const trendColorClass =
    summary.trend === "up"
      ? "text-risk-high"
      : summary.trend === "down"
        ? "text-risk-low"
        : "text-text-secondary";

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="eyebrow">Risk assessment</p>
          <p className="serif-display text-xl font-semibold text-text-primary mt-1">
            {summary.regionName}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getRiskBgClass(summary.level)}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {summary.level}
        </span>
      </div>

      <div className="flex justify-center mb-3">
        <RiskGauge score={summary.score} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="card-tint p-3">
          <div className="eyebrow eyebrow-xs mb-1.5">24h trend</div>
          <div className="flex items-center gap-1.5">
            <span className={`text-lg font-bold ${trendColorClass}`}>{trendIcon}</span>
            <span className={`font-data text-sm font-semibold ${trendColorClass}`}>
              {summary.trendDelta}
            </span>
            <span className="text-xs text-text-tertiary ml-auto font-data">{summary.score}</span>
          </div>
        </div>
        <div className="card-tint p-3">
          <div className="eyebrow eyebrow-xs mb-1.5">Confidence</div>
          <div className="flex items-center gap-2">
            <span className="font-data text-sm font-semibold text-text-primary">
              {summary.confidence}%
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-border-subtle overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-1000"
                style={{ width: `${summary.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="eyebrow eyebrow-xs mb-2 mt-3">Key risk factors</div>
        <div className="divide-y divide-border-subtle">
          {summary.factors.map((factor) => (
            <div key={factor.label} className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2.5 text-sm text-text-secondary">
                <span
                  className={cnFactor(factor.level)}
                  aria-hidden="true"
                />
                {factor.label}
              </span>
              <span className={`font-data text-sm font-semibold ${getRiskColorClass(factor.level)}`}>
                {factor.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border-subtle">
        <div className="font-data text-[10px] text-text-tertiary">
          Updated {summary.updatedAt.toLocaleTimeString("en-US", { hour12: false })} ·
          Sample data
        </div>
      </div>
    </>
  );
}

function cnFactor(level: string) {
  const base = "w-1 h-1 rounded-full shrink-0 self-center inline-block";
  const color =
    level === "high"
      ? "bg-risk-high"
      : level === "critical"
        ? "bg-risk-critical"
        : "bg-risk-moderate";
  return `${base} ${color}`;
}

export default function RiskScorePanel() {
  const { region } = useRegion();
  const { data, loading, error } = useData(() => getRiskSummary(region.id), [region.id]);

  return (
    <div className="card-static p-5 animate-fade-in h-full flex flex-col">
      {error ? (
        <p className="text-sm text-risk-high">Failed to load risk assessment.</p>
      ) : loading || !data ? (
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-bg-surface-hover" />
            <div className="h-6 w-16 rounded-lg bg-bg-surface-hover" />
          </div>
          <div className="flex justify-center">
            <div className="h-[110px] w-[180px] rounded-full bg-bg-surface-hover" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="h-16 rounded-xl bg-bg-surface-hover" />
            <div className="h-16 rounded-xl bg-bg-surface-hover" />
          </div>
          <div className="space-y-2">
            <div className="h-9 rounded-lg bg-bg-surface-hover" />
            <div className="h-9 rounded-lg bg-bg-surface-hover" />
          </div>
        </div>
      ) : data === null ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <p className="eyebrow mb-3">Risk assessment</p>
          <p className="text-sm text-text-secondary">
            No monitored zones in {region.name} yet.
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            Select another region from the location menu to view its risk data.
          </p>
        </div>
      ) : (
        <SummaryBody summary={data} />
      )}
    </div>
  );
}