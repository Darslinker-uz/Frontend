import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyListingPending } from "@/lib/bot-handler";

// Maps from UI-friendly format labels to DB enum
const FORMAT_MAP: Record<string, "offline" | "online" | "video"> = {
  "Onlayn": "online",
  "Oflayn": "offline",
  "Gibrid": "offline",
  "Video": "video",
};

// GET /api/dashboard/listings — current teacher's listings
export async function GET() {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const listings = await prisma.listing.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true, color: true } },
      _count: { select: { leads: true, boosts: true } },
    },
  });
  return NextResponse.json({ listings });
}

// POST /api/dashboard/listings — create new listing (goes to pending moderation)
export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; phone?: string } | undefined;
  const userId = Number(user?.id);
  if (!userId || (user?.role !== "provider" && user?.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const categoryName = String(body.category ?? "").trim();
  const formatLabel = String(body.format ?? "").trim();
  const price = body.priceFree ? 0 : Number(body.price) || 0;
  const duration = body.duration ? String(body.duration).trim() : null;
  const description = body.description ? String(body.description).trim() : null;
  const location = body.location ? String(body.location).trim() : null;
  const color = body.color ? String(body.color) : null;
  const icon = body.icon ? String(body.icon) : null;
  const imageUrl = body.imageUrl ? String(body.imageUrl) : null;
  const imagePosX = body.imagePosX !== undefined ? Math.max(0, Math.min(100, Number(body.imagePosX))) : 50;
  const imagePosY = body.imagePosY !== undefined ? Math.max(0, Math.min(100, Number(body.imagePosY))) : 50;
  const imageAPosX = body.imageAPosX !== undefined ? Math.max(0, Math.min(100, Number(body.imageAPosX))) : 50;
  const imageAPosY = body.imageAPosY !== undefined ? Math.max(0, Math.min(100, Number(body.imageAPosY))) : 50;
  const imageAMPosX = body.imageAMPosX !== undefined ? Math.max(0, Math.min(100, Number(body.imageAMPosX))) : 50;
  const imageAMPosY = body.imageAMPosY !== undefined ? Math.max(0, Math.min(100, Number(body.imageAMPosY))) : 50;
  const imageCPosX = body.imageCPosX !== undefined ? Math.max(0, Math.min(100, Number(body.imageCPosX))) : 50;
  const imageCPosY = body.imageCPosY !== undefined ? Math.max(0, Math.min(100, Number(body.imageCPosY))) : 50;
  const imageCMPosX = body.imageCMPosX !== undefined ? Math.max(0, Math.min(100, Number(body.imageCMPosX))) : 50;
  const imageCMPosY = body.imageCMPosY !== undefined ? Math.max(0, Math.min(100, Number(body.imageCMPosY))) : 50;
  const imageZoom = body.imageZoom !== undefined ? Math.max(100, Math.min(300, Number(body.imageZoom))) : 100;
  const imageAZoom = body.imageAZoom !== undefined ? Math.max(100, Math.min(300, Number(body.imageAZoom))) : 100;
  const imageAMZoom = body.imageAMZoom !== undefined ? Math.max(100, Math.min(300, Number(body.imageAMZoom))) : 100;
  const imageCZoom = body.imageCZoom !== undefined ? Math.max(100, Math.min(300, Number(body.imageCZoom))) : 100;
  const imageCMZoom = body.imageCMZoom !== undefined ? Math.max(100, Math.min(300, Number(body.imageCMZoom))) : 100;

  if (!title || title.length < 3) return NextResponse.json({ error: "Kurs nomi kamida 3 belgi" }, { status: 400 });
  if (!categoryName) return NextResponse.json({ error: "Kategoriya majburiy" }, { status: 400 });
  if (!formatLabel) return NextResponse.json({ error: "Format majburiy" }, { status: 400 });

  const format = FORMAT_MAP[formatLabel];
  if (!format) return NextResponse.json({ error: "Format noto'g'ri" }, { status: 400 });

  const category = await prisma.category.findFirst({ where: { name: categoryName } });
  if (!category) return NextResponse.json({ error: "Kategoriya topilmadi" }, { status: 400 });

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) + "-" + Math.random().toString(36).slice(2, 7);

  const listing = await prisma.listing.create({
    data: {
      userId,
      categoryId: category.id,
      title,
      slug,
      description,
      price,
      format,
      location,
      duration,
      phone: user?.phone ?? "",
      color,
      icon,
      imageUrl,
      imagePosX,
      imagePosY,
      imageAPosX,
      imageAPosY,
      imageAMPosX,
      imageAMPosY,
      imageCPosX,
      imageCPosY,
      imageCMPosX,
      imageCMPosY,
      imageZoom,
      imageAZoom,
      imageAMZoom,
      imageCZoom,
      imageCMZoom,
      status: "pending", // requires admin approval
    },
  });

  const teacher = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
  notifyListingPending({
    title,
    centerName: teacher?.name ?? "—",
    category: category.name,
    price,
    listingId: listing.id,
    createdAt: listing.createdAt,
  }).catch(e => console.error("[listing-pending] telegram notify failed", e));

  return NextResponse.json({ listing }, { status: 201 });
}
