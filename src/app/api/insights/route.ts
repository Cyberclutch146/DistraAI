import { NextResponse } from "next/server";
import { getMockInsights } from "@/lib/mock-store";

export function GET() {
  return NextResponse.json(getMockInsights());
}