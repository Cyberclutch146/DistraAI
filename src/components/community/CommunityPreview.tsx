"use client";

import Link from "next/link";
import { getCommunity } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { formatTimeAgo } from "@/lib/utils";
import type { CommunityMessage } from "@/data/types";

export const typeLabels: Record<string, { icon: string; color: string }> = {
  report: { icon: "", color: "text-risk-high" },
  update: { icon: "", color: "text-accent" },
  question: { icon: "", color: "text-risk-moderate" },
};

export function MessageCard({ message }: { message: CommunityMessage }) {
  const typeInfo = typeLabels[message.type];

  return (
    <div className="flex gap-3 py-3 group">
      <div
        className="shrink-0 h-9 w-9 rounded-full border border-border-subtle bg-bg-surface flex items-center justify-center text-[11px] font-semibold text-accent shadow-card"
        aria-hidden="true"
      >
        {message.initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-text-primary">{message.username}</span>
          <span className={`eyebrow eyebrow-xs ${typeInfo.color}`}>
            {message.type}
          </span>
          <span className="font-data text-[10px] text-text-tertiary ml-auto shrink-0">
            {formatTimeAgo(message.timestamp)}
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 text-pretty">
          {message.message}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 text-[11px] text-text-tertiary bg-bg-wash px-2 py-0.5 rounded-md border border-border-subtle">
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {message.location}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommunitySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex gap-3 py-3 animate-pulse">
          <div className="h-9 w-9 rounded-full bg-bg-surface-hover" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 w-1/3 rounded bg-bg-surface-hover" />
            <div className="h-3 w-full rounded bg-bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CommunityPreview() {
  const { data, loading, error } = useData(() => getCommunity(), []);

  return (
    <div className="card-static p-5 animate-fade-in relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="eyebrow">Ground reports</span>
        <span className="eyebrow eyebrow-xs text-accent">Preview</span>
      </div>

      {error ? (
        <p className="text-xs text-risk-high py-2">Failed to load community reports.</p>
      ) : loading || !data ? (
        <CommunitySkeleton />
      ) : (
        <div className="divide-y divide-border-subtle">
          {data.map((msg) => (
            <MessageCard key={msg.id} message={msg} />
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border-subtle">
        <Link
          href="/community"
          className="link-editorial text-sm inline-flex items-center gap-1.5"
        >
          View community reports →
        </Link>
      </div>
    </div>
  );
}