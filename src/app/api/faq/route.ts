import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/faq?page=home — public, faqat aktiv FAQ'lar tartib bo'yicha
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "home";

  const faqs = await prisma.faq.findMany({
    where: { active: true, page },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: { id: true, question: true, answer: true, order: true },
  });

  return NextResponse.json({ faqs });
}
