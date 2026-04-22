import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/featured — active A-class boosts for homepage slider
export async function GET() {
  const now = new Date();
  const boosts = await prisma.boost.findMany({
    where: {
      status: "active",
      type: "a_class",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { startDate: "desc" },
    take: 10,
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          format: true,
          location: true,
          duration: true,
          imageUrl: true,
          imagePosX: true,
          imagePosY: true,
          imageAPosX: true,
          imageAPosY: true,
          imageAMPosX: true,
          imageAMPosY: true,
          imageCPosX: true,
          imageCPosY: true,
          imageCMPosX: true,
          imageCMPosY: true,
          imageZoom: true,
          imageAZoom: true,
          imageAMZoom: true,
          imageCZoom: true,
          imageCMZoom: true,
          color: true,
          icon: true,
          views: true,
          status: true,
          category: { select: { id: true, name: true, slug: true, color: true } },
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

  const listings = boosts
    .map(b => b.listing)
    .filter(l => l.status === "active");

  return NextResponse.json({ listings });
}
