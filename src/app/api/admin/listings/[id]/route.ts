import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyListingApproved, notifyListingRejected, notifyListingPending } from "@/lib/bot-handler";
import { auth } from "@/lib/auth";
import type { ListingStatus } from "@/generated/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { requirePermission } from "@/lib/require-permission";

interface Ctx { params: Promise<{ id: string }> }

const ALLOWED_STATUS: ListingStatus[] = ["pending", "active", "paused", "rejected"];

// Assistant tahrirlaganda re-moderation triggerlovchi maydonlar
// (vizual sozlamalar — pos/zoom/darkness — re-moderation triggerlamasin)
const REMODERATION_FIELDS = new Set([
  "title",
  "description",
  "price",
  "duration",
  "location",
  "region",
  "district",
  "imageUrl",
  "lessons",
  "schedule",
  "discount",
  "teacherName",
  "teacherExperience",
  "categoryId",
  "format",
  "level",
  "levels",
  "language",
  "languages",
  "branches",
]);

// GET /api/admin/listings/:id — bitta e'lon batafsil
export async function GET(_request: Request, { params }: Ctx) {
  const deny = await requirePermission("listing.view");
  if (deny) return deny;
  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      user: { select: { id: true, name: true, centerName: true, phone: true, telegramChatId: true } },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          pendingApproval: true,
          proposedById: true,
          group: { select: { id: true, name: true, slug: true } },
        },
      },
      branches: { select: { region: true, district: true, address: true, price: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
      _count: { select: { leads: true, boosts: true, reviews: true } },
    },
  });

  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ listing });
}

// PATCH /api/admin/listings/:id — approve / reject / pause / edit
// Status o'zgartirish (approve/reject) → listing.approve kerak
// Boshqa maydonlarni tahrirlash → listing.edit kerak
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  // Avval mavjud status'ni o'qiymiz — body.status faqat HAQIQATAN
  // o'zgargan bo'lsagina "status change" deb sanaymiz.
  const existingForCheck = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { status: true },
  });
  if (!existingForCheck) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const isStatusChange = body.status
    && ALLOWED_STATUS.includes(body.status)
    && body.status !== existingForCheck.status;
  if (isStatusChange) {
    const deny = await requirePermission("listing.approve");
    if (deny) return deny;
  } else {
    const deny = await requirePermission("listing.edit");
    if (deny) return deny;
  }

  if (isStatusChange) data.status = body.status;
  if (body.rejectReason !== undefined) data.rejectReason = body.rejectReason;
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.format !== undefined) data.format = body.format;
  if (body.location !== undefined) data.location = body.location;
  if (body.region !== undefined) data.region = body.region ? String(body.region).trim().slice(0, 100) || null : null;
  if (body.district !== undefined) data.district = body.district ? String(body.district).trim().slice(0, 100) || null : null;
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

  // Filiallar — agar yuborilsa, eskilarini tozalab yangilarini yozamiz
  let branchesUpdate: { region: string | null; district: string | null; address: string | null; price: number | null; sortOrder: number }[] | null = null;
  const parseBranchPrice = (v: unknown): number | null => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.min(100_000_000, Math.floor(n)) : null;
  };
  if (Array.isArray(body.branches)) {
    branchesUpdate = (body.branches as unknown[])
      .filter((b): b is { region?: unknown; district?: unknown; address?: unknown; price?: unknown } => typeof b === "object" && b !== null)
      .slice(0, 20)
      .map((b: { region?: unknown; district?: unknown; address?: unknown; price?: unknown }, i: number) => ({
        region: b.region ? String(b.region).trim().slice(0, 100) || null : null,
        district: b.district ? String(b.district).trim().slice(0, 100) || null : null,
        address: b.address ? String(b.address).trim().slice(0, 200) || null : null,
        price: parseBranchPrice(b.price),
        sortOrder: i,
      }))
      .filter((b: { region: string | null; district: string | null; address: string | null }) => b.region || b.district || b.address);
  }

  if (Object.keys(data).length === 0 && !branchesUpdate) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // Joriy foydalanuvchi roli — assistant aktiv e'lonni tahrirlasa, status pending'ga qaytarish
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isAssistant = userRole === "assistant";

  // Previous status (notification + re-moderation logic uchun) — existingForCheck'dan ham ushlaydi
  const prev = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { status: true },
  });

  // Assistant aktiv e'londa content tahrir qilsa → pending'ga qaytaramiz
  const hasContentChange = Object.keys(data).some(k => REMODERATION_FIELDS.has(k)) || branchesUpdate !== null;
  const assistantRemoderate = isAssistant && hasContentChange && prev?.status === "active" && !isStatusChange;
  if (assistantRemoderate) {
    data.status = "pending";
    data.rejectReason = null;
  }

  // Status haqiqatan o'zgardimi — statusChangedAt ni yangilaymiz
  if (data.status && data.status !== prev?.status) {
    data.statusChangedAt = new Date();
  }

  if (branchesUpdate) {
    await prisma.listingLocation.deleteMany({ where: { listingId } });
    if (branchesUpdate.length > 0) {
      await prisma.listingLocation.createMany({
        data: branchesUpdate.map(b => ({ ...b, listingId })),
      });
    }
  }

  const listing = await prisma.listing.update({
    where: { id: listingId },
    data,
    include: {
      user: { select: { id: true, name: true, centerName: true, phone: true, telegramChatId: true } },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          pendingApproval: true,
          proposedById: true,
          group: { select: { id: true, name: true, slug: true } },
        },
      },
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

  // Assistant tahriri tufayli pending'ga qaytdi → super admin'ga xabar
  if (assistantRemoderate) {
    notifyListingPending({
      title: listing.title,
      centerName: listing.user.centerName ?? listing.user.name ?? "—",
      category: listing.category.name,
      price: listing.price,
      listingId: listing.id,
      createdAt: new Date(),
    }).catch(e => console.error("[admin-listings] notify pending (assistant edit) failed", e));
  }

  return NextResponse.json({ listing, remoderation: assistantRemoderate });
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
