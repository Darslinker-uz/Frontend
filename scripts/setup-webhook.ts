import "dotenv/config";

// Webhook setup for BOTH bots — provider (@Darslinker_cbot) and student (@darslinkerbot).
// Usage:
//   npx tsx scripts/setup-webhook.ts              -> set both webhooks
//   npx tsx scripts/setup-webhook.ts info         -> show webhook info for both
//   npx tsx scripts/setup-webhook.ts delete       -> remove both webhooks
//
// Re-run after deploy or after changing tokens / AUTH_URL.

interface BotConfig {
  label: string;
  token: string | undefined;
  webhookPath: string;
}

const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const siteUrl = process.env.AUTH_URL;

if (!secret) {
  console.error("✗ TELEGRAM_WEBHOOK_SECRET .env'da yo'q");
  process.exit(1);
}
if (!siteUrl || !siteUrl.startsWith("https://")) {
  console.error("✗ AUTH_URL HTTPS bo'lishi kerak (Telegram webhook HTTPS'da ishlaydi)");
  console.error(`  Hozirgi: ${siteUrl}`);
  process.exit(1);
}

const base = siteUrl.replace(/\/+$/, "");
const bots: BotConfig[] = [
  { label: "provider (@Darslinker_cbot)", token: process.env.TELEGRAM_BOT_TOKEN, webhookPath: `${base}/api/bot/webhook` },
  { label: "student (@darslinkerbot)",     token: process.env.TELEGRAM_STUDENT_BOT_TOKEN, webhookPath: `${base}/api/student-bot/webhook` },
];

async function info(b: BotConfig) {
  if (!b.token) {
    console.log(`— ${b.label}: token yo'q, o'tkazib yuborildi`);
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${b.token}/getWebhookInfo`);
  const data = await res.json();
  console.log(`— ${b.label}:`);
  console.log(JSON.stringify(data, null, 2));
}

async function del(b: BotConfig) {
  if (!b.token) {
    console.log(`— ${b.label}: token yo'q, o'tkazib yuborildi`);
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${b.token}/deleteWebhook?drop_pending_updates=true`);
  const data = await res.json();
  console.log(data.ok ? `✓ ${b.label}: webhook o'chirildi` : `✗ ${b.label}: ${JSON.stringify(data)}`);
}

async function set(b: BotConfig) {
  if (!b.token) {
    console.log(`— ${b.label}: token yo'q, o'tkazib yuborildi`);
    return;
  }
  console.log(`Webhook sozlanyapti — ${b.label}: ${b.webhookPath}`);
  const url = new URL(`https://api.telegram.org/bot${b.token}/setWebhook`);
  url.searchParams.set("url", b.webhookPath);
  url.searchParams.set("secret_token", secret!);
  url.searchParams.set("drop_pending_updates", "true");
  url.searchParams.set("allowed_updates", JSON.stringify(["message", "callback_query"]));

  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.ok) {
    console.log(`✓ ${b.label}: webhook sozlandi`);
  } else {
    console.error(`✗ ${b.label}: ${JSON.stringify(data, null, 2)}`);
    process.exit(1);
  }
}

async function main() {
  const action = process.argv[2];
  for (const b of bots) {
    if (action === "info") await info(b);
    else if (action === "delete") await del(b);
    else await set(b);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
