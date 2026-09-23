"use client";

import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useRegion } from "@/state/region-context";
import { getZoneReports } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { getRiskBgClass } from "@/lib/utils";

export default function ReportsView() {
  const { region } = useRegion();
  const { data, loading, error } = useData(() => getZoneReports(region.id), [region.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Reports" />

      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">Zone Reports</h1>
              <p className="text-xs text-text-tertiary mt-0.5">
                Risk summaries for monitored zones in {region.name}. Reports are sample data.
              </p>
            </div>
          </div>

          {error ? (
            <div className="card-static p-6">
              <p className="text-sm text-risk-high">Failed to load reports.</p>
              <p className="text-xs text-text-tertiary mt-1">{error}</p>
            </div>
          ) : loading || !data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="card-static p-5 h-40 animate-pulse">
                  <div className="h-4 w-28 rounded bg-bg-surface-hover mb-3" />
                  <div className="h-3 w-3/4 rounded bg-bg-surface-hover" />
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="card-static p-8 text-center">
              <p className="text-sm text-text-secondary">
                No monitored zones in {region.name} yet.
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                Select another region from the location menu to view its reports.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.map((report) => (
                <div key={report.id} className="card-static p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-sm font-semibold text-text-primary">{report.name}</h2>
                    <span
                      className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${getRiskBgClass(report.riskLevel)}`}
                    >
                      {report.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-tertiary mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-bg-surface text-text-tertiary border border-border-subtle uppercase tracking-widest">
                      {report.riskType}
                    </span>
                    <span className="font-data">Score {report.riskScore}</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed flex-1">
                    {report.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}