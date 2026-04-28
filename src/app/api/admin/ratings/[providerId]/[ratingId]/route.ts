import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ providerId: string; ratingId: string }> }

// PATCH /api/admin/ratings/:providerId/:ratingId — admin can edit stars + comment
// (used to clean spam / reword inappropriate text).
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { ratingId } = await params;
  const id = Number(ratingId);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (body.stars !== undefined) {
    const s = Number(body.stars);
    if (!Number.isFinite(s) || s < 1 || s > 5) {
      return NextResponse.json({ error: "Yulduz 1-5 oraliqda" }, { status: 400 });
    }
    data.stars = Math.round(s);
  }
  if (body.comment !== undefined) {
    data.comment = body.comment ? String(body.comment).trim().slice(0, 500) || null : null;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Hech nima yangilanmadi" }, { status: 400 });
  }

  const rating = await prisma.rating.update({ where: { id }, data });
  return NextResponse.json({ rating });
}

// DELETE /api/admin/ratings/:providerId/:ratingId — full removal (spam case).
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { ratingId } = await params;
  const id = Number(ratingId);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.rating.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
