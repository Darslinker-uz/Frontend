import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/manba — public, faqat published maqolalar
// Query: ?type=lugat|qollanma|sharh|savol & limit=N
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = Number(searchParams.get("limit")) || undefined;

  // Manba public listidan blog tipini chetlatamiz (ular /blog da ko'rinadi)
  const where: Record<string, unknown> = {
    status: "published",
    type: { in: ["lugat", "qollanma", "sharh", "savol"] },
  };
  if (type === "lugat" || type === "qollanma" || type === "sharh" || type === "savol") {
    where.type = type;
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      type: true,
      coverImage: true,
      views: true,
      publishedAt: true,
      category: { select: { id: true, name: true, slug: true } },
      group: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json({ articles });
}
