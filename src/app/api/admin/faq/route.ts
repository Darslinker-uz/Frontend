import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

// GET /api/admin/faq — barcha FAQ'lar (aktiv + qoralama)
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const faqs = await prisma.faq.findMany({
    orderBy: [{ page: "asc" }, { order: "asc" }, { id: "asc" }],
  });
  return NextResponse.json({ faqs });
}

// POST /api/admin/faq — yangi FAQ
// body: { question, answer, page?, active? }
export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body: { question?: string; answer?: string; page?: string; active?: boolean };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const question = String(body.question ?? "").trim();
  const answer = String(body.answer ?? "").trim();
  if (question.length < 5) return NextResponse.json({ error: "Savol kamida 5 belgi" }, { status: 400 });
  if (answer.length < 10) return NextResponse.json({ error: "Javob kamida 10 belgi" }, { status: 400 });

  const page = body.page && typeof body.page === "string" ? body.page : "home";

  // Order — eng oxirga qo'shamiz
  const last = await prisma.faq.findFirst({
    where: { page },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const order = (last?.order ?? 0) + 1;

  const faq = await prisma.faq.create({
    data: { question, answer, page, order, active: body.active ?? true },
  });
  return NextResponse.json({ faq }, { status: 201 });
}

// PATCH /api/admin/faq — drag-drop tartib o'zgartirish
// body: { order: [{id, order}] }
export async function PATCH(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body: { order?: { id: number; order: number }[] };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.order)) {
    return NextResponse.json({ error: "order array kerak" }, { status: 400 });
  }

  await prisma.$transaction(
    body.order.map((o) =>
      prisma.faq.update({ where: { id: o.id }, data: { order: o.order } })
    )
  );

  return NextResponse.json({ ok: true });
}
