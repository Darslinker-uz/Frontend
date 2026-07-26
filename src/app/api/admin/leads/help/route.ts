import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";

// GET /api/admin/leads/help
export async function GET() {
  const deny = await requirePermission("lead.view");
  if (deny) return deny;
  const leads = await prisma.helpLead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ leads });
}
