"use client";

import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useRegion } from "@/state/region-context";
import { getZoneReports } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { getRiskColorClass } from "@/lib/utils";

export default function ReportsView() {
  const { region } = useRegion();
  const { data, loading, error } = useData(() => getZoneReports(region.id), [region.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Reports" />

      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-[1600px]">
          <div className="max-w-2xl mb-6">
            <p className="eyebrow mb-1">Field notes</p>
            <h1 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
              Zone reports
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Risk summaries for monitored zones in {region.name}. Reports are sample data.
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
              {data.map((report) => (
                <article key={report.id} className="border-t border-strong pt-4">
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h2 className="serif-display text-xl font-semibold text-text-primary">
                      {report.name}
                    </h2>
                    <span
                      className={`font-data text-[11px] uppercase tracking-widest shrink-0 ${getRiskColorClass(report.riskLevel)}`}
                    >
                      {report.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="eyebrow eyebrow-xs">{report.riskType}</span>
                    <span className="font-data text-[11px] text-text-tertiary">
                      score {report.riskScore} / 100
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed text-pretty">
                    {report.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}