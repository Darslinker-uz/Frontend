import { NextResponse } from "next/server";
import { notifyCrmApplication } from "@/lib/bot-handler";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const PLANS = ["minimal", "standart", "biznes", "korporativ", "individual"];

// POST /api/crm-applications — body: { name, phone, centerName, students?, plan, ref }
// Bazaga yozilmaydi: ariza faqat Telegram'ga (super admin) yuboriladi.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`crm-app:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const phone = String(body.phone ?? "").trim();
  const centerName = String(body.centerName ?? "").trim().slice(0, 150);
  const students = String(body.students ?? "").trim().slice(0, 30);
  const plan = PLANS.includes(String(body.plan)) ? String(body.plan) : "minimal";
  const ref = String(body.ref ?? "").trim().slice(0, 50) || "unknown";

  if (!name || !phone || !centerName) {
    return NextResponse.json({ error: "Majburiy maydon bo'sh" }, { status: 400 });
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    return NextResponse.json({ error: "Telefon formati noto'g'ri" }, { status: 400 });
  }

  try {
    await notifyCrmApplication({ name, phone, centerName, students, plan, ref });
  } catch (e) {
    console.error("[crm-application] telegram notify failed", e);
    return NextResponse.json({ error: "Yuborib bo'lmadi" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
