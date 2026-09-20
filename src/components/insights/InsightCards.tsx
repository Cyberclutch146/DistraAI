"use client";

import { mockInsights, type InsightData } from "@/data/mockInsights";
import Sparkline from "./Sparkline";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  normal: "var(--risk-low)",
  warning: "var(--risk-moderate)",
  danger: "var(--risk-high)",
};

function InsightCard({ insight, index }: { insight: InsightData; index: number }) {
  const trendIcon =
    insight.trend === "up" ? "↑" : insight.trend === "down" ? "↓" : "→";
  const trendColorClass =
    insight.trend === "up"
      ? "text-risk-moderate"
      : insight.trend === "down"
        ? "text-risk-low"
        : "text-text-secondary";

  return (
    <div
      className="card p-4 min-w-[220px] flex-1 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center h-7 w-7 rounded-lg text-sm"
            style={{ background: `color-mix(in srgb, ${statusColors[insight.status]} 12%, transparent)` }}
          >
            <span aria-hidden="true">{insight.icon}</span>
          </div>
          <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            {insight.title}
          </h3>
        </div>
        <div
          className="h-2 w-2 rounded-full ring-2 ring-bg-surface"
          style={{ backgroundColor: statusColors[insight.status] }}
          aria-label={`Status: ${insight.status}`}
        />
      </div>

      {/* Value + trend */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-data text-[26px] font-bold text-text-primary leading-none">
          {insight.value}
        </span>
        <span className="font-data text-sm text-text-tertiary">{insight.unit}</span>
        <div className={cn("ml-auto flex items-center gap-0.5 text-xs font-semibold", trendColorClass)}>
          <span>{trendIcon}</span>
          <span className="font-data text-[11px]">{insight.trendValue}</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-1">
        <Sparkline
          data={insight.sparklineData}
          color={statusColors[insight.status]}
          threshold={insight.threshold
            ? ((insight.threshold - Math.min(...insight.sparklineData)) /
                (Math.max(...insight.sparklineData) - Math.min(...insight.sparklineData))) *
                100 +
              Math.min(...insight.sparklineData)
            : undefined}
          width={200}
          height={48}
        />
      </div>

      {/* Threshold indicator */}
      {insight.threshold && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-text-tertiary">
          <span className="h-px w-3 border-t border-dashed border-risk-high" aria-hidden="true" />
          <span>Threshold: <span className="font-data text-text-secondary">{insight.threshold}{insight.unit}</span></span>
        </div>
      )}
    </div>
  );
}

export default function InsightCards() {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-4">
        Environmental Data
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {mockInsights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} />
        ))}
      </div>
    </div>
  );
}
