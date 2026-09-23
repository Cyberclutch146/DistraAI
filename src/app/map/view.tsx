"use client";

import dynamic from "next/dynamic";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useRegion } from "@/state/region-context";

const RiskMap = dynamic(() => import("@/components/map/RiskMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-text-tertiary">
        <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="30 70" />
        </svg>
        <span className="text-sm">Loading map…</span>
      </div>
    </div>
  ),
});

export default function MapView() {
  const { region } = useRegion();

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Map" />

      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-8 mx-auto max-w-[1600px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">Risk Map</h1>
              <p className="text-xs text-text-tertiary mt-0.5">
                {region.name} · Flood, landslide, and combined risk zones
              </p>
            </div>
            <span className="text-[11px] text-text-tertiary">
              Risk zones are sample data for demonstration.
            </span>
          </div>

          <RiskMap heightClassName="h-[70vh]" />
        </section>
      </main>

      <Footer />
    </div>
  );
}