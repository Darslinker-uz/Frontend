import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const aid = Number(id);
  if (!aid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const article = await prisma.article.findUnique({
    where: { id: aid },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      group: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!article) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const aid = Number(id);
  if (!aid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const t = String(body.title).trim();
    if (t.length < 3) return NextResponse.json({ error: "Sarlavha qisqa" }, { status: 400 });
    data.title = t;
  }
  if (body.slug !== undefined) {
    const s = String(body.slug).trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(s)) return NextResponse.json({ error: "slug noto'g'ri" }, { status: 400 });
    data.slug = s;
  }
  if (body.excerpt !== undefined) data.excerpt = body.excerpt ? String(body.excerpt).trim().slice(0, 300) || null : null;
  if (body.content !== undefined) {
    const c = String(body.content).trim();
    if (c.length < 20) return NextResponse.json({ error: "Matn qisqa" }, { status: 400 });
    data.content = c;
  }
  if (body.type !== undefined) {
    const allowed = ["lugat", "qollanma", "sharh", "savol", "blog"];
    if (!allowed.includes(body.type)) return NextResponse.json({ error: "Noto'g'ri turi" }, { status: 400 });
    data.type = body.type;
  }
  if (body.coverImage !== undefined) data.coverImage = body.coverImage || null;
  if (body.author !== undefined) data.author = body.author ? String(body.author).trim().slice(0, 80) || null : null;
  if (body.readTime !== undefined) data.readTime = body.readTime ? String(body.readTime).trim().slice(0, 30) || null : null;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId ? Number(body.categoryId) : null;
  if (body.groupId !== undefined) data.groupId = body.groupId ? Number(body.groupId) : null;

  if (body.status !== undefined) {
    if (body.status !== "draft" && body.status !== "published") {
      return NextResponse.json({ error: "Status noto'g'ri" }, { status: 400 });
    }
    data.status = body.status;
    // publishedAt: agar avval draft edi va endi published bo'lsa, qo'yamiz
    const existing = await prisma.article.findUnique({ where: { id: aid }, select: { status: true, publishedAt: true } });
    if (body.status === "published" && existing && existing.status === "draft") {
      data.publishedAt = new Date();
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Hech nima yangilanmadi" }, { status: 400 });
  }

  const article = await prisma.article.update({ where: { id: aid }, data });
  return NextResponse.json({ article });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const aid = Number(id);
  if (!aid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.article.delete({ where: { id: aid } });
  return NextResponse.json({ ok: true });
}
