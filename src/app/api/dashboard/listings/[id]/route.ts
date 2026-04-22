import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Ctx { params: Promise<{ id: string }> }

// GET /api/dashboard/listings/:id — fetch a single listing owned by the current teacher
export async function GET(_request: Request, { params }: Ctx) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!listing || listing.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ listing });
}

// PATCH /api/dashboard/listings/:id — pause/activate own listing + edit fields
export async function PATCH(request: Request, { params }: Ctx) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const existing = await prisma.listing.findUnique({ where: { id: listingId }, select: { userId: true, status: true } });
  if (!existing || existing.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  // Teacher can only toggle between active/paused; setting other statuses forbidden
  if (body.status === "active" || body.status === "paused") {
    if (existing.status === "pending" || existing.status === "rejected") {
      return NextResponse.json({ error: "Bu e'lon hali tasdiqlanmagan" }, { status: 400 });
    }
    data.status = body.status;
  }

  for (const k of ["title", "description", "price", "duration", "location", "color", "icon", "imageUrl"] as const) {
    if (body[k] !== undefined) data[k] = body[k];
  }
  if (body.imagePosX !== undefined) data.imagePosX = Math.max(0, Math.min(100, Number(body.imagePosX)));
  if (body.imagePosY !== undefined) data.imagePosY = Math.max(0, Math.min(100, Number(body.imagePosY)));
  if (body.imageAPosX !== undefined) data.imageAPosX = Math.max(0, Math.min(100, Number(body.imageAPosX)));
  if (body.imageAPosY !== undefined) data.imageAPosY = Math.max(0, Math.min(100, Number(body.imageAPosY)));
  if (body.imageAMPosX !== undefined) data.imageAMPosX = Math.max(0, Math.min(100, Number(body.imageAMPosX)));
  if (body.imageAMPosY !== undefined) data.imageAMPosY = Math.max(0, Math.min(100, Number(body.imageAMPosY)));
  if (body.imageCPosX !== undefined) data.imageCPosX = Math.max(0, Math.min(100, Number(body.imageCPosX)));
  if (body.imageCPosY !== undefined) data.imageCPosY = Math.max(0, Math.min(100, Number(body.imageCPosY)));
  if (body.imageCMPosX !== undefined) data.imageCMPosX = Math.max(0, Math.min(100, Number(body.imageCMPosX)));
  if (body.imageCMPosY !== undefined) data.imageCMPosY = Math.max(0, Math.min(100, Number(body.imageCMPosY)));
  if (body.imageZoom !== undefined) data.imageZoom = Math.max(100, Math.min(300, Number(body.imageZoom)));
  if (body.imageAZoom !== undefined) data.imageAZoom = Math.max(100, Math.min(300, Number(body.imageAZoom)));
  if (body.imageAMZoom !== undefined) data.imageAMZoom = Math.max(100, Math.min(300, Number(body.imageAMZoom)));
  if (body.imageCZoom !== undefined) data.imageCZoom = Math.max(100, Math.min(300, Number(body.imageCZoom)));
  if (body.imageCMZoom !== undefined) data.imageCMZoom = Math.max(100, Math.min(300, Number(body.imageCMZoom)));

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const listing = await prisma.listing.update({ where: { id: listingId }, data });
  return NextResponse.json({ listing });
}

// DELETE /api/dashboard/listings/:id — delete own listing
export async function DELETE(_request: Request, { params }: Ctx) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const existing = await prisma.listing.findUnique({ where: { id: listingId }, select: { userId: true } });
  if (!existing || existing.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.listing.delete({ where: { id: listingId } });
  return NextResponse.json({ ok: true });
}
