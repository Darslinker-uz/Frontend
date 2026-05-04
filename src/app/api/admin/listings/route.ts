import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/require-permission";

// GET /api/admin/listings?status=pending|active|paused|rejected
export async function GET(request: Request) {
  const deny = await requirePermission("listing.view");
  if (deny) return deny;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as "pending" | "active" | "paused" | "rejected" | null;

  const listings = await prisma.listing.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, centerName: true, phone: true, telegramChatId: true } },
      category: { select: { id: true, name: true, slug: true, color: true, pendingApproval: true, group: { select: { id: true, name: true, slug: true } } } },
      _count: { select: { leads: true, boosts: true } },
    },
  });

  return NextResponse.json({ listings });
}

// POST /api/admin/listings — admin yoki ruxsatli assistant yangi e'lon qo'shadi
// Admin → darhol active. Assistant → status=pending (super admin tasdiqlaydi)
export async function POST(request: Request) {
  const deny = await requirePermission("listing.create");
  if (deny) return deny;

  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAssistant = role === "assistant";

  const body = await request.json();

  // Validatsiya: categoryId YOKI proposedCategoryName + proposedGroupId
  const hasProposedCategory = Boolean(body.proposedCategoryName && body.proposedGroupId);
  // Yangi markaz ham bo'lishi mumkin: userId YOKI proposedCenterName
  const hasProposedCenter = Boolean(body.proposedCenterName);

  const requiredBase: string[] = ["title", "price", "format"];
  if (!hasProposedCenter) requiredBase.unshift("userId");
  if (!hasProposedCategory) requiredBase.push("categoryId");
  for (const k of requiredBase) {
    if (body[k] === undefined || body[k] === null || body[k] === "") {
      return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }
  }

  // Yangi markaz qo'shish: placeholder User yaratamiz
  let userId = body.userId ? Number(body.userId) : 0;
  if (hasProposedCenter) {
    const centerName = String(body.proposedCenterName).trim().slice(0, 120);
    if (centerName.length < 2) {
      return NextResponse.json({ error: "Markaz nomi qisqa" }, { status: 400 });
    }
    // Placeholder phone — keyinchalik admin haqiqiy raqam bilan almashtiradi
    const placeholderPhone = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newUser = await prisma.user.create({
      data: {
        name: centerName,
        centerName,
        phone: placeholderPhone,
        passwordHash: "",
        role: "provider",
        onboardingCompleted: false,
      },
    });
    userId = newUser.id;
  }

  // Yangi yo'nalish so'rash holati: avval pending Category yaratamiz
  let categoryId = body.categoryId ? Number(body.categoryId) : 0;
  if (hasProposedCategory) {
    const proposedName = String(body.proposedCategoryName).trim().slice(0, 80);
    const proposedGroupId = Number(body.proposedGroupId);
    if (proposedName.length < 2) {
      return NextResponse.json({ error: "Yo'nalish nomi qisqa" }, { status: 400 });
    }
    // Slug avtomatik
    let proposedSlug = proposedName
      .toLowerCase()
      .replace(/[''ʻ`]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
    if (!proposedSlug) proposedSlug = `category-${Date.now()}`;
    // To'qnashuv tekshiruvi
    const existsSlug = await prisma.category.findUnique({ where: { slug: proposedSlug } });
    if (existsSlug) proposedSlug = `${proposedSlug}-${Math.random().toString(36).slice(2, 5)}`;

    // Admin yaratganda — darhol tasdiqlangan; assistant uchun — pending
    const newCategory = await prisma.category.create({
      data: {
        groupId: proposedGroupId,
        name: proposedName,
        slug: proposedSlug,
        active: true,
        pendingApproval: isAssistant,
        proposedById: session?.user ? Number((session.user as { id?: string }).id) : null,
      },
    });
    categoryId = newCategory.id;
  }

  const slug = (body.slug ?? body.title)
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 7);

  const clampPos = (v: unknown, def = 50) =>
    v !== undefined && v !== null ? Math.max(0, Math.min(100, Number(v))) : def;
  const clampZoom = (v: unknown, def = 100) =>
    v !== undefined && v !== null ? Math.max(100, Math.min(300, Number(v))) : def;
  const clampDarkness = (v: unknown, def = 15) =>
    v !== undefined && v !== null ? Math.max(0, Math.min(50, Number(v))) : def;

  // New detail fields (10)
  const language = typeof body.language === "string" && body.language.trim() ? body.language.trim() : "uz";
  const languages: string[] = Array.isArray(body.languages)
    ? body.languages.map((x: unknown) => String(x).trim()).filter((s: string) => s.length > 0 && s.length <= 10).slice(0, 6)
    : [];
  const level = body.level ? String(body.level).trim().slice(0, 50) || null : null;
  const levels: string[] = Array.isArray(body.levels)
    ? body.levels.map((x: unknown) => String(x).trim()).filter((s: string) => s.length > 0 && s.length <= 50).slice(0, 6)
    : [];

  // Filiallar — agar "branches" massivi yuborilsa, alohida jadvalga yoziladi
  type BranchInput = { region?: unknown; district?: unknown; address?: unknown };
  const branchesInput: BranchInput[] = Array.isArray(body.branches)
    ? body.branches.filter((b: unknown): b is BranchInput => typeof b === "object" && b !== null).slice(0, 20)
    : [];
  const branchesData = branchesInput
    .map((b, i) => ({
      region: b.region ? String(b.region).trim().slice(0, 100) || null : null,
      district: b.district ? String(b.district).trim().slice(0, 100) || null : null,
      address: b.address ? String(b.address).trim().slice(0, 200) || null : null,
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

  const listing = await prisma.listing.create({
    data: {
      userId,
      categoryId,
      title: body.title,
      slug,
      description: body.description ?? null,
      price: Number(body.price),
      format: body.format,
      location: body.location ?? null,
      duration: body.duration ?? null,
      region: body.region ? String(body.region).trim().slice(0, 100) || null : null,
      district: body.district ? String(body.district).trim().slice(0, 100) || null : null,
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
      phone: body.phone ?? "",
      imageUrl: body.imageUrl ?? null,
      imagePosX: clampPos(body.imagePosX),
      imagePosY: clampPos(body.imagePosY),
      imageAPosX: clampPos(body.imageAPosX),
      imageAPosY: clampPos(body.imageAPosY),
      imageAMPosX: clampPos(body.imageAMPosX),
      imageAMPosY: clampPos(body.imageAMPosY),
      imageCPosX: clampPos(body.imageCPosX),
      imageCPosY: clampPos(body.imageCPosY),
      imageCMPosX: clampPos(body.imageCMPosX),
      imageCMPosY: clampPos(body.imageCMPosY),
      imageZoom: clampZoom(body.imageZoom),
      imageAZoom: clampZoom(body.imageAZoom),
      imageAMZoom: clampZoom(body.imageAMZoom),
      imageCZoom: clampZoom(body.imageCZoom),
      imageCMZoom: clampZoom(body.imageCMZoom),
      imageDarkness: clampDarkness(body.imageDarkness),
      color: body.color ?? null,
      icon: body.icon ?? null,
      lessons: Array.isArray(body.lessons)
        ? body.lessons.map((x: unknown) => String(x).trim()).filter((s: string) => s.length > 0 && s.length <= 200).slice(0, 30)
        : [],
      // Admin: body.status yoki "active" (default).
      // Assistant: doim "pending" — super admin tasdiqlaydi (override mumkin emas)
      status: isAssistant ? "pending" : (body.status ?? "active"),
      ...(branchesData.length > 0 ? { branches: { create: branchesData } } : {}),
    },
    include: {
      user: { select: { id: true, name: true, centerName: true, phone: true } },
      category: { select: { id: true, name: true, slug: true, color: true, pendingApproval: true, group: { select: { id: true, name: true, slug: true } } } },
    },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
