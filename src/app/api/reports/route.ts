import { NextRequest, NextResponse } from "next/server";
import { getMockZoneReports } from "@/lib/mock-store";

export function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") ?? undefined;
  return NextResponse.json(getMockZoneReports(region));
}