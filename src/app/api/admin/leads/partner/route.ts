import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/leads/partner
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const apps = await prisma.partnerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ apps });
}
