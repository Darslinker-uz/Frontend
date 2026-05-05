import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Ctx { params: Promise<{ slug: string }> }

// GET /api/listings/:slug — full detail (view increment yo'q)
export async function GET(_request: Request, { params }: Ctx) {
  const { slug } = await params;

  const listing = await prisma.listing.findFirst({
    where: {
      slug,
      category: { active: true, pendingApproval: false },
    },
    include: {
      category: { select: { id: true, name: true, slug: true, color: true, group: { select: { id: true, name: true, slug: true } } } },
      user: { select: { id: true, name: true, centerName: true, phone: true } },
      _count: { select: { leads: true, reviews: true } },
    },
  });

  if (!listing || listing.status !== "active") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

// Daily-rotating IP hash (privacy + stable for the day)
async function hashIpForDay(ip: string): Promise<string | null> {
  if (!ip) return null;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const enc = new TextEncoder().encode(`${ip}:${today}`);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
}

// POST /api/listings/:slug — view count'ni 1 ga oshiradi va ViewEvent yozadi.
// Client-side mount paytida chaqiriladi (sessiya'da dedup).
// Body: { sessionId?: string, referrer?: string | null }
export async function POST(request: Request, { params }: Ctx) {
  const { slug } = await params;

  let sessionId: string | null = null;
  let referrer: string | null = null;
  try {
    const body = await request.json();
    if (typeof body?.sessionId === "string") sessionId = body.sessionId.slice(0, 100);
    if (typeof body?.referrer === "string") referrer = body.referrer.slice(0, 500);
  } catch {}

  const ipHeader = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "";
  const ip = ipHeader.split(",")[0].trim();
  const ipHash = await hashIpForDay(ip);

  const listing = await prisma.listing.findFirst({
    where: { slug, status: "active" },
    select: { id: true },
  });
  if (!listing) return NextResponse.json({ ok: false }, { status: 404 });

  await Promise.all([
    prisma.listing.update({
      where: { id: listing.id },
      data: { views: { increment: 1 } },
    }),
    prisma.viewEvent.create({
      data: { listingId: listing.id, sessionId, ipHash, referrer },
    }),
  ]).catch(e => console.error("[view] tracking failed", e));

  return NextResponse.json({ ok: true });
}
