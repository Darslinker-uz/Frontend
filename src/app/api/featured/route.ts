import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX = 10;

const listingSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  format: true,
  location: true,
  region: true,
  district: true,
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
  imageDarkness: true,
  color: true,
  icon: true,
  views: true,
  status: true,
  category: { select: { id: true, name: true, slug: true, color: true } },
  user: { select: { id: true, name: true, centerName: true } },
} as const;

// GET /api/featured — A-class boost'lar + random non-paid bilan to'ldirish, max 10
export async function GET() {
  const now = new Date();

  // 1) Aktiv A-class boost'lar
  const boosts = await prisma.boost.findMany({
    where: {
      status: "active",
      type: "a_class",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { startDate: "desc" },
    take: MAX,
    include: { listing: { select: listingSelect } },
  });

  const paid = boosts
    .map(b => b.listing)
    .filter(l => l.status === "active");
  const paidIds = new Set(paid.map(l => l.id));

  // 2) Joy qolsa — random non-paid e'lonlar bilan to'ldirish
  const remaining = MAX - paid.length;
  let nonPaid: typeof paid = [];
  if (remaining > 0) {
    const others = await prisma.listing.findMany({
      where: {
        status: "active",
        id: { notIn: Array.from(paidIds) },
        category: { active: true, pendingApproval: false },
        imageUrl: { not: null }, // Faqat rasmli e'lonlar
      },
      select: listingSelect,
    });
    // Tasodifiy aralashtirib N tasini olamiz
    nonPaid = others
      .map(l => ({ l, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .slice(0, remaining)
      .map(x => x.l);
  }

  const listings = [...paid, ...nonPaid];
  return NextResponse.json({ listings });
}
