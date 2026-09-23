import { NextResponse } from "next/server";
import { getMockRegions } from "@/lib/mock-store";

export function GET() {
  return NextResponse.json(getMockRegions());
}