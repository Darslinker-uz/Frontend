import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/dashboard/managers/:id — update an owned manager
export async function PATCH(request: Request, { params }: Ctx) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const mgrId = Number(id);
  if (!mgrId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const existing = await prisma.manager.findUnique({ where: { id: mgrId }, select: { ownerId: true } });
  if (!existing || existing.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (typeof body?.name === "string") data.name = body.name.trim();
  if (typeof body?.phone === "string") data.phone = body.phone.trim();
  if (body?.telegramChatId !== undefined) data.telegramChatId = body.telegramChatId ? String(body.telegramChatId) : null;
  if (body?.canReply !== undefined) data.canReply = Boolean(body.canReply);
  if (body?.canManage !== undefined) data.canManage = Boolean(body.canManage);
  if (body?.active !== undefined) data.active = Boolean(body.active);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const manager = await prisma.manager.update({ where: { id: mgrId }, data });
  return NextResponse.json({ manager });
}

// DELETE /api/dashboard/managers/:id
export async function DELETE(_request: Request, { params }: Ctx) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const mgrId = Number(id);
  if (!mgrId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const existing = await prisma.manager.findUnique({ where: { id: mgrId }, select: { ownerId: true } });
  if (!existing || existing.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.manager.delete({ where: { id: mgrId } });
  return NextResponse.json({ ok: true });
}
