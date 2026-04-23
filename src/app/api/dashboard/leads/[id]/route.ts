import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { syncLeadBotMessage } from "@/lib/bot-handler";
import type { LeadStatus } from "@/generated/prisma";

interface Ctx { params: Promise<{ id: string }> }

const ALLOWED: LeadStatus[] = ["new_lead", "contacted", "callback", "converted", "not_interested", "disputed"];

// PATCH /api/dashboard/leads/:id — update status/note (teacher only, own lead)
export async function PATCH(request: Request, { params }: Ctx) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const leadId = Number(id);
  if (!leadId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  // Ownership check: lead's listing must belong to current user
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { listing: { select: { userId: true } } },
  });
  if (!lead || lead.listing.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const data: { status?: LeadStatus; note?: string | null } = {};
  if (body.status && ALLOWED.includes(body.status)) data.status = body.status;
  if (body.note !== undefined) data.note = body.note ? String(body.note).trim() : null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updated = await prisma.lead.update({ where: { id: leadId }, data });

  // Sync the bot message so inline buttons reflect the new status
  syncLeadBotMessage(updated.id).catch(e => console.error("[lead] bot sync failed", e));

  return NextResponse.json({ lead: updated });
}
