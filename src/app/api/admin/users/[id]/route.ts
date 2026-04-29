import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/users/:id — { banned?: boolean, telegramChatId?: string | null }
// telegramChatId: null yoki "" — CRM bot chat id ni tozalash (noto'g'ri @username va hokazo).
// Raqamli qator (masalan -1001234567890 yoki 123456) — faqat ishonchli id bo'lsa qo'ying.
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const userId = Number(id);
  if (!userId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: { banned?: boolean; telegramChatId?: string | null } = {};
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

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
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
