import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await request.json();
  if (!Array.isArray(body.orderedIds)) {
    return NextResponse.json({ error: "orderedIds array required" }, { status: 400 });
  }
  await prisma.$transaction(
    body.orderedIds.map((id: number, i: number) =>
      prisma.category.update({ where: { id }, data: { order: i + 1 } }),
    ),
  );
  return NextResponse.json({ ok: true });
}
