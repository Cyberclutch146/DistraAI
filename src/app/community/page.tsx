import type { Metadata } from "next";
import { RegionProvider } from "@/state/region-context";
import CommunityView from "./view";

export const metadata: Metadata = {
  title: "Community — DistraAI",
  description: "Community-reported ground intelligence and on-the-ground updates.",
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  return (
    <RegionProvider defaultRegionId={params.region}>
      <CommunityView />
    </RegionProvider>
  );
}