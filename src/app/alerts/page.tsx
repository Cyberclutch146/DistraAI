import type { Metadata } from "next";
import { RegionProvider } from "@/state/region-context";
import AlertsView from "./view";

export const metadata: Metadata = {
  title: "Alerts — DistraAI",
  description: "Active disaster alerts with severity filtering across monitored regions.",
};

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  return (
    <RegionProvider defaultRegionId={params.region}>
      <AlertsView />
    </RegionProvider>
  );
}