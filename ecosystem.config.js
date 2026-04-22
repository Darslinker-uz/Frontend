/**
 * PM2 Ecosystem Configuration
 * Production deployment for darslinker.uz
 * 
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 restart darslinker
 *   pm2 logs darslinker
 */
module.exports = {
  apps: [
    {
      name: "darslinker",
      script: "npm",
      args: "start",
      cwd: "/root/Frontend",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/darslinker/error.log",
      out_file: "/var/log/darslinker/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
