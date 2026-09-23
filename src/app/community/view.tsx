"use client";

import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useRegion } from "@/state/region-context";
import { getCommunity } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { MessageCard, CommunitySkeleton } from "@/components/community/CommunityPreview";

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
          <div className="max-w-2xl mb-6">
            <p className="eyebrow mb-1">Ground truth</p>
            <h1 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
              Community reports
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Ground-level reports shared by local observers. Messages are sample data.
            </p>
          </div>

          <div className="card-static p-5 sm:p-6">
            {(data ?? []).length > 0 && (
              <div
                className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border-subtle mb-2"
                role="tablist"
                aria-label="Filter community messages"
              >
                {filters.map((filter) => {
                  const label = filterLabels[filter];
                  return (
                    <span
                      key={filter}
                      className="font-data text-sm capitalize text-text-secondary border-b-2 border-transparent -mb-3 py-3 pb-3.5"
                    >
                      {label}
                      <span className="ml-1.5 text-text-tertiary">
                        {filter === "all" ? data?.length : counts[filter] ?? 0}
                      </span>
                    </span>
                  );
                })}
                <span className="ml-auto font-data text-[11px] text-text-tertiary">
                  Region: {region.name}
                </span>
              </div>
            )}

            {error ? (
              <p className="text-sm text-risk-high py-4">Failed to load community reports.</p>
            ) : loading || !data ? (
              <CommunitySkeleton />
            ) : data.length === 0 ? (
              <p className="text-sm text-text-secondary py-6 text-center">
                No community reports yet.
              </p>
            ) : (
              <div className="divide-y divide-border-subtle">
                {data.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}