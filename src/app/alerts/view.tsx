"use client";

import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import AlertsFeed from "@/components/alerts/AlertsFeed";

export default function AlertsView() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Alerts" />

      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-[1600px]">
          <div className="max-w-2xl mb-6">
            <p className="eyebrow mb-1">Field dispatches</p>
            <h1 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
              Active alerts
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Filter by severity. Alerts are sample data for demonstration.
            </p>
          </div>
          <AlertsFeed variant="full" />
        </section>
      </main>

      <Footer />
    </div>
  );
}