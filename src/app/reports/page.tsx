import type { Metadata } from "next";
import { RegionProvider } from "@/state/region-context";
import ReportsView from "./view";

export const metadata: Metadata = {
  title: "Reports — DistraAI",
  description: "Per-zone risk report cards for monitored regions.",
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  return (
    <RegionProvider defaultRegionId={params.region}>
      <ReportsView />
    </RegionProvider>
  );
}