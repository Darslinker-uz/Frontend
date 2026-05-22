/**
 * npm start — avval Redis (Docker), keyin `next start`.
 * REDIS_URL allaqachon ishlayotgan bo'lsa Docker chaqirilmaydi.
 */
const { spawn, execSync } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const root = path.join(__dirname, "..");
const composeFile = path.join(root, "docker-compose.redis.yml");
const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");
const tsxCli = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");
const syncScript = path.join(root, "scripts", "sync-courses-redis.ts");
const node = process.execPath;
const env = { ...process.env };

function parseRedisUrl(url) {
  try {
    const u = new URL((url || "redis://127.0.0.1:6379").replace(/\/\/localhost\b/i, "//127.0.0.1"));
    const host = u.hostname === "localhost" ? "127.0.0.1" : u.hostname || "127.0.0.1";
    return { host, port: parseInt(u.port || "6379", 10) };
  } catch {
    return { host: "127.0.0.1", port: 6379 };
  }
}

function redisPing(host, port) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host, port }, () => {
      socket.end();
      resolve(true);
    });
    socket.setTimeout(2000, () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => resolve(false));
  });
}

function runDockerCompose() {
  const cmds = [
    ["docker", ["compose", "-f", composeFile, "up", "-d"]],
    ["docker-compose", ["-f", composeFile, "up", "-d"]],
  ];
  for (const [bin, args] of cmds) {
    try {
      execSync([bin, ...args].join(" "), { cwd: root, stdio: "inherit", env });
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

async function ensureRedis() {
  const redisUrl = process.env.REDIS_URL?.trim();
  if (!redisUrl) {
    console.warn("[start] REDIS_URL yo'q — Redis o'tkazib yuborildi");
    return false;
  }

  const { host, port } = parseRedisUrl(redisUrl);
  if (await redisPing(host, port)) {
    console.log(`[start] Redis tayyor (${host}:${port})`);
    return true;
  }

  console.log("[start] Redis ishga tushirilmoqda (Docker)...");
  if (!runDockerCompose()) {
    console.warn("[start] Docker topilmadi — serverda Redis alohida o'rnatish kerak:");
    console.warn("  Ubuntu/Debian: sudo apt update && sudo apt install -y redis-server");
    console.warn("  sudo systemctl enable redis-server && sudo systemctl start redis-server");
    console.warn("  Tekshirish: redis-cli ping  →  PONG");
    console.warn("  .env: REDIS_URL=\"redis://127.0.0.1:6379\"  (localhost emas!)");
    console.warn("  Bulut: Upstash.com → REDIS_URL ni .env ga qo'ying");
    console.warn("[start] Hozircha AI kurslar PostgreSQL dan o'qiladi");
    return false;
  }

  for (let i = 0; i < 40; i++) {
    if (await redisPing(host, port)) {
      console.log(`[start] Redis tayyor (${host}:${port})`);
      return true;
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.warn("[start] Redis javob bermadi — next start davom etadi");
  return false;
}

function runCoursesSync() {
  if (!process.env.REDIS_URL?.trim()) return;
  if (!process.env.DATABASE_URL?.trim()) {
    console.warn("[start] DATABASE_URL yo'q — kurslar sync o'tkazildi");
    return;
  }
  try {
    console.log("[start] Kurslar DB → Redis sync...");
    execSync(`${node} ${tsxCli} ${syncScript}`, { cwd: root, env, stdio: "inherit" });
  } catch (err) {
    console.warn("[start] sync:courses xato (keyin instrumentation qayta urinadi):", err.message);
  }
}

async function main() {
  const redisOk = await ensureRedis();
  if (redisOk) runCoursesSync();
  else console.warn("[start] Redis sync o'tkazilmadi (Redis yo'q)");

  console.log("[start] Next.js production server...");
  const next = spawn(node, [nextCli, "start"], { cwd: root, env, stdio: "inherit" });

  process.on("SIGINT", () => {
    next.kill("SIGTERM");
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    next.kill("SIGTERM");
    process.exit(0);
  });

  next.on("exit", (code, signal) => {
    process.exit(code ?? (signal ? 1 : 0));
  });
}

main().catch(err => {
  console.error("[start]", err);
  process.exit(1);
});
