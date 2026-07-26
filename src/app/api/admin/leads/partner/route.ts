import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";

// GET /api/admin/leads/partner
export async function GET() {
  const deny = await requirePermission("lead.view");
  if (deny) return deny;
  const apps = await prisma.partnerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ apps });
}
