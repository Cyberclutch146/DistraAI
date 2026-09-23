import { NextRequest, NextResponse } from "next/server";
import { getMockRiskSummary, isKnownRegion } from "@/lib/mock-store";

export function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region");
  if (!region || !isKnownRegion(region)) {
    return NextResponse.json({ error: "Unknown region" }, { status: 400 });
  }
  return NextResponse.json(getMockRiskSummary(region));
}