import type { Metadata } from "next";
import { RegionProvider } from "@/state/region-context";
import DashboardView from "./view";

export const metadata: Metadata = {
  title: "Dashboard — DistraAI",
  description:
    "Live flood and landslide risk assessment dashboard for monitored regions.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  return (
    <RegionProvider defaultRegionId={params.region}>
      <DashboardView />
    </RegionProvider>
  );
}