import "dotenv/config";
import { getUpdates, deleteWebhook } from "../src/lib/telegram";
import { handleUpdate } from "../src/lib/bot-handler";

// ==================== LOCAL DEV POLLER ====================
// Usage: npm run bot
//
// Polling mode — the script fetches updates from Telegram every few seconds
// and dispatches them to the shared handler. No public URL required.

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN is not set in .env");
    process.exit(1);
  }

  // Make sure webhook is cleared, otherwise getUpdates returns 409.
  await deleteWebhook();
  console.log("🤖 Bot polling started. Press Ctrl+C to stop.");

  let offset = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const updates = await getUpdates(offset, 25);
    if (!updates) {
      await new Promise(r => setTimeout(r, 3000));
      continue;
    }
    for (const u of updates) {
      offset = Math.max(offset, u.update_id + 1);
      await handleUpdate(u);
    }
  }
}

main().catch(e => {
  console.error("bot-poll fatal:", e);
  process.exit(1);
});
