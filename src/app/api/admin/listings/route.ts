import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
export async function POST(request: Request) {
  const deny = await requirePermission("listing.create");
  if (deny) return deny;
  const body = await request.json();

  const required = ["userId", "categoryId", "title", "price", "format", "phone"] as const;
  for (const k of required) {
    if (body[k] === undefined || body[k] === null || body[k] === "") {
      return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }
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

  // New detail fields (10)
  const language = typeof body.language === "string" && body.language.trim() ? body.language.trim() : "uz";
  const level = body.level ? String(body.level).trim().slice(0, 50) || null : null;
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
      userId: Number(body.userId),
      categoryId: Number(body.categoryId),
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
      level,
      studentLimit,
      paymentType,
      schedule,
      teacherName,
      teacherExperience,
      certificate,
      demoLesson,
      discount,
      phone: body.phone,
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
      color: body.color ?? null,
      icon: body.icon ?? null,
      lessons: Array.isArray(body.lessons)
        ? body.lessons.map((x: unknown) => String(x).trim()).filter((s: string) => s.length > 0 && s.length <= 200).slice(0, 30)
        : [],
      status: body.status ?? "active", // admin qo'shganda darhol aktiv
    },
    include: {
      user: { select: { id: true, name: true, centerName: true, phone: true } },
      category: { select: { id: true, name: true, slug: true, color: true, pendingApproval: true, group: { select: { id: true, name: true, slug: true } } } },
    },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
