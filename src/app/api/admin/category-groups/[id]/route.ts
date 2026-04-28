import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/category-groups/:id — guruhni tahrirlash
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const gid = Number(id);
  if (!gid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return NextResponse.json({ error: "name bo'sh bo'lmasin" }, { status: 400 });
    data.name = name;
  }
  if (body.slug !== undefined) {
    const slug = String(body.slug).trim().toLowerCase();
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "slug noto'g'ri" }, { status: 400 });
    }
    data.slug = slug;
  }
  if (body.description !== undefined) data.description = body.description ? String(body.description).trim() || null : null;
  if (body.icon !== undefined) data.icon = body.icon ? String(body.icon) : null;
  if (body.color !== undefined) data.color = body.color ? String(body.color) : null;
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.order !== undefined) data.order = Number(body.order) || 0;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Hech nima yangilanmadi" }, { status: 400 });
  }

  const group = await prisma.categoryGroup.update({ where: { id: gid }, data });
  return NextResponse.json({ group });
}

// DELETE /api/admin/category-groups/:id — guruhni o'chirish (faqat ichida yo'nalish bo'lmasa)
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const gid = Number(id);
  if (!gid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const count = await prisma.category.count({ where: { groupId: gid } });
  if (count > 0) {
    return NextResponse.json({ error: `Guruh ichida ${count} ta yo'nalish bor. Avval ularni boshqa guruhga ko'chiring yoki o'chiring.` }, { status: 400 });
  }
  await prisma.categoryGroup.delete({ where: { id: gid } });
  return NextResponse.json({ ok: true });
}
