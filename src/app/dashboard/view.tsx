"use client";

import dynamic from "next/dynamic";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import RiskScorePanel from "@/components/risk/RiskScorePanel";
import AlertsFeed from "@/components/alerts/AlertsFeed";
import InsightCards from "@/components/insights/InsightCards";
import CommunityPreview from "@/components/community/CommunityPreview";
import { useRegion } from "@/state/region-context";
import { getAlerts, getRiskZones, getRiskSummary } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { levelForScore } from "@/lib/risk-summary";
import { getRiskColorClass, cn } from "@/lib/utils";

const RiskMap = dynamic(() => import("@/components/map/RiskMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[55vh] lg:h-[60vh] rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-text-tertiary">
        <span className="font-data text-xs uppercase tracking-widest">Loading map…</span>
      </div>
    </div>
  ),
});

function DataCard({
  label,
  value,
  subValue,
  accent,
}: {
  label: string;
  value: string;
  subValue: string;
  accent?: boolean;
}) {
  return (
    <div className="card-tint px-4 py-3.5 animate-fade-in">
      <div className="eyebrow eyebrow-xs mb-1.5">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-data text-2xl font-bold tracking-tight",
            accent ? getRiskColorClass("high") : "text-text-primary"
          )}
        >
          {value}
        </span>
        {subValue && <span className="text-xs text-text-tertiary">{subValue}</span>}
      </div>
    </div>
  );
}

export default function DashboardView() {
  const { region } = useRegion();
  const alerts = useData(() => getAlerts(region.id), [region.id]);
  const zones = useData(() => getRiskZones(region.id), [region.id]);
  const summary = useData(() => getRiskSummary(region.id), [region.id]);

  const activeCount = alerts.data?.length ?? null;
  const criticalCount = alerts.data?.filter((a) => a.severity === "critical").length ?? null;
  const zoneCount = zones.data?.features.length ?? null;
  const peakScore = zones.data
    ? Math.max(...zones.data.features.map((f) => f.properties.riskScore))
    : null;
  const elevatedZones = zones.data
    ? zones.data.features.filter(
        (f) => f.properties.riskLevel === "high" || f.properties.riskLevel === "critical"
      )
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Dashboard" />

      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-3 mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div>
              <p className="eyebrow mb-1.5">Region watch</p>
              <h1 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
                {region.name} <span className="italic text-accent">briefing</span>
              </h1>
            </div>
            <span className="font-data text-[11px] text-text-tertiary">
              Sample data for demonstration
            </span>
          </div>
          <RiskMap />
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-10 mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div className="md:col-span-2">
                  <RiskScorePanel />
                </div>
                <div className="md:col-span-3 flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <DataCard
                      label="Monitored zones"
                      value={zoneCount === null ? "—" : `${zoneCount}`}
                      subValue="active"
                    />
                    <DataCard
                      label="Active alerts"
                      value={activeCount === null ? "—" : `${activeCount}`}
                      subValue={criticalCount !== null ? `${criticalCount} critical` : ""}
                      accent
                    />
                    <DataCard
                      label="Peak risk"
                      value={peakScore === null ? "—" : `${peakScore}`}
                      subValue={peakScore === null ? "" : levelForScore(peakScore)}
                    />
                  </div>

                  <div className="card-tint p-4 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="eyebrow eyebrow-xs">
                        {summary.data ? `${summary.data.regionName} snapshot` : "Region snapshot"}
                      </span>
                      {summary.data && (
                        <span
                          className={cn(
                            "ml-auto font-data text-xs font-bold uppercase tracking-widest",
                            getRiskColorClass(summary.data.level)
                          )}
                        >
                          {summary.data.score} / 100 · {summary.data.level}
                        </span>
                      )}
                    </div>

                    {zones.data && zones.data.features.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <SnapshotStat label="Risk zones" value={`${zoneCount}`} />
                        <SnapshotStat
                          label="Elevated risk"
                          value={`${elevatedZones?.length ?? 0}`}
                        />
                        <SnapshotStat
                          label="Top zone"
                          value={elevatedZones?.[0]?.properties.name ?? "—"}
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary">
                        No monitored zones in {region.name} yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <InsightCards />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4 space-y-6" aria-label="Alerts and community">
              <AlertsFeed />
              <CommunityPreview />
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SnapshotStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-surface border border-border-subtle px-3 py-2.5">
      <div className="eyebrow eyebrow-xs mb-1">{label}</div>
      <div className="font-data text-sm font-semibold text-text-primary truncate">{value}</div>
    </div>
  );
}