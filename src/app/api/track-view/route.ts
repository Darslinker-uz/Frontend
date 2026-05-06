import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectBot } from "@/lib/bot-detection";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Internal beacon — middleware'dan chaqiriladi.
// Public POST'larni cheklash uchun: O'zining origin'idan kelganini tekshiramiz.
// (CSRF emas, oddiy spam blok uchun.)
export async function POST(request: Request) {
  let body: { path?: string; userAgent?: string; referrer?: string; sessionId?: string; ip?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = (body.path ?? "").slice(0, 500);
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });

  const userAgent = body.userAgent?.slice(0, 500) ?? null;
  const referrer = body.referrer?.slice(0, 500) ?? null;
  const sessionId = body.sessionId?.slice(0, 100) ?? null;
  const bot = detectBot(userAgent);

  const ipHash = body.ip
    ? createHash("sha256").update(body.ip + new Date().toISOString().slice(0, 10)).digest("hex").slice(0, 16)
    : null;

  await prisma.pageView.create({
    data: {
      path,
      userAgent,
      botName: bot?.name ?? null,
      botCategory: bot?.category ?? null,
      sessionId,
      ipHash,
      referrer,
    },
  }).catch((e) => {
    console.error("[track-view] write failed", e);
  });

  return NextResponse.json({ ok: true });
}
