import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/category-groups — barcha guruhlar (admin uchun, hammasi: aktiv+yashirin)
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const groups = await prisma.categoryGroup.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { categories: true } } },
  });
  return NextResponse.json({ groups });
}

// POST /api/admin/category-groups — yangi guruh yaratish
// Body: { name, slug, description?, icon?, color?, order? }
export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim().toLowerCase();
  if (!name || !slug) {
    return NextResponse.json({ error: "name va slug majburiy" }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "slug faqat kichik harf, raqam va '-' bo'lishi mumkin" }, { status: 400 });
  }

  const existing = await prisma.categoryGroup.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (existing) {
    return NextResponse.json({ error: "Bu nomli yoki sluglik guruh allaqachon mavjud" }, { status: 400 });
  }

  const last = await prisma.categoryGroup.findFirst({ orderBy: { order: "desc" } });
  const group = await prisma.categoryGroup.create({
    data: {
      name,
      slug,
      description: body.description ? String(body.description).trim() || null : null,
      icon: body.icon ? String(body.icon) : null,
      color: body.color ? String(body.color) : null,
      order: body.order ?? (last ? last.order + 1 : 0),
      active: body.active ?? true,
    },
  });
  return NextResponse.json({ group }, { status: 201 });
}
