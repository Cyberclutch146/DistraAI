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
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">Active Alerts</h1>
              <p className="text-xs text-text-tertiary mt-0.5">
                Filter by severity. Alerts are sample data for demonstration.
              </p>
            </div>
          </div>
          <AlertsFeed variant="full" />
        </section>
      </main>

      <Footer />
    </div>
  );
}