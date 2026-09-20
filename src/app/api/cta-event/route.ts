import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { detectBot } from "@/lib/bot-detection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_TYPES = new Set(["shown", "closed", "click_instagram", "click_telegram"]);
const TRIGGERS = new Set(["time", "scroll", "exit"]);
const DEVICES = new Set(["mobile", "desktop"]);
const ID_RE = /^[A-Za-z0-9-]{8,64}$/;

// POST /api/cta-event — ijtimoiy tarmoq CTA modalining voronka hodisalari.
// Body: { impressionId, visitorId, eventType, trigger?, path?, device? }
// Botlar va admin/assistant hisobga olinmaydi (statistika real odamlar uchun).
// IP va User-Agent saqlanmaydi.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const impressionId = typeof body.impressionId === "string" ? body.impressionId : "";
  const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
  const eventType = typeof body.eventType === "string" ? body.eventType : "";
  if (!ID_RE.test(impressionId) || !ID_RE.test(visitorId) || !EVENT_TYPES.has(eventType)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (detectBot(request.headers.get("user-agent"))) {
    return NextResponse.json({ ok: true });
  }

  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role === "admin" || role === "assistant") {
    return NextResponse.json({ ok: true });
  }

  const trigger =
    eventType === "shown" && typeof body.trigger === "string" && TRIGGERS.has(body.trigger)
      ? body.trigger
      : null;
  const device = typeof body.device === "string" && DEVICES.has(body.device) ? body.device : null;
  const path =
    typeof body.path === "string" && body.path.startsWith("/") ? body.path.slice(0, 300) : null;

  try {
    await prisma.ctaEvent.create({
      data: { impressionId, visitorId, eventType, trigger, path, device },
    });
  } catch (e) {
    // (impressionId, eventType) unique — takroriy yuborishni jimgina o'tkazib yuboramiz
    const code = (e as { code?: string }).code;
    if (code !== "P2002") console.error("[cta-event] write failed", e);
  }

  return NextResponse.json({ ok: true });
}
