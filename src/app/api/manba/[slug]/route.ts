import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Ctx { params: Promise<{ slug: string }> }

// GET /api/manba/:slug — public, faqat published
export async function GET(_request: Request, { params }: Ctx) {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: { slug, status: "published" },
    include: {
      category: { select: { id: true, name: true, slug: true, group: { select: { name: true, slug: true } } } },
      group: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Maqola topilmadi" }, { status: 404 });
  }

  // Fire-and-forget view increment
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch(e => console.error("[manba] view increment failed", e));

  return NextResponse.json({ article });
}
