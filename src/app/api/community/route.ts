import { NextResponse } from "next/server";
import { getMockCommunity } from "@/lib/mock-store";

export function GET() {
  return NextResponse.json(getMockCommunity());
}