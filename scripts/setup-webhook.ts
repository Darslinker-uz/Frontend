import "dotenv/config";

// Run once after first deploy: `npx tsx scripts/setup-webhook.ts`
// Re-run if bot token or URL changes.

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const siteUrl = process.env.AUTH_URL;

if (!token) {
  console.error("✗ TELEGRAM_BOT_TOKEN .env'da yo'q");
  process.exit(1);
}
if (!secret) {
  console.error("✗ TELEGRAM_WEBHOOK_SECRET .env'da yo'q");
  process.exit(1);
}
if (!siteUrl || !siteUrl.startsWith("https://")) {
  console.error("✗ AUTH_URL HTTPS bo'lishi kerak (Telegram webhook HTTPS'da ishlaydi)");
  console.error(`  Hozirgi: ${siteUrl}`);
  process.exit(1);
}

const webhookUrl = `${siteUrl.replace(/\/+$/, "")}/api/bot/webhook`;

async function main() {
  const action = process.argv[2];

  if (action === "info") {
    const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (action === "delete") {
    const res = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true`);
    const data = await res.json();
    console.log(data.ok ? "✓ Webhook o'chirildi" : `✗ ${JSON.stringify(data)}`);
    return;
  }

  // Default: set webhook
  console.log(`Webhook sozlanyapti: ${webhookUrl}`);
  const url = new URL(`https://api.telegram.org/bot${token}/setWebhook`);
  url.searchParams.set("url", webhookUrl);
  url.searchParams.set("secret_token", secret!);
  url.searchParams.set("drop_pending_updates", "true");
  url.searchParams.set("allowed_updates", JSON.stringify(["message", "callback_query"]));

  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.ok) {
    console.log("✓ Webhook muvaffaqiyatli sozlandi");
    console.log(`  URL: ${webhookUrl}`);
  } else {
    console.error("✗ Xatolik:", JSON.stringify(data, null, 2));
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
