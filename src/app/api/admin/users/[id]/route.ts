import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/users/:id — { banned?: boolean, telegramChatId?: string | null,
//   phone?: string, phonePublic?: boolean }
// telegramChatId: null yoki "" — CRM bot chat id ni tozalash (noto'g'ri @username va hokazo).
// Raqamli qator (masalan -1001234567890 yoki 123456) — faqat ishonchli id bo'lsa qo'ying.
// phone — haqiqiy raqam bilan almashtirish (masalan admin tez qo'shgan "pending-..." o'rniga).
// phonePublic — shu raqam repetitor/markaz profil sahifasida (getTutorBySlug/getCenterBySlug)
//   ko'rinsinmi — barcha aktiv/churned listing'larining phoneShown flagini sinxronlaydi.
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const userId = Number(id);
  if (!userId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: { banned?: boolean; telegramChatId?: string | null; phone?: string } = {};
  if (typeof body.banned === "boolean") data.banned = body.banned;

  if ("telegramChatId" in body) {
    const v = body.telegramChatId;
    if (v === null || v === "") {
      data.telegramChatId = null;
    } else if (typeof v === "string") {
      const t = v.trim();
      if (/^-?\d+$/.test(t)) data.telegramChatId = t;
      else {
        return NextResponse.json(
          { error: "telegramChatId null (tozalash) yoki raqamli Telegram chat id bo'lishi kerak (@username emas)" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ error: "telegramChatId noto'g'ri tur" }, { status: 400 });
    }
  }

  if ("phone" in body) {
    const t = typeof body.phone === "string" ? body.phone.trim() : "";
    if (t.length < 7 || t.startsWith("pending-")) {
      return NextResponse.json({ error: "Telefon raqam noto'g'ri" }, { status: 400 });
    }
    data.phone = t;
  }

  const phonePublic = typeof body.phonePublic === "boolean" ? body.phonePublic : undefined;

  if (Object.keys(data).length === 0 && phonePublic === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const user = Object.keys(data).length > 0
    ? await prisma.user.update({ where: { id: userId }, data })
    : await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User topilmadi" }, { status: 404 });

  if (phonePublic !== undefined) {
    await prisma.listing.updateMany({
      where: { userId, status: { in: ["active", "churned"] } },
      data: { phoneShown: phonePublic },
    });
  }

  return NextResponse.json({ user });
}

// DELETE /api/admin/users/:id
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const userId = Number(id);
  if (!userId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
