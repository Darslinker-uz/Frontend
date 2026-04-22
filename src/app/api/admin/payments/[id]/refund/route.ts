import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// POST /api/admin/payments/:id/refund — creates a refund payment linked to the original via txnRef
export async function POST(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const pid = Number(id);
  if (!pid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const original = await prisma.payment.findUnique({ where: { id: pid } });
  if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (original.type === "refund") return NextResponse.json({ error: "Cannot refund a refund" }, { status: 400 });

  const refund = await prisma.payment.create({
    data: {
      userId: original.userId,
      amount: original.amount,
      type: "refund",
      status: "success",
      method: original.method,
      description: "Admin tomonidan qaytarildi",
      txnRef: String(original.id),
    },
    include: { user: { select: { id: true, name: true, phone: true, role: true } } },
  });
  return NextResponse.json({ refund });
}
