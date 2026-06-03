import { NextResponse } from "next/server";
import { chatCompletionMessages, type ChatTurn } from "@/lib/openai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function parseMessages(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ChatTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || !content.trim()) return null;
    out.push({ role, content: content.trim().slice(0, 8000) });
  }
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out.slice(-40);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`gptozi:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = parseMessages(body.messages);
  if (!messages) {
    return NextResponse.json({ error: "messages kerak (oxirgi — user)" }, { status: 400 });
  }

  const { text, error } = await chatCompletionMessages({ messages });
  if (error) {
    return NextResponse.json({ error }, { status: 502 });
  }
  if (!text) {
    return NextResponse.json({ error: "Javob bo'sh" }, { status: 502 });
  }

  return NextResponse.json({ reply: text });
}
