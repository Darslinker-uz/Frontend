import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/categories
//   Returns the full taxonomy: groups -> categories nested.
//   Used by listing forms (group + category cascade dropdowns) and the public
//   /kurslar filter UI.
export async function GET() {
  const groups = await prisma.categoryGroup.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      icon: true,
      color: true,
      categories: {
        where: { active: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          _count: { select: { listings: { where: { status: "active" } } } },
        },
      },
    },
  });

  return NextResponse.json({ groups });
}
