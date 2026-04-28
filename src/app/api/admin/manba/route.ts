import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

// GET /api/admin/manba — barcha maqolalar (draft+published)
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const articles = await prisma.article.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      category: { select: { id: true, name: true, slug: true } },
      group: { select: { id: true, name: true, slug: true } },
    },
  });
  return NextResponse.json({ articles });
}

// POST /api/admin/manba — yangi maqola yaratish
// Body: { type, title, slug?, excerpt?, content, coverImage?, status?, categoryId?, groupId? }
export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await request.json();

  const allowedTypes = ["lugat", "qollanma", "sharh", "savol", "blog"] as const;
  const type = String(body.type ?? "");
  if (!allowedTypes.includes(type as (typeof allowedTypes)[number])) {
    return NextResponse.json({ error: "Noto'g'ri turi (lugat/qollanma/sharh/savol/blog)" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  if (!title || title.length < 3) {
    return NextResponse.json({ error: "Sarlavha kamida 3 belgi" }, { status: 400 });
  }

  const content = String(body.content ?? "").trim();
  if (!content || content.length < 20) {
    return NextResponse.json({ error: "Matn kamida 20 belgi" }, { status: 400 });
  }

  // Slug auto-gen agar berilmagan bo'lsa
  let slug = String(body.slug ?? "").trim().toLowerCase();
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[''ʻ`]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    if (!slug) slug = `article-${Date.now()}`;
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "slug faqat kichik harf, raqam va '-' bo'lishi mumkin" }, { status: 400 });
  }

  // To'qnashuv tekshiruvi
  const exists = await prisma.article.findUnique({ where: { slug } });
  if (exists) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const status = body.status === "published" ? "published" : "draft";

  const article = await prisma.article.create({
    data: {
      type: type as "lugat" | "qollanma" | "sharh" | "savol" | "blog",
      title,
      slug,
      excerpt: body.excerpt ? String(body.excerpt).trim().slice(0, 300) || null : null,
      content,
      coverImage: body.coverImage ? String(body.coverImage) : null,
      author: body.author ? String(body.author).trim().slice(0, 80) || null : null,
      readTime: body.readTime ? String(body.readTime).trim().slice(0, 30) || null : null,
      status,
      publishedAt: status === "published" ? new Date() : null,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      groupId: body.groupId ? Number(body.groupId) : null,
    },
  });

  return NextResponse.json({ article }, { status: 201 });
}
