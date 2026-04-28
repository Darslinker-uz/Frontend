import "dotenv/config";
import { createTelegramClient } from "../src/lib/telegram";
import { handleUpdate } from "../src/lib/bot-handler";

// ==================== LOCAL DEV POLLER (BOTH BOTS) ====================
// Usage: npm run bot
//
// Lokal dev'da Telegram webhook'larini o'rnatib bo'lmaydi (HTTPS kerak),
// shuning uchun ikkita bot'dan ham updates'larni polling rejimida olamiz:
//   - Provider bot (@Darslinker_cbot) → "provider" mode
//   - Student bot  (@darslinkerbot)   → "student" mode

interface BotConfig {
  label: string;
  token: string | undefined;
  mode: "provider" | "student";
}

const bots: BotConfig[] = [
  { label: "@Darslinker_cbot (provider)", token: process.env.TELEGRAM_BOT_TOKEN, mode: "provider" },
  { label: "@darslinkerbot (student)",    token: process.env.TELEGRAM_STUDENT_BOT_TOKEN, mode: "student" },
];

async function pollBot(b: BotConfig) {
  if (!b.token) {
    console.warn(`⚠️  ${b.label}: token .env'da yo'q, o'tkazib yuborildi`);
    return;
  }
  const client = createTelegramClient(b.token);

  // Webhook'ni o'chirib qo'yamiz, aks holda getUpdates 409 qaytaradi
  await client.deleteWebhook();
  console.log(`🤖 ${b.label}: polling boshlandi`);

  let offset = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const updates = await client.getUpdates(offset, 25);
      if (!updates) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      for (const u of updates) {
        offset = Math.max(offset, u.update_id + 1);
        await handleUpdate(u, b.mode);
      }
    } catch (e) {
      console.error(`[${b.label}] poll error:`, e);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

async function main() {
  // Ikkala bot'ni parallel polling — ikkala Promise hech qachon resolve bo'lmaydi
  await Promise.all(bots.map(pollBot));
}

main().catch(e => {
  console.error("bot-poll fatal:", e);
  process.exit(1);
});
