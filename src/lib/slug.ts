// Slug generatsiyasi — URL-friendly identifierlar uchun
// Foydalanish: signup, listing yaratish, har qanday yangi public entity

import { prisma } from "@/lib/prisma";

/**
 * Matn'dan slug yaratish. Lowercase, dashe almashtirish, special chars'ni
 * tozalash. Apostrofni butunlay olib tashlash (Najot Ta'lim → najot-talim).
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/'/g, "")              // apostrof olib tashlanadi
    .replace(/[^a-z0-9]+/g, "-")    // qolgan non-alphanumeric → dash
    .replace(/^-+|-+$/g, "")        // boshlanish/oxiridagi dashlarni olib tashlash
    .slice(0, 120);                  // max uzunlik (User.slug VARCHAR(120))
}

/**
 * User uchun unikal slug yaratish. Mavjud bo'lsa -2, -3, ... qo'shadi.
 * Tekshirish DB orqali — boshqa userlar bilan to'qnashmaslik kafolatlanadi.
 *
 * @param baseInput — slug uchun manba (centerName yoki name)
 * @param excludeUserId — joriy user'ni tekshirishdan istisno qilish (update vaqtida)
 */
export async function generateUniqueUserSlug(
  baseInput: string,
  excludeUserId?: number,
): Promise<string> {
  const base = slugify(baseInput);
  if (!base) {
    // Bo'sh input — fallback "user" + random
    return `user-${Math.random().toString(36).slice(2, 8)}`;
  }

  // Avval base'ni o'zini sinab ko'ramiz
  const existing = await prisma.user.findFirst({
    where: {
      slug: base,
      ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
    },
    select: { id: true },
  });
  if (!existing) return base;

  // Konflikt bor — -2, -3, ... bilan urinib ko'ramiz
  // Max 99 — yetarli (real holatda 2-3'dan ortib ketmaydi)
  for (let i = 2; i <= 99; i++) {
    const candidate = `${base}-${i}`;
    const conflict = await prisma.user.findFirst({
      where: {
        slug: candidate,
        ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      },
      select: { id: true },
    });
    if (!conflict) return candidate;
  }

  // Juda kam holat — fallback random suffix bilan
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}
