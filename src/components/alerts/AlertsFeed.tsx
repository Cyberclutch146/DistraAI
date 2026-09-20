"use client";

import { mockAlerts, type Alert } from "@/data/mockAlerts";
import { cn, formatTimeAgo, getRiskBgClass } from "@/lib/utils";

const severityIcons: Record<string, string> = {
  critical: "◉",
  high: "●",
  moderate: "◐",
  low: "○",
};

function AlertCard({ alert }: { alert: Alert }) {
  const isCritical = alert.severity === "critical";

  return (
    <div
      className={cn(
        "group rounded-xl border p-3 transition-all duration-200 cursor-pointer",
        "border-border-subtle bg-bg-primary/40 hover:bg-bg-surface-hover hover:border-border-subtle/80",
        isCritical && "border-risk-critical/25 bg-risk-critical/[0.03]"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Severity badge */}
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

          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
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

export default function AlertsFeed() {
  return (
    <div className="card-static p-5 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Active Alerts
          </h2>
          <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-risk-high/15 text-risk-high text-[10px] font-bold border border-risk-high/25">
            {mockAlerts.length}
          </span>
        </div>
        <a href="/alerts" className="text-xs text-accent hover:text-accent-hover transition-colors font-medium flex items-center gap-1 group">
          View all
          <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>

      {/* Scrollable feed */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[420px] pr-1" role="feed" aria-label="Active alerts">
        {mockAlerts.map((alert, index) => (
          <div
            key={alert.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <AlertCard alert={alert} />
          </div>
        ))}
      </div>
    </div>
  );
}
