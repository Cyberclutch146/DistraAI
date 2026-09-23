import type { Metadata } from "next";
import { RegionProvider } from "@/state/region-context";
import MapView from "./view";

export const metadata: Metadata = {
  title: "Risk Map — DistraAI",
  description: "Interactive flood and landslide risk map across monitored regions.",
};

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  return (
    <RegionProvider defaultRegionId={params.region}>
      <MapView />
    </RegionProvider>
  );
}