import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ aiCoach: Boolean(process.env.SSEUGI_GEMINI_API_KEY) && process.env.SSEUGI_AI_ENABLED === "true" }, { headers: { "cache-control": "no-store" } });
}
