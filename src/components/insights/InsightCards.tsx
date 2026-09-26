"use client";

import { getInsights } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import Sparkline from "./Sparkline";
import { cn } from "@/lib/utils";
import type { InsightData } from "@/data/types";

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
      <div className="flex items-center justify-between mb-3">
        <h3 className="eyebrow">{insight.title}</h3>
        <div
          className="h-2 w-2 rounded-full ring-2 ring-bg-wash"
          style={{ backgroundColor: statusColors[insight.status] }}
          aria-label={`Status: ${insight.status}`}
        />
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-data text-[26px] font-bold text-text-primary leading-none tracking-tight">
          {insight.value}
        </span>
        <span className="font-data text-sm text-text-tertiary">{insight.unit}</span>
        <div className={cn("ml-auto flex items-center gap-0.5 text-xs font-semibold", trendColorClass)}>
          <span>{trendIcon}</span>
          <span className="font-data text-[11px]">{insight.trendValue}</span>
        </div>
      </div>

      <div className="mt-1">
        <Sparkline
          data={insight.sparklineData}
          color={statusColors[insight.status]}
          threshold={insight.threshold}
          width={200}
          height={48}
        />
      </div>

      {insight.threshold && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-text-tertiary">
          <span className="h-px w-3 border-t border-dashed border-risk-high" aria-hidden="true" />
          <span>Threshold: <span className="font-data text-text-secondary">{insight.threshold}{insight.unit}</span></span>
        </div>
      )}
    </div>
  );
}

function InsightSkeleton() {
  return (
    <div className="card p-4 min-w-[220px] flex-1 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-24 rounded bg-bg-surface-hover" />
        <div className="h-2 w-2 rounded-full bg-bg-surface-hover" />
      </div>
      <div className="h-8 w-16 rounded bg-bg-surface-hover mb-4" />
      <div className="h-12 rounded bg-bg-surface-hover" />
    </div>
  );
}

export default function InsightCards() {
  const { data, loading, error } = useData(() => getInsights(), []);

  if (error) {
    return (
      <div className="card-static p-5">
        <p className="eyebrow mb-2">Environmental data</p>
        <p className="text-sm text-risk-high">Failed to load environmental data.</p>
        <p className="text-xs text-text-tertiary mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="eyebrow mb-4">Environmental data</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {loading || !data
          ? Array.from({ length: 4 }, (_, index) => <InsightSkeleton key={index} />)
          : data.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
      </div>
    </div>
  );
}