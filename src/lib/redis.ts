import "server-only";

import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;
let connecting: Promise<RedisClient | null> | null = null;
let unavailable = false;
let errorLogged = false;

/** localhost → 127.0.0.1 (IPv6 ::1 ECONNREFUSED oldini oldini oladi) */
export function normalizeRedisUrl(url: string): string {
  return url.replace(/\/\/localhost\b/i, "//127.0.0.1");
}

export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL?.trim());
}

export async function getRedis(): Promise<RedisClient | null> {
  const raw = process.env.REDIS_URL?.trim();
  if (!raw || unavailable) return null;

  if (client?.isOpen) return client;
  if (connecting) return connecting;

  const url = normalizeRedisUrl(raw);

  connecting = (async () => {
    try {
      const c = createClient({
        url,
        socket: {
          connectTimeout: 5000,
          reconnectStrategy: retries => (retries > 2 ? false : Math.min(retries * 200, 1000)),
        },
      });
      c.on("error", () => {
        if (!errorLogged) {
          errorLogged = true;
          console.error(
            "[redis] Ulanish yo'q. Redis ishga tushiring yoki .env da REDIS_URL=redis://127.0.0.1:6379"
          );
        }
      });
      await c.connect();
      client = c;
      unavailable = false;
      errorLogged = false;
      return client;
    } catch {
      unavailable = true;
      if (!errorLogged) {
        errorLogged = true;
        console.error("[redis] Ulanmadi — AI vaqtincha PostgreSQL dan kurslarni o'qiydi");
      }
      return null;
    } finally {
      connecting = null;
    }
  })();

  return connecting;
}

export async function disconnectRedis(): Promise<void> {
  if (client?.isOpen) {
    await client.quit().catch(() => {});
  }
  client = null;
  unavailable = false;
}
