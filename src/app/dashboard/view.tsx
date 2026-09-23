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
import { getRiskBgClass, cn } from "@/lib/utils";

const RiskMap = dynamic(() => import("@/components/map/RiskMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[55vh] lg:h-[60vh] rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-text-tertiary">
        <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="30 70" />
        </svg>
        <span className="text-sm">Loading map…</span>
      </div>
    </div>
  ),
});

function DataCard({
  label,
  value,
  subValue,
  accent,
  icon,
}: {
  label: string;
  value: string;
  subValue: string;
  accent?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="card-static p-4 animate-fade-in">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-text-tertiary">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-data text-2xl font-bold",
            accent ? "text-risk-high" : "text-text-primary"
          )}
        >
          {value}
        </span>
        <span className="text-xs text-text-tertiary">{subValue}</span>
      </div>
    </div>
  );
}

const MapPinIcon = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const BellIcon = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const GaugeIcon = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

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
        <section className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 mx-auto max-w-[1600px]" aria-label="Risk map">
          <RiskMap />
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-8 mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div className="md:col-span-2">
                  <RiskScorePanel />
                </div>
                <div className="md:col-span-3 flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <DataCard
                      label="Monitored Zones"
                      value={zoneCount === null ? "—" : `${zoneCount}`}
                      subValue="active"
                      icon={MapPinIcon}
                    />
                    <DataCard
                      label="Active Alerts"
                      value={activeCount === null ? "—" : `${activeCount}`}
                      subValue={criticalCount !== null ? `${criticalCount} critical` : ""}
                      accent
                      icon={BellIcon}
                    />
                    <DataCard
                      label="Peak Risk"
                      value={peakScore === null ? "—" : `${peakScore}`}
                      subValue={peakScore === null ? "" : levelForScore(peakScore)}
                      icon={GaugeIcon}
                    />
                  </div>

                  <div className="card-static p-4 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          {summary.data ? `${summary.data.regionName} Snapshot` : "Region Snapshot"}
                        </span>
                      </div>
                      {summary.data && (
                        <span
                          className={cn(
                            "ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                            getRiskBgClass(summary.data.level)
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
                      <p className="text-xs text-text-tertiary">
                        No monitored zones in {region.name} yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <InsightCards />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4 space-y-5" aria-label="Alerts and community">
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
    <div className="rounded-lg bg-bg-primary/40 border border-border-subtle px-3 py-2.5">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-text-tertiary mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-text-primary truncate">{value}</div>
    </div>
  );
}