import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Admin panel API: admin yoki assistant (middleware’dagi /admode/* qoidasi bilan bir xil).
// Faqat to‘liq admin kerak bo‘lsa — requireAdminOnly() (@/lib/require-permission).
// Usage:
//   const deny = await requireAdmin();
//   if (deny) return deny;
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role !== "admin" && role !== "assistant") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
