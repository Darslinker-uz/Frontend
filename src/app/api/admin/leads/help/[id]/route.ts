import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/leads/help/:id — { status: "new_req" | "answered" | "closed" }
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const leadId = Number(id);
  if (!leadId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const allowed = ["new_req", "answered", "closed"] as const;
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await prisma.helpLead.update({
    where: { id: leadId },
    data: { status: body.status },
  });
  return NextResponse.json({ lead });
}

// DELETE /api/admin/leads/help/:id
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const leadId = Number(id);
  if (!leadId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.helpLead.delete({ where: { id: leadId } });
  return NextResponse.json({ ok: true });
}
