"use client";

import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useRegion } from "@/state/region-context";
import { getCommunity } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { MessageCard, typeLabels, CommunitySkeleton } from "@/components/community/CommunityPreview";

const filters = ["all", "report", "update", "question"] as const;
type FilterId = (typeof filters)[number];

const filterLabels: Record<FilterId, string> = {
  all: "All",
  report: "Reports",
  update: "Updates",
  question: "Questions",
};

export default function CommunityView() {
  const { region } = useRegion();
  const { data, loading, error } = useData(() => getCommunity(), []);

  const counts = (data ?? []).reduce(
    (acc, message) => {
      acc[message.type] = (acc[message.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Community" />

      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">Community Reports</h1>
              <p className="text-xs text-text-tertiary mt-0.5">
                Ground-level reports shared by local observers. Messages are sample data.
              </p>
            </div>
            <span className="text-[11px] text-text-tertiary">Region: {region.name}</span>
          </div>

          <div className="card-static p-5">
            {(data ?? []).length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter community messages">
                {filters.map((filter) => {
                  const label = filterLabels[filter];
                  const icon = filter === "all" ? null : typeLabels[filter].icon;
                  return (
                    <span
                      key={filter}
                      className="rounded-lg border border-border-subtle bg-bg-primary/40 px-3 py-1.5 text-xs"
                    >
                      {icon && (
                        <span className="mr-1.5" aria-hidden="true">{icon}</span>
                      )}
                      {label}
                      <span className="ml-1.5 font-data text-text-tertiary">
                        {filter === "all" ? data?.length : counts[filter] ?? 0}
                      </span>
                    </span>
                  );
                })}
              </div>
            )}

            <div className="mt-2 divide-y divide-border-subtle">
              {error ? (
                <p className="text-sm text-risk-high py-4">Failed to load community reports.</p>
              ) : loading || !data ? (
                <CommunitySkeleton />
              ) : data.length === 0 ? (
                <p className="text-sm text-text-secondary py-6 text-center">
                  No community reports yet.
                </p>
              ) : (
                data.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}