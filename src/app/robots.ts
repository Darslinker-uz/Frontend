import type { MetadataRoute } from "next";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

const DISALLOW = ["/admin", "/admin/*", "/dashboard", "/dashboard/*", "/api/*", "/auth"];

// AI crawlers — platform ma'lumotlari (kurslar, markazlar) LLMlarga ham kirish
// mumkin bo'lsin, toki ChatGPT/Gemini/Claude/Perplexity javoblarida saytimiz
// ko'rsatilsin. Maxfiy joylar (admin, dashboard, api) baribir yopiq.
const AI_BOTS = [
  "GPTBot",              // OpenAI — ChatGPT search & training
  "OAI-SearchBot",       // OpenAI — SearchGPT indexing
  "ChatGPT-User",        // OpenAI — when user browses inside ChatGPT
  "Google-Extended",     // Google — Gemini training & AI Overviews
  "ClaudeBot",           // Anthropic — Claude search & training
  "anthropic-ai",        // Anthropic — legacy UA
  "PerplexityBot",       // Perplexity — search index
  "Perplexity-User",     // Perplexity — live browse
  "CCBot",               // Common Crawl — many LLMlar shu bazani ishlatadi
  "Bytespider",          // ByteDance / Doubao
  "Applebot-Extended",   // Apple Intelligence
  "Meta-ExternalAgent",  // Meta AI
  "DuckAssistBot",       // DuckDuckGo AI
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_BOTS.map(ua => ({ userAgent: ua, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
