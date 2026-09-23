"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAlerts } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { useRegion } from "@/state/region-context";
import { cn, formatTimeAgo, getRiskBgClass } from "@/lib/utils";
import type { Alert, Region, RiskLevel } from "@/data/types";

export const severityIcons: Record<string, string> = {
  critical: "◉",
  high: "●",
  moderate: "◐",
  low: "○",
};

export const severityOrder: RiskLevel[] = ["critical", "high", "moderate", "low"];

export function AlertCard({ alert, clamp = true }: { alert: Alert; clamp?: boolean }) {
  const isCritical = alert.severity === "critical";

  return (
    <div
      className={cn(
        "group rounded-xl border p-3 transition-all duration-200",
        "border-border-subtle bg-bg-primary/40 hover:bg-bg-surface-hover hover:border-border-subtle/80",
        isCritical && "border-risk-critical/25 bg-risk-critical/[0.03]"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold border",
            getRiskBgClass(alert.severity),
            isCritical && "animate-pulse-glow"
          )}
          aria-label={`Severity: ${alert.severity}`}
        >
          {severityIcons[alert.severity]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {alert.region}
            </h3>
            <span className="shrink-0 font-data text-[10px] text-text-tertiary">
              {formatTimeAgo(alert.timestamp)}
            </span>
          </div>

          <p className={cn("text-xs text-text-secondary leading-relaxed", clamp && "line-clamp-2")}>
            {alert.description}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-widest bg-bg-surface text-text-tertiary border border-border-subtle">
              {alert.type}
            </span>
            <span className="font-data text-[9px] text-text-tertiary">
              {alert.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-xl border border-border-subtle p-3 animate-pulse">
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-xl bg-bg-surface-hover" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-2/3 rounded bg-bg-surface-hover" />
              <div className="h-3 w-full rounded bg-bg-surface-hover" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AlertsError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-risk-critical/25 bg-risk-critical/[0.03] p-4">
      <p className="text-sm font-medium text-risk-high">Failed to load alerts</p>
      <p className="text-xs text-text-tertiary mt-1">{message}</p>
    </div>
  );
}

interface AlertsFeedProps {
  variant?: "sidebar" | "full";
}

export default function AlertsFeed({ variant = "sidebar" }: AlertsFeedProps) {
  const { region } = useRegion();
  const { data, loading, error } = useData(() => getAlerts(region.id), [region.id]);

  return (
    <AlertsFeedList
      key={region.id}
      variant={variant}
      region={region}
      data={data}
      loading={loading}
      error={error}
    />
  );
}

function AlertsFeedList({
  variant,
  region,
  data,
  loading,
  error,
}: {
  variant: "sidebar" | "full";
  region: Region;
  data: Alert[] | null;
  loading: boolean;
  error: string | null;
}) {
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const criticalCount = useMemo(
    () => (data ?? []).filter((alert) => alert.severity === "critical").length,
    [data]
  );

  const visibleAlerts = useMemo(() => {
    if (!data) return [];
    return filter === "all" ? data : data.filter((alert) => alert.severity === filter);
  }, [data, filter]);

  const isFull = variant === "full";

  return (
    <div className={cn("card-static p-5 flex flex-col animate-fade-in", isFull && "h-full")}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Active Alerts
          </h2>
          <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-risk-high/15 text-risk-high text-[10px] font-bold border border-risk-high/25">
            {data?.length ?? 0}
          </span>
        </div>
        {!isFull && (
          <Link
            href="/alerts"
            className="text-xs text-accent hover:text-accent-hover transition-colors font-medium flex items-center gap-1 group"
          >
            View all
            <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>

      {isFull && (
        <div className="flex flex-wrap items-center gap-1.5 mb-4" role="tablist" aria-label="Filter alerts by severity">
          {(["all", ...severityOrder] as const).map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === value
                  ? "bg-accent/15 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
              )}
            >
              {value === "all" ? "All" : value}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-text-tertiary">
            {filter === "all" ? (data?.length ?? 0) : visibleAlerts.length} shown
          </span>
        </div>
      )}

      {error ? (
        <AlertsError message={error} />
      ) : loading || !data ? (
        <AlertsSkeleton count={isFull ? 5 : 3} />
      ) : visibleAlerts.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-bg-primary/30 p-6 text-center">
          <p className="text-sm text-text-secondary">
            No {filter === "all" ? "" : `${filter} `}alerts for {region.name}.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 space-y-2 overflow-y-auto pr-1",
            !isFull && "max-h-[420px]"
          )}
          role="feed"
          aria-label="Active alerts"
        >
          {visibleAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <AlertCard alert={alert} clamp={!isFull} />
            </div>
          ))}
        </div>
      )}

      {isFull && data && data.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] text-text-tertiary">
          {criticalCount} critical · {data.filter((a) => a.severity === "high").length} high ·{" "}
          {data.filter((a) => a.severity === "moderate").length} moderate ·{" "}
          {data.filter((a) => a.severity === "low").length} low
        </div>
      )}
    </div>
  );
}