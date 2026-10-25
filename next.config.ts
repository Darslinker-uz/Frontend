import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import path from "node:path";

// Har deploy'ning versiyasi — git commit. Ochiq tab'dagi eski versiya serverdagi yangisi bilan mos kelmasa,
// Next.js sahifani to'liq qayta yuklaydi (version skew). Git bo'lmasa — o'chiq.
function gitSha(): string | undefined {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || undefined;
  } catch {
    return undefined;
  }
}

const nextConfig: NextConfig = {
  deploymentId: process.env.NEXT_DEPLOYMENT_ID || gitSha(),
  // darslinker.uz orqali next dev (reverse proxy) — HMR / _next dev resurslari uchun
  allowedDevOrigins: ["darslinker.uz", "www.darslinker.uz"],
  turbopack: {
    root: path.join(__dirname),
  },
  // experimental.inlineCss ishlatilmaydi: sinovda (2026-10-25) har sahifa HTML'i 20 KB dan 137 KB (gzip) ga oshdi —
  // butun sayt CSS'i ikki marta inline bo'ldi va mobil LCP yomonlashdi.
  async redirects() {
    // Brauzerlar odatda /favicon.ico so‘raydi; metadata faqat svg/png yo‘llarini ko‘rsatadi.
    return [
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
      // CRM/LMS sahifasining yopiq demo manzili — sahifa bosh sahifaga ko'chdi (2026-10-23).
      { source: "/democrm", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
