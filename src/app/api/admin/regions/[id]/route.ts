import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[''ʻ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// PATCH /api/admin/regions/:id
// body: { name?, slug?, active?, featured? }
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const rid = Number(id);
  if (!rid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const n = String(body.name).trim();
    if (n.length < 2) return NextResponse.json({ error: "Nom qisqa" }, { status: 400 });
    data.name = n;
  }
  if (body.slug !== undefined) {
    const s = slugify(String(body.slug));
    if (!s) return NextResponse.json({ error: "Slug noto'g'ri" }, { status: 400 });
    data.slug = s;
  }
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.featured !== undefined) data.featured = Boolean(body.featured);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Hech nima yangilanmadi" }, { status: 400 });
  }

  try {
    const region = await prisma.region.update({ where: { id: rid }, data });
    return NextResponse.json({ region });
  } catch {
    return NextResponse.json({ error: "Yangilab bo'lmadi (band yoki topilmadi)" }, { status: 400 });
  }
}

// DELETE /api/admin/regions/:id
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const rid = Number(id);
  if (!rid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  // Listing.region text bo'lgani uchun foreign key cheklov yo'q.
  // Lekin ogohlantirish uchun: shu nomdagi listinglar bo'lsa qoldiramiz (text qoladi).
  await prisma.region.delete({ where: { id: rid } });
  return NextResponse.json({ ok: true });
}
