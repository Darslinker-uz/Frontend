import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/faq/:id
// body: { question?, answer?, page?, active? }
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const fid = Number(id);
  if (!fid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.question !== undefined) {
    const q = String(body.question).trim();
    if (q.length < 5) return NextResponse.json({ error: "Savol qisqa" }, { status: 400 });
    data.question = q;
  }
  if (body.answer !== undefined) {
    const a = String(body.answer).trim();
    if (a.length < 10) return NextResponse.json({ error: "Javob qisqa" }, { status: 400 });
    data.answer = a;
  }
  if (body.page !== undefined) data.page = String(body.page);
  if (body.active !== undefined) data.active = Boolean(body.active);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Hech nima yangilanmadi" }, { status: 400 });
  }

  const faq = await prisma.faq.update({ where: { id: fid }, data });
  return NextResponse.json({ faq });
}

// DELETE /api/admin/faq/:id
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const fid = Number(id);
  if (!fid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.faq.delete({ where: { id: fid } });
  return NextResponse.json({ ok: true });
}
