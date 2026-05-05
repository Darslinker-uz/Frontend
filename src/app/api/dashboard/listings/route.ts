import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyListingPending } from "@/lib/bot-handler";

/** Sessiya + DB: faqat kurs egasi (provider) yoki admin e'lon yaratishi / dashboard API. */
async function requireListingAuthor() {
  const session = await auth();
  const rawId = (session?.user as { id?: string })?.id;
  const userId = Number(rawId);
  if (!session?.user || !rawId || Number.isNaN(userId) || userId <= 0) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, phone: true, banned: true },
  });
  if (!dbUser || dbUser.banned || (dbUser.role !== "provider" && dbUser.role !== "admin")) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, userId, phone: dbUser.phone };
}

// Maps from UI-friendly format labels to DB enum
const FORMAT_MAP: Record<string, "offline" | "online" | "video" | "hybrid"> = {
  "Onlayn": "online",
  "Oflayn": "offline",
  "Gibrid": "hybrid",
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
      category: { select: { id: true, name: true, slug: true, color: true, pendingApproval: true, group: { select: { id: true, name: true, slug: true } } } },
      user: { select: { id: true, name: true, centerName: true } },
      _count: { select: { leads: true, boosts: true } },
    },
  });
  return NextResponse.json({ listings });
}

// POST /api/dashboard/listings — create new listing (goes to pending moderation)
export async function POST(request: Request) {
  const authz = await requireListingAuthor();
  if (!authz.ok) return authz.res;
  const { userId, phone: authorPhone } = authz;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const categoryId = body.categoryId !== undefined ? Number(body.categoryId) : null;
  // Yangi yo'nalish so'rovi: foydalanuvchi guruhni tanlaydi va yo'nalish nomini qo'lda yozadi.
  const proposedCategoryName = body.proposedCategoryName ? String(body.proposedCategoryName).trim().slice(0, 60) : "";
  const proposedGroupId = body.proposedGroupId !== undefined ? Number(body.proposedGroupId) : null;
  const formatLabel = String(body.format ?? "").trim();
  const price = body.priceFree ? 0 : Number(body.price) || 0;
  const duration = body.duration ? String(body.duration).trim() : null;
  const description = body.description ? String(body.description).trim() : null;
  const location = body.location ? String(body.location).trim() : null;
  const region = body.region ? String(body.region).trim().slice(0, 100) || null : null;
  const district = body.district ? String(body.district).trim().slice(0, 100) || null : null;
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
  const imageDarkness = body.imageDarkness !== undefined ? Math.max(0, Math.min(50, Number(body.imageDarkness))) : 15;
  const lessons = Array.isArray(body.lessons)
    ? body.lessons.map(x => String(x).trim()).filter(s => s.length > 0 && s.length <= 200).slice(0, 30)
    : [];

  // New fields (10 course detail fields)
  const language = typeof body.language === "string" && body.language.trim() ? body.language.trim() : "uz";
  const languages: string[] = Array.isArray(body.languages)
    ? body.languages.map(x => String(x).trim()).filter(s => s.length > 0 && s.length <= 10).slice(0, 6)
    : [];
  const level = body.level ? String(body.level).trim().slice(0, 50) || null : null;
  const levels: string[] = Array.isArray(body.levels)
    ? body.levels.map(x => String(x).trim()).filter(s => s.length > 0 && s.length <= 50).slice(0, 6)
    : [];

  // Filiallar — alohida jadval
  type BranchInput = { region?: unknown; district?: unknown; address?: unknown; price?: unknown };
  const parseBranchPrice = (v: unknown): number | null => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.min(100_000_000, Math.floor(n)) : null;
  };
  const branchesData = (Array.isArray(body.branches)
    ? (body.branches as unknown[])
        .filter((b): b is BranchInput => typeof b === "object" && b !== null)
        .slice(0, 20)
    : []
  )
    .map((b: BranchInput, i: number) => ({
      region: b.region ? String(b.region).trim().slice(0, 100) || null : null,
      district: b.district ? String(b.district).trim().slice(0, 100) || null : null,
      address: b.address ? String(b.address).trim().slice(0, 200) || null : null,
      price: parseBranchPrice(b.price),
      sortOrder: i,
    }))
    .filter(b => b.region || b.district || b.address);
  const studentLimitRaw = Number(body.studentLimit);
  const studentLimit = !Number.isFinite(studentLimitRaw) || studentLimitRaw <= 0 ? null : Math.min(10000, Math.floor(studentLimitRaw));
  const paymentType = body.paymentType ? String(body.paymentType).trim().slice(0, 50) || null : null;
  const schedule = body.schedule ? String(body.schedule).trim().slice(0, 200) || null : null;
  const teacherName = body.teacherName ? String(body.teacherName).trim().slice(0, 100) || null : null;
  const teacherExperience = body.teacherExperience ? String(body.teacherExperience).trim().slice(0, 1000) || null : null;
  const certificate = body.certificate === true || body.certificate === "true" || body.certificate === "ha";
  const demoLesson = body.demoLesson === true || body.demoLesson === "true" || body.demoLesson === "ha";
  const discount = body.discount ? String(body.discount).trim().slice(0, 200) || null : null;
  const website = body.website ? String(body.website).trim().slice(0, 300) || null : null;
  const instagram = body.instagram ? String(body.instagram).trim().slice(0, 200) || null : null;
  const telegram = body.telegram ? String(body.telegram).trim().slice(0, 200) || null : null;

  if (!title || title.length < 3) return NextResponse.json({ error: "Kurs nomi kamida 3 belgi" }, { status: 400 });
  if (!formatLabel) return NextResponse.json({ error: "Format majburiy" }, { status: 400 });
  if (!categoryId && !proposedCategoryName) {
    return NextResponse.json({ error: "Yo'nalish tanlash yoki yangisini so'rash majburiy" }, { status: 400 });
  }
  if (!categoryId && proposedCategoryName && !proposedGroupId) {
    return NextResponse.json({ error: "Yangi yo'nalish uchun guruhni tanlang" }, { status: 400 });
  }

  const format = FORMAT_MAP[formatLabel];
  if (!format) return NextResponse.json({ error: "Format noto'g'ri" }, { status: 400 });

  // Mavjud yo'nalish yoki yangisini yaratish
  let category: { id: number; name: string; active: boolean } | null = null;
  if (categoryId) {
    category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, name: true, active: true } });
    if (!category || !category.active) {
      return NextResponse.json({ error: "Yo'nalish topilmadi yoki faol emas" }, { status: 400 });
    }
  } else {
    // Yangi yo'nalish so'rovi — pendingApproval=true bilan yaratamiz
    const group = await prisma.categoryGroup.findUnique({ where: { id: proposedGroupId! }, select: { id: true, active: true } });
    if (!group || !group.active) return NextResponse.json({ error: "Guruh topilmadi" }, { status: 400 });

    if (proposedCategoryName.length < 2) {
      return NextResponse.json({ error: "Yo'nalish nomi kamida 2 belgi" }, { status: 400 });
    }
    // Slug generatsiya — agar to'qnashsa, suffix qo'shamiz
    const baseSlug = proposedCategoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);
    const slugCandidate = baseSlug || `pending-${Date.now()}`;
    const exists = await prisma.category.findFirst({ where: { slug: slugCandidate } });
    const finalSlug = exists ? `${slugCandidate}-${Math.random().toString(36).slice(2, 6)}` : slugCandidate;

    const newCat = await prisma.category.create({
      data: {
        groupId: group.id,
        name: proposedCategoryName,
        slug: finalSlug,
        pendingApproval: true,
        active: false, // tasdiqlangungacha yashirin
        proposedById: userId,
      },
      select: { id: true, name: true, active: true },
    });
    category = newCat;
  }

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
      region,
      district,
      duration,
      phone: body.phone ? String(body.phone).trim().slice(0, 50) || authorPhone : authorPhone,
      website,
      instagram,
      telegram,
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
      imageDarkness,
      lessons,
      language,
      languages,
      level,
      levels,
      studentLimit,
      paymentType,
      schedule,
      teacherName,
      teacherExperience,
      certificate,
      demoLesson,
      discount,
      status: "pending", // requires admin approval
      statusChangedAt: new Date(),
      ...(branchesData.length > 0 ? { branches: { create: branchesData } } : {}),
    },
  });

  const teacher = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, centerName: true } });
  notifyListingPending({
    title,
    centerName: teacher?.centerName ?? teacher?.name ?? "—",
    category: category.name,
    price,
    listingId: listing.id,
    createdAt: listing.createdAt,
  }).catch(e => console.error("[listing-pending] telegram notify failed", e));

  return NextResponse.json({ listing }, { status: 201 });
}
