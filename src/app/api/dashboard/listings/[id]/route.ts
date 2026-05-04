import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyListingPending } from "@/lib/bot-handler";

interface Ctx { params: Promise<{ id: string }> }

// Fields whose change requires re-moderation by admin.
// Visual-only fields (status toggle, image position/zoom) don't trigger re-review.
const REMODERATION_FIELDS = new Set([
  "title",
  "description",
  "price",
  "duration",
  "location",
  "imageUrl",
  "lessons",
  "schedule",
  "discount",
  "teacherName",
  "teacherExperience",
]);

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
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          group: { select: { id: true, name: true, slug: true } },
        },
      },
      user: { select: { id: true, name: true, centerName: true } },
      branches: { select: { region: true, district: true, address: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
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

  const existing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true, status: true, title: true, categoryId: true, category: { select: { name: true } } },
  });
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
  if (body.region !== undefined) data.region = body.region ? String(body.region).trim().slice(0, 100) || null : null;
  if (body.district !== undefined) data.district = body.district ? String(body.district).trim().slice(0, 100) || null : null;
  if (body.categoryId !== undefined) {
    const newCatId = Number(body.categoryId);
    if (newCatId) {
      const cat = await prisma.category.findUnique({ where: { id: newCatId }, select: { id: true, active: true } });
      if (!cat || !cat.active) return NextResponse.json({ error: "Yo'nalish topilmadi yoki faol emas" }, { status: 400 });
      data.categoryId = newCatId;
    }
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
  if (body.imageDarkness !== undefined) data.imageDarkness = Math.max(0, Math.min(50, Number(body.imageDarkness)));
  if (Array.isArray(body.lessons)) {
    data.lessons = body.lessons.map((x: unknown) => String(x).trim()).filter((s: string) => s.length > 0 && s.length <= 200).slice(0, 30);
  }

  // New detail fields (opt-in via undefined check)
  if (body.language !== undefined) {
    const v = typeof body.language === "string" && body.language.trim() ? body.language.trim() : "uz";
    data.language = v;
  }
  if (Array.isArray(body.languages)) {
    data.languages = body.languages.map((x: unknown) => String(x).trim()).filter((s: string) => s.length > 0 && s.length <= 10).slice(0, 6);
  }
  if (body.level !== undefined) {
    data.level = body.level ? String(body.level).trim().slice(0, 50) || null : null;
  }
  if (Array.isArray(body.levels)) {
    data.levels = body.levels.map((x: unknown) => String(x).trim()).filter((s: string) => s.length > 0 && s.length <= 50).slice(0, 6);
  }
  if (body.studentLimit !== undefined) {
    const n = Number(body.studentLimit);
    data.studentLimit = !Number.isFinite(n) || n <= 0 ? null : Math.min(10000, Math.floor(n));
  }
  if (body.paymentType !== undefined) {
    data.paymentType = body.paymentType ? String(body.paymentType).trim().slice(0, 50) || null : null;
  }
  if (body.schedule !== undefined) {
    data.schedule = body.schedule ? String(body.schedule).trim().slice(0, 200) || null : null;
  }
  if (body.teacherName !== undefined) {
    data.teacherName = body.teacherName ? String(body.teacherName).trim().slice(0, 100) || null : null;
  }
  if (body.teacherExperience !== undefined) {
    data.teacherExperience = body.teacherExperience ? String(body.teacherExperience).trim().slice(0, 1000) || null : null;
  }
  if (body.certificate !== undefined) {
    data.certificate = body.certificate === true || body.certificate === "true" || body.certificate === "ha";
  }
  if (body.demoLesson !== undefined) {
    data.demoLesson = body.demoLesson === true || body.demoLesson === "true" || body.demoLesson === "ha";
  }
  if (body.discount !== undefined) {
    data.discount = body.discount ? String(body.discount).trim().slice(0, 200) || null : null;
  }

  // Filiallar — agar yuborilsa, eskilarini almashtiramiz
  let branchesUpdate: { region: string | null; district: string | null; address: string | null; sortOrder: number }[] | null = null;
  if (Array.isArray(body.branches)) {
    branchesUpdate = (body.branches as unknown[])
      .filter((b): b is { region?: unknown; district?: unknown; address?: unknown } => typeof b === "object" && b !== null)
      .slice(0, 20)
      .map((b: { region?: unknown; district?: unknown; address?: unknown }, i: number) => ({
        region: b.region ? String(b.region).trim().slice(0, 100) || null : null,
        district: b.district ? String(b.district).trim().slice(0, 100) || null : null,
        address: b.address ? String(b.address).trim().slice(0, 200) || null : null,
        sortOrder: i,
      }))
      .filter((b) => b.region || b.district || b.address);
  }

  if (Object.keys(data).length === 0 && !branchesUpdate) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  if (branchesUpdate) {
    await prisma.listingLocation.deleteMany({ where: { listingId } });
    if (branchesUpdate.length > 0) {
      await prisma.listingLocation.createMany({
        data: branchesUpdate.map(b => ({ ...b, listingId })),
      });
    }
  }

  // If any content-critical field is changed on an active listing, send it back to moderation.
  const hasContentChange = Object.keys(data).some(k => REMODERATION_FIELDS.has(k));
  const shouldRemoderate = hasContentChange && existing.status === "active";
  if (shouldRemoderate) {
    data.status = "pending";
    data.rejectReason = null;
  }

  const listing = await prisma.listing.update({ where: { id: listingId }, data, select: { id: true, title: true, price: true, createdAt: true, status: true, color: true, icon: true, imageUrl: true, imagePosX: true, imagePosY: true, description: true } });

  if (shouldRemoderate) {
    const teacher = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, centerName: true } });
    notifyListingPending({
      title: listing.title,
      centerName: teacher?.centerName ?? teacher?.name ?? "—",
      category: existing.category?.name ?? "—",
      price: listing.price,
      listingId: listing.id,
      createdAt: new Date(),
    }).catch(e => console.error("[listing-edit-pending] telegram notify failed", e));
  }

  return NextResponse.json({ listing, remoderation: shouldRemoderate });
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
