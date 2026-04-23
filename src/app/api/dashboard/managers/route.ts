import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/dashboard/managers — list the current user's managers
export async function GET() {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const managers = await prisma.manager.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ managers });
}

// POST /api/dashboard/managers — create a manager under the current user
export async function POST(request: Request) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  if (!name || name.length < 2) return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "Telefon kerak" }, { status: 400 });

  const telegramChatId = body?.telegramChatId ? String(body.telegramChatId) : null;
  const canReply = body?.canReply !== undefined ? Boolean(body.canReply) : true;
  const canManage = body?.canManage !== undefined ? Boolean(body.canManage) : false;

  const manager = await prisma.manager.create({
    data: {
      ownerId: userId,
      name,
      phone,
      telegramChatId,
      canReply,
      canManage,
      active: true,
    },
  });

  return NextResponse.json({ manager }, { status: 201 });
}
