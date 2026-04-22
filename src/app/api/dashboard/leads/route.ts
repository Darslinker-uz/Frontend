import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/dashboard/leads — all leads for current teacher's listings
export async function GET() {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    where: { listing: { userId } },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, slug: true } },
    },
  });

  return NextResponse.json({ leads });
}
