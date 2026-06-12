import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateUniqueUserSlug } from "@/lib/slug";

export async function POST(request: Request) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { name?: unknown; centerName?: unknown; profileType?: unknown; bio?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const centerName = String(body.centerName ?? "").trim();
  const profileTypeRaw = String(body.profileType ?? "").trim().toUpperCase();
  const bio = body.bio ? String(body.bio).trim() : null;

  if (name.length < 2) {
    return NextResponse.json({ error: "Ism kamida 2 belgi bo'lishi kerak" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Ism juda uzun (maksimum 100 belgi)" }, { status: 400 });
  }
  if (profileTypeRaw !== "CENTER" && profileTypeRaw !== "TUTOR") {
    return NextResponse.json({ error: "Profil turini tanlang (markaz yoki repetitor)" }, { status: 400 });
  }
  // CENTER uchun centerName majburiy, TUTOR uchun ixtiyoriy (default name ishlatiladi)
  if (profileTypeRaw === "CENTER" && centerName.length < 2) {
    return NextResponse.json({ error: "Markaz nomi kamida 2 belgi bo'lishi kerak" }, { status: 400 });
  }
  if (centerName.length > 100) {
    return NextResponse.json({ error: "Markaz nomi juda uzun (maksimum 100 belgi)" }, { status: 400 });
  }
  if (bio && bio.length > 2000) {
    return NextResponse.json({ error: "Tavsif juda uzun (maksimum 2000 belgi)" }, { status: 400 });
  }

  // Slug uchun base: CENTER → centerName, TUTOR → name
  const slugBase = profileTypeRaw === "CENTER" ? centerName : name;
  const slug = await generateUniqueUserSlug(slugBase, userId);

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      // CENTER uchun centerName saqlanadi, TUTOR uchun null (shaxs ismi name'da)
      centerName: profileTypeRaw === "CENTER" ? centerName : null,
      profileType: profileTypeRaw,
      slug,
      bio,
      onboardingCompleted: true,
    },
  });

  return NextResponse.json({ ok: true, slug, profileType: profileTypeRaw });
}
