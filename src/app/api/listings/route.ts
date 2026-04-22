import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/listings
// Query params: ?category=<slug>&format=offline|online|video&priceFree=true|false&city=<search>&search=<q>&limit=<n>
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const format = searchParams.get("format") as "offline" | "online" | "video" | null;
  const priceFree = searchParams.get("priceFree");
  const city = searchParams.get("city");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");

  const where: Record<string, unknown> = { status: "active" };
  if (categorySlug) where.category = { slug: categorySlug };
  if (format) where.format = format;
  if (priceFree === "true") where.price = 0;
  if (city) where.location = { contains: city, mode: "insensitive" };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    take: limit ? Math.min(Number(limit), 100) : undefined,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      format: true,
      location: true,
      duration: true,
      phone: true,
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
      createdAt: true,
      category: { select: { id: true, name: true, slug: true, color: true } },
      user: { select: { id: true, name: true } },
      _count: { select: { leads: true } },
    },
  });

  return NextResponse.json({ listings });
}
