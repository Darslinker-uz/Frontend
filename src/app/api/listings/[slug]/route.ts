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

// POST /api/listings/:slug — view count'ni 1 ga oshiradi.
// Client-side mount paytida chaqiriladi (sessiya'da dedup).
// Prefetch va StrictMode duplikatlarini oldini oladi.
export async function POST(_request: Request, { params }: Ctx) {
  const { slug } = await params;
  await prisma.listing.updateMany({
    where: { slug, status: "active" },
    data: { views: { increment: 1 } },
  }).catch(e => console.error("[view] increment failed", e));
  return NextResponse.json({ ok: true });
}
