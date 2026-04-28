import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/categories — full taxonomy with active+inactive (for admin UI)
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const groups = await prisma.categoryGroup.findMany({
    orderBy: { order: "asc" },
    include: {
      categories: {
        orderBy: { order: "asc" },
        include: { _count: { select: { listings: true } } },
      },
    },
  });
  return NextResponse.json({ groups });
}

// POST /api/admin/categories — yangi yo'nalish (Category) yaratish
// Body: { groupId, name, slug, description?, icon?, color?, order?, active? }
export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await request.json();
  if (!body.groupId || !body.name || !body.slug) {
    return NextResponse.json({ error: "groupId, name, slug majburiy" }, { status: 400 });
  }
  const groupId = Number(body.groupId);
  const group = await prisma.categoryGroup.findUnique({ where: { id: groupId } });
  if (!group) return NextResponse.json({ error: "Guruh topilmadi" }, { status: 400 });

  const last = await prisma.category.findFirst({ where: { groupId }, orderBy: { order: "desc" } });
  const cat = await prisma.category.create({
    data: {
      groupId,
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      icon: body.icon ?? null,
      color: body.color ?? null,
      order: body.order ?? (last ? last.order + 1 : 0),
      active: body.active ?? true,
    },
  });
  return NextResponse.json({ category: cat }, { status: 201 });
}
