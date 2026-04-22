import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/categories
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { listings: true } } },
  });
  return NextResponse.json({ categories });
}

// POST /api/admin/categories — body: { name, slug, description?, icon?, color?, subcategories?[], order? }
export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await request.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: "name and slug required" }, { status: 400 });
  }
  const last = await prisma.category.findFirst({ orderBy: { order: "desc" } });
  const cat = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      icon: body.icon ?? null,
      color: body.color ?? null,
      subcategories: Array.isArray(body.subcategories) ? body.subcategories : [],
      order: body.order ?? (last ? last.order + 1 : 1),
      active: body.active ?? true,
    },
  });
  return NextResponse.json({ category: cat }, { status: 201 });
}
