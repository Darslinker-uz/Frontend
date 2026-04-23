import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyListingApproved, notifyListingRejected } from "@/lib/bot-handler";
import type { ListingStatus } from "@/generated/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

const ALLOWED_STATUS: ListingStatus[] = ["pending", "active", "paused", "rejected"];

// GET /api/admin/listings/:id — bitta e'lon batafsil
export async function GET(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      user: { select: { id: true, name: true, centerName: true, phone: true, telegramChatId: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
      _count: { select: { leads: true, boosts: true, reviews: true } },
    },
  });

  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ listing });
}

// PATCH /api/admin/listings/:id — approve / reject / pause / edit
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.status && ALLOWED_STATUS.includes(body.status)) data.status = body.status;
  if (body.rejectReason !== undefined) data.rejectReason = body.rejectReason;
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.format !== undefined) data.format = body.format;
  if (body.location !== undefined) data.location = body.location;
  if (body.duration !== undefined) data.duration = body.duration;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.color !== undefined) data.color = body.color;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
  if (body.categoryId !== undefined) data.categoryId = Number(body.categoryId);

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

  // Previous status to detect a real transition for notifications
  const prev = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { status: true },
  });

  const listing = await prisma.listing.update({
    where: { id: listingId },
    data,
    include: {
      user: { select: { id: true, name: true, centerName: true, phone: true, telegramChatId: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
    },
  });

  // Notify teacher on pending → active (approved) or pending → rejected
  if (prev?.status === "pending" && data.status && listing.user.telegramChatId) {
    if (data.status === "active") {
      notifyListingApproved({
        teacherChatId: listing.user.telegramChatId,
        title: listing.title,
        listingSlug: listing.slug,
        categorySlug: listing.category.slug,
      }).catch(e => console.error("[admin-listings] notify approved failed", e));
    } else if (data.status === "rejected") {
      notifyListingRejected({
        teacherChatId: listing.user.telegramChatId,
        title: listing.title,
        reason: String(data.rejectReason ?? listing.rejectReason ?? "Sabab ko'rsatilmagan"),
      }).catch(e => console.error("[admin-listings] notify rejected failed", e));
    }
  }

  return NextResponse.json({ listing });
}

// DELETE /api/admin/listings/:id
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.listing.delete({ where: { id: listingId } });
  return NextResponse.json({ ok: true });
}
