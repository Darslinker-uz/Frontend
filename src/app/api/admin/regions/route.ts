import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[''ʻ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/admin/regions — barcha viloyatlar (active va inactive), aktiv listing soni bilan
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const regions = await prisma.region.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  // Aktiv listing soni — Listing.region (text) bilan name'ga match
  const counts = await prisma.listing.groupBy({
    by: ["region"],
    where: { status: "active" },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.region, c._count._all]));

  const enriched = regions.map((r) => ({
    ...r,
    listingCount: countMap.get(r.name) ?? 0,
  }));

  return NextResponse.json({ regions: enriched });
}

// POST /api/admin/regions — yangi viloyat
// body: { name, slug?, active?, featured? }
export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body: { name?: string; slug?: string; active?: boolean; featured?: boolean };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (name.length < 2) return NextResponse.json({ error: "Nom kamida 2 belgi" }, { status: 400 });

  let slug = body.slug ? slugify(body.slug) : slugify(name);
  if (!slug) slug = `region-${Date.now()}`;

  // Slug'nin unikalligini tekshirish
  const exists = await prisma.region.findFirst({ where: { OR: [{ slug }, { name }] } });
  if (exists) return NextResponse.json({ error: "Bu nom yoki slug band" }, { status: 400 });

  // Order — eng oxirga qo'shamiz
  const last = await prisma.region.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
  const order = (last?.order ?? 0) + 1;

  const region = await prisma.region.create({
    data: {
      name,
      slug,
      active: body.active ?? true,
      featured: body.featured ?? false,
      order,
    },
  });

  return NextResponse.json({ region }, { status: 201 });
}

// PATCH /api/admin/regions — drag-drop tartib o'zgartirish
// body: { order: [{id, order}] }
export async function PATCH(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body: { order?: { id: number; order: number }[] };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.order)) {
    return NextResponse.json({ error: "order array kerak" }, { status: 400 });
  }

  await prisma.$transaction(
    body.order.map((o) =>
      prisma.region.update({ where: { id: o.id }, data: { order: o.order } })
    )
  );

  return NextResponse.json({ ok: true });
}
