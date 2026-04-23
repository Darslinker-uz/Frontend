import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

// POST /api/dashboard/change-password
// body: { current: string, new: string, confirm: string }
export async function POST(request: Request) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const current = String(body?.current ?? "");
  const next = String(body?.new ?? "");
  const confirm = String(body?.confirm ?? "");

  if (!next || next.length < 6) return NextResponse.json({ error: "Yangi parol kamida 6 belgi" }, { status: 400 });
  if (next !== confirm) return NextResponse.json({ error: "Yangi parollar mos emas" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If user already has a password, verify the current one.
  if (user.passwordHash) {
    if (!current) return NextResponse.json({ error: "Joriy parolni kiriting" }, { status: 400 });
    if (user.passwordHash !== sha256(current)) {
      return NextResponse.json({ error: "Joriy parol noto'g'ri" }, { status: 400 });
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: sha256(next) },
  });

  return NextResponse.json({ ok: true });
}
