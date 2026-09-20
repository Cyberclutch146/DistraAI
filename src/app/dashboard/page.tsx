"use client";

import dynamic from "next/dynamic";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import RiskScorePanel from "@/components/risk/RiskScorePanel";
import AlertsFeed from "@/components/alerts/AlertsFeed";
import InsightCards from "@/components/insights/InsightCards";
import CommunityPreview from "@/components/community/CommunityPreview";

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

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Dashboard" />

      <main className="flex-1">
        {/* Hero Risk Map */}
        <section className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 mx-auto max-w-[1600px]" aria-label="Risk map">
          <RiskMap />
        </section>

        {/* Dashboard content */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8 mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left column */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* Risk Score + Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div className="md:col-span-2">
                  <RiskScorePanel />
                </div>
                <div className="md:col-span-3 flex flex-col gap-4">
                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <SummaryCard
                      label="Monitored Zones"
                      value="9"
                      subValue="active"
                      icon={
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      }
                    />
                    <SummaryCard
                      label="Active Alerts"
                      value="9"
                      subValue="3 critical"
                      accent
                      icon={
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                      }
                    />
                    <SummaryCard
                      label="Data Sources"
                      value="12"
                      subValue="connected"
                      icon={
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                      }
                    />
                  </div>

                  {/* System Status */}
                  <div className="card-static p-4 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-risk-low" />
                        </span>
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          System Operational
                        </span>
                      </div>
                      <div className="ml-auto font-data text-[10px] text-text-tertiary">
                        Latency: 142ms · Uptime: 99.97%
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 24 }, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-6 rounded-sm transition-colors"
                          style={{
                            backgroundColor:
                              i < 22
                                ? "var(--risk-low)"
                                : i === 22
                                  ? "var(--risk-moderate)"
                                  : "var(--risk-low)",
                            opacity: 0.2 + (i / 24) * 0.55,
                          }}
                          title={`${24 - i}h ago: ${i === 22 ? "Degraded" : "Operational"}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="font-data text-[9px] text-text-tertiary">24h ago</span>
                      <span className="font-data text-[9px] text-text-tertiary">Now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Cards */}
              <InsightCards />
            </div>

            {/* Right column */}
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

function SummaryCard({
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
          className={`font-data text-2xl font-bold ${accent ? "text-risk-high" : "text-text-primary"}`}
        >
          {value}
        </span>
        <span className="text-xs text-text-tertiary">{subValue}</span>
      </div>
    </div>
  );
}
