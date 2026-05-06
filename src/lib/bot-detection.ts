// User-Agent string'idan bot turi va kategoriyasini aniqlash.
// AI search (LLM crawlers) — eng muhim, alohida kategoriyada chiqadi.

export type BotCategory = "ai" | "search" | "social" | "other";

export interface BotInfo {
  name: string;
  category: BotCategory;
}

interface BotPattern {
  pattern: RegExp;
  name: string;
  category: BotCategory;
}

// Tartib muhim — ko'p o'xshash UA'lar uchun aniqroq pattern oldinga.
// AI bots oldindan, keyin search engines, keyin social, keyin generic.
const BOT_PATTERNS: BotPattern[] = [
  // ─── AI / LLM crawlers ───
  { pattern: /GPTBot/i, name: "GPTBot", category: "ai" },
  { pattern: /OAI-SearchBot/i, name: "OAI-SearchBot", category: "ai" },
  { pattern: /ChatGPT-User/i, name: "ChatGPT-User", category: "ai" },
  { pattern: /ClaudeBot/i, name: "ClaudeBot", category: "ai" },
  { pattern: /anthropic-ai/i, name: "Anthropic-AI", category: "ai" },
  { pattern: /Claude-Web/i, name: "Claude-Web", category: "ai" },
  { pattern: /Google-Extended/i, name: "Google-Extended", category: "ai" },
  { pattern: /Googlebot-Gemini/i, name: "Googlebot-Gemini", category: "ai" },
  { pattern: /PerplexityBot/i, name: "PerplexityBot", category: "ai" },
  { pattern: /Perplexity-User/i, name: "Perplexity-User", category: "ai" },
  { pattern: /YouBot/i, name: "YouBot", category: "ai" },
  { pattern: /cohere-ai/i, name: "Cohere-AI", category: "ai" },
  { pattern: /Bytespider/i, name: "Bytespider", category: "ai" },
  { pattern: /Diffbot/i, name: "Diffbot", category: "ai" },
  { pattern: /DeepSeekBot/i, name: "DeepSeekBot", category: "ai" },
  { pattern: /Meta-ExternalAgent/i, name: "Meta-ExternalAgent", category: "ai" },
  { pattern: /Meta-ExternalFetcher/i, name: "Meta-ExternalFetcher", category: "ai" },
  { pattern: /Applebot-Extended/i, name: "Applebot-Extended", category: "ai" },
  { pattern: /Amazonbot/i, name: "Amazonbot", category: "ai" },
  { pattern: /MistralAI-User/i, name: "MistralAI-User", category: "ai" },
  { pattern: /Timpibot/i, name: "Timpibot", category: "ai" },
  { pattern: /Omgilibot/i, name: "Omgilibot", category: "ai" },
  { pattern: /ImagesiftBot/i, name: "ImagesiftBot", category: "ai" },
  { pattern: /Kangaroo Bot/i, name: "Kangaroo Bot", category: "ai" },
  { pattern: /YandexAdditional/i, name: "YandexAdditional", category: "ai" },

  // ─── Search engines ───
  { pattern: /Googlebot/i, name: "Googlebot", category: "search" },
  { pattern: /Storebot-Google/i, name: "Storebot-Google", category: "search" },
  { pattern: /AdsBot-Google/i, name: "AdsBot-Google", category: "search" },
  { pattern: /Bingbot/i, name: "Bingbot", category: "search" },
  { pattern: /BingPreview/i, name: "BingPreview", category: "search" },
  { pattern: /YandexBot/i, name: "YandexBot", category: "search" },
  { pattern: /DuckDuckBot/i, name: "DuckDuckBot", category: "search" },
  { pattern: /Baiduspider/i, name: "Baiduspider", category: "search" },
  { pattern: /Sogou/i, name: "Sogou", category: "search" },
  { pattern: /Applebot/i, name: "Applebot", category: "search" },
  { pattern: /SeznamBot/i, name: "SeznamBot", category: "search" },
  { pattern: /Slurp/i, name: "Yahoo Slurp", category: "search" },
  { pattern: /Qwantify/i, name: "Qwantify", category: "search" },
  { pattern: /MojeekBot/i, name: "MojeekBot", category: "search" },

  // ─── Social / Messenger preview bots ───
  { pattern: /facebookexternalhit/i, name: "Facebook", category: "social" },
  { pattern: /FacebookBot/i, name: "FacebookBot", category: "social" },
  { pattern: /Twitterbot/i, name: "Twitterbot", category: "social" },
  { pattern: /LinkedInBot/i, name: "LinkedInBot", category: "social" },
  { pattern: /WhatsApp/i, name: "WhatsApp", category: "social" },
  { pattern: /TelegramBot/i, name: "TelegramBot", category: "social" },
  { pattern: /Discordbot/i, name: "Discordbot", category: "social" },
  { pattern: /Slackbot/i, name: "Slackbot", category: "social" },
  { pattern: /Pinterestbot/i, name: "Pinterestbot", category: "social" },
  { pattern: /redditbot/i, name: "Redditbot", category: "social" },
  { pattern: /TikTokBot/i, name: "TikTokBot", category: "social" },
  { pattern: /SkypeUriPreview/i, name: "Skype", category: "social" },

  // ─── SEO / Misc tools ───
  { pattern: /AhrefsBot/i, name: "AhrefsBot", category: "other" },
  { pattern: /SemrushBot/i, name: "SemrushBot", category: "other" },
  { pattern: /MJ12bot/i, name: "MJ12bot", category: "other" },
  { pattern: /DotBot/i, name: "DotBot", category: "other" },
  { pattern: /BLEXBot/i, name: "BLEXBot", category: "other" },
  { pattern: /SiteAuditBot/i, name: "SiteAuditBot", category: "other" },
  { pattern: /UptimeRobot/i, name: "UptimeRobot", category: "other" },
  { pattern: /Pingdom/i, name: "Pingdom", category: "other" },

  // ─── Generic fallback (har qanday "bot/spider/crawler" so'zli UA) ───
  { pattern: /\bbot\b/i, name: "Other Bot", category: "other" },
  { pattern: /\bcrawler\b/i, name: "Other Crawler", category: "other" },
  { pattern: /\bspider\b/i, name: "Other Spider", category: "other" },
  { pattern: /headlesschrome/i, name: "HeadlessChrome", category: "other" },
];

export function detectBot(userAgent: string | null | undefined): BotInfo | null {
  if (!userAgent) return null;
  for (const { pattern, name, category } of BOT_PATTERNS) {
    if (pattern.test(userAgent)) return { name, category };
  }
  return null;
}
