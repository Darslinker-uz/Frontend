import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ id: string }> }

// PATCH /api/admin/leads/partner/:id — { status: "new_app"|"in_progress"|"accepted"|"rejected" }
export async function PATCH(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const appId = Number(id);
  if (!appId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const allowed = ["new_app", "in_progress", "accepted", "rejected"] as const;
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const app = await prisma.partnerApplication.update({
    where: { id: appId },
    data: { status: body.status },
  });
  return NextResponse.json({ app });
}

// DELETE /api/admin/leads/partner/:id
export async function DELETE(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const appId = Number(id);
  if (!appId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.partnerApplication.delete({ where: { id: appId } });
  return NextResponse.json({ ok: true });
}
