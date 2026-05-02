import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAssistant } from "@/lib/assistants";
import { hasPermission, ALL_PERMISSIONS, type PermissionKey, type Permissions } from "@/lib/permissions";
import { normalizePhone } from "@/lib/telegram";

// Server-side helper — admin yoki kerakli ruxsatga ega assistant'ni talab qiladi.
// API route'lar uchun: agar 401/403 qaytsa, NextResponse qaytariladi; mos kelsa null.
//
// Misol:
//   const deny = await requirePermission("listing.create");
//   if (deny) return deny;
//   // ... endpoint logic ...
//
// Admin'lar har doim true qaytaradi (ALL_PERMISSIONS).
// Assistant'lar uchun ASSISTANTS dict'idan aniq ruxsat tekshiriladi.

export async function requirePermission(key: PermissionKey): Promise<NextResponse | null> {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; phone?: string } | undefined;
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role === "admin") return null; // admin har doim ruxsatli
  if (user.role !== "assistant") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let phone = user.phone?.trim() || null;
  if (!phone) {
    const row = await prisma.user.findUnique({
      where: { id: Number(user.id) },
      select: { phone: true },
    });
    phone = row?.phone ?? null;
  }
  if (!phone) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const assistant = getAssistant(normalizePhone(phone));
  if (!assistant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!hasPermission(assistant.permissions, key)) {
    return NextResponse.json({ error: "Bu amalga ruxsat yo'q" }, { status: 403 });
  }

  return null;
}

// Joriy foydalanuvchining permissions object'ini qaytaradi (admin → ALL, assistant → kodda).
// Sahifa server komponentlarida sidebar va UI gating uchun ishlatiladi.
export async function getCurrentUserPermissions(): Promise<{ role: string; permissions: Permissions } | null> {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; phone?: string } | undefined;
  if (!user || !user.id) return null;

  if (user.role === "admin") {
    return { role: "admin", permissions: ALL_PERMISSIONS };
  }
  if (user.role === "assistant") {
    let phone = user.phone?.trim();
    if (!phone) {
      const row = await prisma.user.findUnique({
        where: { id: Number(user.id) },
        select: { phone: true },
      });
      phone = row?.phone;
    }
    if (phone) {
      const assistant = getAssistant(normalizePhone(phone));
      if (assistant) return { role: "assistant", permissions: assistant.permissions };
    }
  }
  return null;
}

// Faqat admin tekshiruvi (eski requireAdmin'ga muqobil)
export async function requireAdminOnly(): Promise<NextResponse | null> {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Faqat admin uchun" }, { status: 403 });
  }
  return null;
}

// Backwards-compat: existing `requireAdmin` ham ishlasin (admin OR assistant)
// — agar oldingi kod requireAdmin'ni ishlatsa va assistant ham kerakli ruxsatga ega bo'lsa.
// Yangi kod uchun requirePermission ishlatish tavsiya etiladi.
export { requirePermission as requireAuthOrPermission };
