/**
 * Bir vaqtda: `next start` + Telegram polling (`bot-poll.ts`).
 *
 * DIQQAT: bot-poll ishga tushganda har ikkala bot uchun deleteWebhook() chaqiriladi.
 * Agar allaqachon HTTPS webhook o'rnatgan bo'lsangiz, ular o'chiriladi — faqat
 * webhook ISHLATMASLIK yoki dev/VPS'da polling kerak bo'lsa ishlating.
 * Production + webhook: faqat `npm start` (alohida `npm run bot` emas).
 */
const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.join(__dirname, "..");
const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");
const tsxCli = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");
const botScript = path.join(root, "scripts", "bot-poll.ts");

const env = { ...process.env };
const node = process.execPath;

const next = spawn(node, [nextCli, "start"], { cwd: root, env, stdio: "inherit" });
const bot = spawn(node, [tsxCli, botScript], { cwd: root, env, stdio: "inherit" });

function shutdown() {
  next.kill("SIGTERM");
  bot.kill("SIGTERM");
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});

next.on("exit", (code, signal) => {
  bot.kill("SIGTERM");
  process.exit(code ?? (signal ? 1 : 0));
});

bot.on("exit", (code, signal) => {
  if (code !== 0 && code !== null) {
    console.error("[start-with-bots] bot-poll tugadi (kod:", code, signal || "", ") — Next.js davom etmoqda");
  }
});
