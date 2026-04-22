import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/users/:id — { banned?: boolean }
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const userId = Number(id);
  if (!userId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: { banned?: boolean } = {};
  if (typeof body.banned === "boolean") data.banned = body.banned;

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
