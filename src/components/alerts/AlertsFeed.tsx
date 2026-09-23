"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAlerts } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { useRegion } from "@/state/region-context";
import { cn, formatTimeAgo } from "@/lib/utils";
import type { Alert, Region, RiskLevel } from "@/data/types";

export const severityOrder: RiskLevel[] = ["critical", "high", "moderate", "low"];

const severityBar: Record<string, string> = {
  critical: "bg-risk-critical",
  high: "bg-risk-high",
  moderate: "bg-risk-moderate",
  low: "bg-risk-low",
};

export function AlertCard({ alert, clamp = true }: { alert: Alert; clamp?: boolean }) {
  const isCritical = alert.severity === "critical";

  return (
    <div
      className={cn(
        "group flex items-start gap-3 py-3 border-b border-border-subtle",
        isCritical && "bg-risk-critical/[0.04]"
      )}
    >
      <span
        className={cn("w-1 self-stretch rounded-full shrink-0 mt-0.5", severityBar[alert.severity])}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <h3 className="serif-display text-base font-semibold text-text-primary truncate">
            {alert.region}
          </h3>
          <span className="shrink-0 font-data text-[10px] text-text-tertiary">
            {formatTimeAgo(alert.timestamp)}
          </span>
        </div>

        <p className={cn("text-sm text-text-secondary leading-relaxed", clamp && "line-clamp-2")}>
          {alert.description}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="eyebrow eyebrow-xs">{alert.type}</span>
          <span className="font-data text-[10px] text-text-tertiary">{alert.id}</span>
          <span
            className={cn(
              "font-data text-[10px] uppercase tracking-widest ml-auto shrink-0",
              alert.severity === "critical"
                ? "text-risk-critical"
                : alert.severity === "high"
                  ? "text-risk-high"
                  : alert.severity === "moderate"
                    ? "text-risk-moderate"
                    : "text-risk-low"
            )}
          >
            {alert.severity}
          </span>
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
            <div className="h-9 w-1 rounded-full bg-bg-surface-hover" />
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
    <div className="rounded-xl border border-risk-critical/40 bg-risk-critical/5 p-4">
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
      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow">Active alerts</span>
        {!isFull && (
          <Link
            href="/alerts"
            className="font-data text-xs text-accent hover:text-accent-hover transition-colors"
          >
            View all →
          </Link>
        )}
      </div>

      {isFull && (
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 border-b border-border-subtle pb-2"
          role="tablist"
          aria-label="Filter alerts by severity"
        >
          {(["all", ...severityOrder] as const).map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "font-data text-sm capitalize transition-colors border-b-2 -mb-2 pb-2",
                filter === value
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {value === "all" ? "All" : value}
            </button>
          ))}
          <span className="ml-auto font-data text-[11px] text-text-tertiary">
            {filter === "all" ? (data?.length ?? 0) : visibleAlerts.length} shown
          </span>
        </div>
      )}

      {error ? (
        <AlertsError message={error} />
      ) : loading || !data ? (
        <AlertsSkeleton count={isFull ? 5 : 3} />
      ) : visibleAlerts.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-bg-wash/60 p-6 text-center">
          <p className="text-sm text-text-secondary">
            No {filter === "all" ? "" : `${filter} `}alerts for {region.name}.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 overflow-y-auto pr-1",
            !isFull && "max-h-[420px]"
          )}
          role="feed"
          aria-label="Active alerts"
        >
          <div className="divide-y divide-border-subtle">
            {visibleAlerts.map((alert, index) => (
              <div key={alert.id} className="animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
                <AlertCard alert={alert} clamp={!isFull} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isFull && data && data.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border-subtle font-data text-[11px] text-text-tertiary">
          {criticalCount} critical · {data.filter((a) => a.severity === "high").length} high ·{" "}
          {data.filter((a) => a.severity === "moderate").length} moderate ·{" "}
          {data.filter((a) => a.severity === "low").length} low
        </div>
      )}
    </div>
  );
}