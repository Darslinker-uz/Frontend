import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories — public, active only
export async function GET() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      icon: true,
      color: true,
      subcategories: true,
      _count: { select: { listings: { where: { status: "active" } } } },
    },
  });

  return NextResponse.json({ categories });
}
