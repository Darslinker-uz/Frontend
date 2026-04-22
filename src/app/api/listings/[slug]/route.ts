import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Ctx { params: Promise<{ slug: string }> }

// GET /api/listings/:slug — full detail + increment views
export async function GET(_request: Request, { params }: Ctx) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true, color: true } },
      user: { select: { id: true, name: true, phone: true } },
      _count: { select: { leads: true, reviews: true } },
    },
  });

  if (!listing || listing.status !== "active") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fire-and-forget view increment (no await to keep response fast)
  prisma.listing.update({ where: { id: listing.id }, data: { views: { increment: 1 } } })
    .catch(e => console.error("view increment failed", e));

  return NextResponse.json({ listing });
}
