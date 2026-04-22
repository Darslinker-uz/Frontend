import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyPartnerApplication } from "@/lib/bot-handler";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/partner-applications — body: { name, phone, telegram?, centerName, category, city, studentsCount, message? }
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`partner:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const telegram = body.telegram ? String(body.telegram).trim() : null;
  const centerName = String(body.centerName ?? "").trim();
  const category = String(body.category ?? "").trim();
  const city = String(body.city ?? "").trim();
  const studentsCount = String(body.studentsCount ?? "").trim();
  const message = body.message ? String(body.message).trim() : null;

  if (!name || !phone || !centerName || !category || !city || !studentsCount) {
    return NextResponse.json({ error: "Majburiy maydon bo'sh" }, { status: 400 });
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    return NextResponse.json({ error: "Telefon formati noto'g'ri" }, { status: 400 });
  }

  const app = await prisma.partnerApplication.create({
    data: { name, phone, telegram, centerName, category, city, studentsCount, message, status: "new_app" },
  });

  notifyPartnerApplication({
    name, phone, telegram, centerName, category, city, studentsCount, message,
    createdAt: app.createdAt,
  }).catch(e => console.error("[partner] telegram notify failed", e));

  return NextResponse.json({ app }, { status: 201 });
}
