import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const cid = Number(id);
  if (!cid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  for (const k of ["name", "slug", "description", "icon", "color", "active", "order"] as const) {
    if (body[k] !== undefined) data[k] = body[k];
  }
  if (Array.isArray(body.subcategories)) data.subcategories = body.subcategories;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const cat = await prisma.category.update({ where: { id: cid }, data });
  return NextResponse.json({ category: cat });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const cid = Number(id);
  if (!cid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  // Check if any listing uses this category
  const count = await prisma.listing.count({ where: { categoryId: cid } });
  if (count > 0) {
    return NextResponse.json({ error: `Kategoriyada ${count} ta e'lon bor, avval ularni boshqa kategoriyaga ko'chiring.` }, { status: 400 });
  }
  await prisma.category.delete({ where: { id: cid } });
  return NextResponse.json({ ok: true });
}
