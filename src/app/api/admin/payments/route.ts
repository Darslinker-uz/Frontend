import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/payments?type=topup|lead|boost|refund&status=success|pending|cancelled
export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (status) where.status = status;

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, phone: true, role: true } },
    },
  });
  return NextResponse.json({ payments });
}
