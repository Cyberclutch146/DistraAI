"use client";

import dynamic from "next/dynamic";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useRegion } from "@/state/region-context";

const RiskMap = dynamic(() => import("@/components/map/RiskMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center">
      <span className="font-data text-xs uppercase tracking-widest text-text-tertiary">
        Loading map…
      </span>
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
              <p className="eyebrow mb-1">Zones</p>
              <h1 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
                Risk map
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {region.name} · Flood, landslide, and combined risk zones
              </p>
            </div>
            <span className="font-data text-[11px] text-text-tertiary">
              Sample data for demonstration
            </span>
          </div>

          <RiskMap heightClassName="h-[70vh]" />
        </section>
      </main>

      <Footer />
    </div>
  );
}