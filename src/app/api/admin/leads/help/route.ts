import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/leads/help
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const leads = await prisma.helpLead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ leads });
}
