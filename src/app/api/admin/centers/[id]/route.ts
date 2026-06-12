import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { generateUniqueUserSlug } from "@/lib/slug";

interface Context {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/centers/[id] — markaz ma'lumotlarini yangilash
// Body: { banned?, profileType?, slug?, bio?, centerName?, name? }
export async function PATCH(request: Request, { params }: Context) {
  const deny = await requirePermission("user.view");
  if (deny) return deny;

  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  let body: {
    banned?: unknown;
    profileType?: unknown;
    slug?: unknown;
    bio?: unknown;
    centerName?: unknown;
    name?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const current = await prisma.user.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (current.role !== "provider") {
    return NextResponse.json({ error: "Faqat provider'larni o'zgartirish mumkin" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  if (typeof body.banned === "boolean") {
    data.banned = body.banned;
  }
  if (body.profileType === "CENTER" || body.profileType === "TUTOR") {
    data.profileType = body.profileType;
  }
  if (typeof body.name === "string" && body.name.trim().length >= 2) {
    data.name = body.name.trim();
  }
  if (typeof body.centerName === "string") {
    const cn = body.centerName.trim();
    data.centerName = cn.length > 0 ? cn : null;
  }
  if (typeof body.bio === "string") {
    const b = body.bio.trim();
    data.bio = b.length > 0 ? b : null;
  }

  // Slug yangilash — unikallik tekshiruvi bilan
  if (typeof body.slug === "string") {
    const newSlug = body.slug.trim().toLowerCase();
    if (newSlug.length === 0) {
      // Slug bo'shatish — yangidan generatsiya qilamiz
      const base = data.centerName ?? current.centerName ?? data.name ?? current.name;
      data.slug = await generateUniqueUserSlug(base, id);
    } else if (newSlug !== current.slug) {
      const conflict = await prisma.user.findFirst({
        where: { slug: newSlug, id: { not: id } },
        select: { id: true },
      });
      if (conflict) {
        return NextResponse.json({ error: "Bu slug allaqachon band" }, { status: 409 });
      }
      data.slug = newSlug;
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      centerName: updated.centerName,
      profileType: updated.profileType,
      slug: updated.slug,
      bio: updated.bio,
      banned: updated.banned,
    },
  });
}
