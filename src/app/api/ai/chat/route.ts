import { NextResponse } from "next/server";
import { processWebAi, createWebSessionId, type WebAiAction } from "@/lib/web-ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`web-ai:${ip}`, { limit: 40, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: { sessionId?: string; action?: WebAiAction };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.action?.type) {
    return NextResponse.json({ error: "action majburiy" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim() || createWebSessionId();
  const result = await processWebAi(sessionId, body.action);
  return NextResponse.json(result);
}
