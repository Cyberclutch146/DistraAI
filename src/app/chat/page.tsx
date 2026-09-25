import type { Metadata } from "next";
import { RegionProvider } from "@/state/region-context";
import ChatView from "./view";

export const metadata: Metadata = {
  title: "Chat — DistraAI",
  description:
    "Live community chat room for disaster responders and community members.",
};

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  return (
    <RegionProvider defaultRegionId={params.region}>
      <ChatView />
    </RegionProvider>
  );
}
