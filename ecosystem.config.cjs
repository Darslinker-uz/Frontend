/**
 * PM2: sayt + Telegram polling birga (`npm run start:with-bots`).
 *
 * Ishlatish:
 *   cd /path/to/Frontend
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup   # server qayta yuklanganda avtomatik (bir marta ko'rsatma chiqadi)
 *
 * Webhook ishlatadigan productionda odatda faqat `next start` yetarli —
 * bu konfig polling uchun (webhook o'chiriladi, README/start-with-bots.cjs ga qarang).
 */
module.exports = {
  apps: [
    {
      name: "darslinker",
      cwd: __dirname,
      script: "npm",
      args: ["run", "start:with-bots"],
      interpreter: "none",
      instances: 1,
      autorestart: true,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
