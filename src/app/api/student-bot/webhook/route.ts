import { NextResponse } from "next/server";
import { handleUpdate } from "@/lib/bot-handler";
import type { TgUpdate } from "@/lib/telegram";

// POST /api/student-bot/webhook — student bot (@darslinkerbot) updates land here.
// Same secret is reused for both bots (set on both via setWebhook).
export async function POST(request: Request) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = request.headers.get("x-telegram-bot-api-secret-token");
  if (expected && got !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let update: TgUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Fire and forget — Telegram expects fast response
  handleUpdate(update, "student").catch(e => console.error("[webhook:student]", e));
  return NextResponse.json({ ok: true });
}
