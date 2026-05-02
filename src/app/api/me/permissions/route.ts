import { NextResponse } from "next/server";
import { getCurrentUserPermissions } from "@/lib/require-permission";

export const dynamic = "force-dynamic";

// GET /api/me/permissions
// Joriy foydalanuvchining permissions object'ini qaytaradi.
// Sidebar va UI gating uchun ishlatiladi.
export async function GET() {
  const ctx = await getCurrentUserPermissions();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ role: ctx.role, permissions: ctx.permissions });
}
