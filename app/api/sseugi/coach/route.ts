import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

type Body = { scenario?: string; context?: string; draft?: string; originalDraft?: string; previousFocus?: string; mode?: string; consent?: boolean };
type Focus = "particles" | "formality" | "wording" | "naturalness" | "clarity" | "spacing";
type CoachResult = { priority: string; explanation: string; options: string[]; practice: string; focus: Focus; outcome: "first" | "improved" | "keep-practising" };
const focuses = new Set<Focus>(["particles", "formality", "wording", "naturalness", "clarity", "spacing"]);
const allowedScenarios = new Set(["message", "work", "comment", "introduce", "request", "reschedule", "explain", "thanks"]);
const visits = new Map<string, { count: number; resets: number }>();
const limit = 3; const browserLimit = 2;

function visitor(request: NextRequest) { const value = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"; const now = Date.now(); const current = visits.get(value); if (!current || current.resets < now) { visits.set(value, { count: 1, resets: now + 86_400_000 }); return true; } if (current.count >= limit) return false; current.count += 1; return true; }
function clean(value: unknown, maximum: number) { return typeof value === "string" ? value.trim().slice(0, maximum) : ""; }
function valid(value: unknown): value is CoachResult { return !!value && typeof value === "object" && typeof (value as CoachResult).priority === "string" && typeof (value as CoachResult).explanation === "string" && Array.isArray((value as CoachResult).options) && (value as CoachResult).options.length <= 3 && typeof (value as CoachResult).practice === "string" && focuses.has((value as CoachResult).focus) && ["first", "improved", "keep-practising"].includes((value as CoachResult).outcome); }
function sign(value: string, key: string) { return createHmac("sha256", key).update(value).digest("base64url"); }
function browserCount(request: NextRequest, key: string) { const token = request.cookies.get("sseugi_coach_day")?.value; if (!token) return 0; const [payload, signature] = token.split("."); if (!payload || !signature) return 0; const expected = sign(payload, key); if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return 0; try { const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); return Number.isInteger(parsed.count) && Number.isFinite(parsed.until) && parsed.until > Date.now() ? parsed.count : 0; } catch { return 0; } }
function browserCookie(count: number, key: string) { const payload = Buffer.from(JSON.stringify({ count, until: Date.now() + 86_400_000 })).toString("base64url"); return `${payload}.${sign(payload, key)}`; }

export async function POST(request: NextRequest) {
  const key = process.env.SSEUGI_GEMINI_API_KEY;
  if (!key || process.env.SSEUGI_AI_ENABLED !== "true") return NextResponse.json({ error: "The public AI coach is not enabled yet." }, { status: 503 });
  let body: Body; try { body = await request.json() as Body; } catch { return NextResponse.json({ error: "Please check the request." }, { status: 400 }); }
  const scenario = clean(body.scenario, 30), context = clean(body.context, 400), draft = clean(body.draft, 1200), originalDraft = clean(body.originalDraft, 1200), previousFocus = clean(body.previousFocus, 30), mode = body.mode === "rewrite" ? "rewrite" : "first";
  if (!allowedScenarios.has(scenario) || draft.length < 5 || body.consent !== true) return NextResponse.json({ error: "Choose a situation, write a short draft, and confirm AI feedback." }, { status: 400 });
  const usedByBrowser = browserCount(request, key); if (usedByBrowser >= browserLimit) return NextResponse.json({ error: "The free coach limit for this browser is reached for today. Try again tomorrow." }, { status: 429 }); if (!visitor(request)) return NextResponse.json({ error: "The free coach limit is reached for today. Try again tomorrow." }, { status: 429 });
  if (mode === "rewrite" && (!originalDraft || !focuses.has(previousFocus as Focus))) return NextResponse.json({ error: "Write a first draft and receive feedback before checking a revision." }, { status: 400 });
  const prompt = mode === "rewrite"
    ? `You are Sseugi, a careful Korean writing tutor. The learner's language is English. They revised a Korean sentence after feedback. Scenario: ${scenario}. Optional context: ${context || "not provided"}. Original draft: ${originalDraft}. The earlier focus was ${previousFocus}. Revised draft: ${draft}. Compare the two. If the key issue is materially improved, celebrate specifically and set outcome to improved. Otherwise, explain one remaining high-value change only and set outcome to keep-practising. Preserve intent. Explain in simple English. Give at most 2 natural Korean alternatives and one short next practice. Classify the remaining or demonstrated skill as exactly one of particles, formality, wording, naturalness, clarity, spacing. Do not claim TOPIK scoring, do not invent context, and never ask for personal information. Return JSON only with priority, explanation, options, practice, focus, outcome.`
    : `You are Sseugi, a careful Korean writing tutor. The learner's language is English. Their scenario is ${scenario}. Their optional context is: ${context || "not provided"}. Their Korean draft is: ${draft}. Give one high-value correction only. Preserve the learner's intent. Explain why it matters in simple English. Give at most 3 natural Korean alternatives, not a long lecture. Then give one short next practice. Classify this one correction as exactly one of particles, formality, wording, naturalness, clarity, spacing. Set outcome to first. Do not claim TOPIK scoring, do not invent context, and never ask for personal information. Return JSON only with priority, explanation, options, practice, focus, outcome.`;
  try {
    const models = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
    let response: Response | undefined;
    for (const model of models) { const attempt = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.25, maxOutputTokens: 700 } }), signal: AbortSignal.timeout(20_000) }); response = attempt; if (attempt.ok || attempt.status !== 429) break; }
    if (!response?.ok) return NextResponse.json({ error: "The coach is busy. Your draft was not saved." }, { status: 502 });
    const data = await response.json(); const text = data?.candidates?.[0]?.content?.parts?.[0]?.text; const parsed = typeof text === "string" ? JSON.parse(text) : null;
    if (!valid(parsed)) return NextResponse.json({ error: "The coach could not verify this feedback." }, { status: 502 });
    const responseBody = NextResponse.json({ priority: parsed.priority.slice(0, 160), explanation: parsed.explanation.slice(0, 700), options: parsed.options.filter((item): item is string => typeof item === "string").map((item) => item.slice(0, 300)), practice: parsed.practice.slice(0, 300), focus: parsed.focus, outcome: parsed.outcome }, { headers: { "cache-control": "no-store" } });
    responseBody.cookies.set("sseugi_coach_day", browserCookie(usedByBrowser + 1, key), { httpOnly: true, sameSite: "lax", secure: true, maxAge: 86_400, path: "/" }); return responseBody;
  } catch { return NextResponse.json({ error: "The coach could not be reached. Your draft was not saved." }, { status: 502 }); }
}
