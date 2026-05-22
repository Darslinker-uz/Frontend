/**
 * Darslinker AI — Telegram va veb uchun umumiy mantiq.
 */

import { chatCompletion, type ChatTurn } from "@/lib/openai";
import { createTelegramClient, escHtml } from "@/lib/telegram";
import { cachedToAiRow, getAllCachedCourses, getCachedCourseById } from "@/lib/courses-redis";

export type AiAnswers = {
  goal?: string;
  direction?: string;
  level?: string;
  time?: string;
  budget?: string;
};

export type BrowseIntent = { query: string; level?: string };

type ChatState = { greeted: boolean; history: ChatTurn[] };

const DIRECTION_GROUP_SLUGS: Record<string, string[]> = {
  it: ["it"],
  marketing: ["biznes"],
  design: ["dizayn"],
  language: ["tillar"],
  business: ["biznes"],
  unknown: [],
};

const LEVEL_KEYWORDS: Record<string, string[]> = {
  beginner: ["boshlang", "beginner", "noldan", "yangi"],
  some: ["o'rta", "orta", "asosiy", "basic"],
  experienced: ["yuqori", "advanced", "professional", "pro"],
};

const BROWSE_ALIASES: Record<string, { groups?: string[]; keywords: string[] }> = {
  python: { groups: ["it"], keywords: ["python", "питон"] },
  javascript: { groups: ["it"], keywords: ["javascript", "js", "react", "node"] },
  java: { groups: ["it"], keywords: ["java"] },
  it: { groups: ["it"], keywords: ["it", "dasturlash", "programming", "dastur"] },
  marketing: { groups: ["biznes"], keywords: ["marketing", "smm", "reklama", "target"] },
  dizayn: { groups: ["dizayn"], keywords: ["dizayn", "design", "ui", "ux", "figma"] },
  til: { groups: ["tillar"], keywords: ["til", "ingliz", "ielts", "rus"] },
  ingliz: { groups: ["tillar"], keywords: ["ingliz", "english", "ielts"] },
  rus: { groups: ["tillar"], keywords: ["rus"] },
  koreys: { groups: ["tillar"], keywords: ["koreys", "korean"] },
  biznes: { groups: ["biznes"], keywords: ["biznes", "business", "sotuv"] },
};

const SUBJECT_FROM_TEXT: { pattern: RegExp; query: string }[] = [
  { pattern: /ingliz(\s*tili)?|english|ielts/i, query: "ingliz" },
  { pattern: /rus(\s*tili)?/i, query: "rus" },
  { pattern: /koreys(\s*tili)?|korean/i, query: "koreys" },
  { pattern: /\bpython\b/i, query: "python" },
  { pattern: /\bjavascript\b|\bjs\b|react/i, query: "javascript" },
  { pattern: /\bjava\b/i, query: "java" },
  { pattern: /\bmarketing\b|smm/i, query: "marketing" },
  { pattern: /dizayn|design|ui\/?ux/i, query: "dizayn" },
  { pattern: /\bit\b|dasturlash/i, query: "it" },
];

const RE_SHOW_COURSES =
  /kurslarni?\s*ko|ko['']rsat|ko['']rib\s*ber|chiqar|ro['']yxat|hammasini|barchasini|barcha\s*kurs|hamma\s*kurs|toping|izlab\s*ber|izlang|qaysi\s*kurs/i;
const RE_TOPIC_WORD =
  /^(it|python|java|javascript|js|marketing|dizayn|ingliz|rus|koreys|til|smm|react|nodejs|php|flutter)$/i;
const RE_WAIT_FOR_MORE = /^(kurs\s*kerak|til\s*bo['']yicha|nima\s*gap|qalesan|qalaysiz)$/i;

const CHAT_SYSTEM_BASE = `Sen Darslinker.uz platformasining shaxsiy yordamchisisan — iliq, odamdek, tabiiy muloqot qil.
O'zbek tilida, 1–3 qisqa jumla. Emoji juda kam.
ASOSIY: salom va muloyim javob. HECH QACHON salomni rad etmang.
Faqat darslinker.uz kurslari — Duolingo, Preply, Coursera TAVSIYA QILMA.
Kurslar ro'yxatini o'zing to'qima — tizim bazadan chiqaradi.`;

const INTRO_VARIANTS = [
  "Assalomu alaykum! Men Darslinker.uz platformasining shaxsiy yordamchisiman — sizga mos kurs topishda yordam beraman.",
  "Va alaykum assalom! Men darslinker.uz yordamchisiman. Qaysi yo'nalishda kurs qidiryapsiz?",
];

const RE_GREETING = /^(assalomu?\s*alaykum|assalom|salom|salam|hello|hi)\b/i;
const RE_SMALLTALK = /^(qalaysiz|qalesan|yaxshimisiz)\b/i;
const RE_BAD_REPLY = /salom\s*berish\s*mumkin\s*emas|duolingo|preply|coursera/i;

async function fetchAllActive() {
  return getAllCachedCourses();
}

type Row = ReturnType<typeof cachedToAiRow>;

function toRow(l: Awaited<ReturnType<typeof fetchAllActive>>[number]): Row {
  return cachedToAiRow(l);
}

function isKursConversation(history: ChatTurn[], text: string) {
  const blob = [...history.map(h => h.content), text].join(" ").toLowerCase();
  return /kurs|til\s*bo|ingliz|marketing|dizayn|\bit\b|python|yo'nalish|soha|daraja/i.test(blob);
}

function extractSubjectFromText(text: string): string | null {
  const low = text.trim().toLowerCase();
  for (const { pattern, query } of SUBJECT_FROM_TEXT) {
    if (pattern.test(low)) return query;
  }
  for (const key of Object.keys(BROWSE_ALIASES)) {
    if (new RegExp(`\\b${key}\\b`, "i").test(low)) return key;
  }
  if (RE_TOPIC_WORD.test(low)) return low;
  return null;
}

function extractLevelFromText(text: string): string | undefined {
  const low = text.trim().toLowerCase();
  if (/boshlang|beginner|noldan/.test(low)) return "beginner";
  if (/o['']rta|orta|ozgina|asosiy/.test(low)) return "some";
  if (/yuqori|advanced|tajriba/.test(low)) return "experienced";
  return undefined;
}

function findSubjectInHistory(history: ChatTurn[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role !== "user") continue;
    const s = extractSubjectFromText(history[i].content);
    if (s && s !== "til") return s;
  }
  return null;
}

export function resolveBrowseIntent(text: string, history: ChatTurn[]): BrowseIntent | null {
  const low = text.trim().toLowerCase();
  const inKurs = isKursConversation(history, text);
  if (RE_WAIT_FOR_MORE.test(low)) return null;
  if (/hammasini|barchasini|barcha\s*kurs|hamma\s*kurs/i.test(low)) {
    return { query: "", level: extractLevelFromText(text) };
  }
  if (RE_SHOW_COURSES.test(low)) {
    const subject = extractSubjectFromText(text) ?? findSubjectInHistory(history);
    return { query: subject ?? "", level: extractLevelFromText(text) };
  }
  const subjectNow = extractSubjectFromText(text);
  const levelNow = extractLevelFromText(text);
  if (subjectNow && subjectNow !== "til" && inKurs) return { query: subjectNow, level: levelNow };
  if (levelNow && inKurs) {
    const subject = findSubjectInHistory(history);
    if (subject) return { query: subject, level: levelNow };
  }
  if (RE_TOPIC_WORD.test(low) && inKurs) return { query: low, level: levelNow };
  return null;
}

function scoreBrowse(row: ReturnType<typeof toRow>, query: string, level?: string) {
  const q = query.toLowerCase().trim();
  let score = 0;
  if (!q) score = row.views;
  else {
    const alias = BROWSE_ALIASES[q] ?? { keywords: [q] };
    const hay = `${row.title} ${row.description ?? ""} ${row.categoryName} ${row.groupSlug}`.toLowerCase();
    if (alias.groups?.includes(row.groupSlug)) score += 45;
    for (const kw of alias.keywords) {
      if (hay.includes(kw)) score += 35;
      if (row.title.toLowerCase().includes(kw)) score += 25;
    }
    if (hay.includes(q)) score += 20;
    if (score === 0) return 0;
  }
  if (level) {
    const levelText = [row.level, ...row.levels].filter(Boolean).join(" ").toLowerCase();
    const kw = LEVEL_KEYWORDS[level] ?? [];
    if (kw.some(k => levelText.includes(k))) score += 35;
    else if (level === "beginner" && !levelText) score += 12;
    else if (level === "beginner") score -= 8;
  }
  return score;
}

export async function searchListingsByQuery(query: string, level?: string): Promise<number[]> {
  const listings = await fetchAllActive();
  const q = query.trim().toLowerCase();
  if (!q) return listings.sort((a, b) => b.views - a.views).map(l => l.id);
  const scored = listings
    .map(l => ({ id: l.id, score: scoreBrowse(toRow(l), q, level) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length) return scored.map(s => s.id);
  return listings
    .filter(l => `${l.title} ${l.description ?? ""}`.toLowerCase().includes(q))
    .sort((a, b) => b.views - a.views)
    .map(l => l.id);
}

function scoreMatch(row: ReturnType<typeof toRow>, answers: AiAnswers) {
  let score = 0;
  const dir = answers.direction ?? "unknown";
  const groups = DIRECTION_GROUP_SLUGS[dir] ?? [];
  if (dir === "unknown" || groups.includes(row.groupSlug)) score += 35;
  const budget = answers.budget ?? "any";
  if (budget === "free" && row.price === 0) score += 40;
  if (budget === "low" && row.price <= 500_000) score += 30;
  score += Math.min(row.views / 25, 12);
  return score;
}

export async function rankListingsForMatch(answers: AiAnswers): Promise<number[]> {
  const listings = await fetchAllActive();
  return listings
    .map(l => ({ id: l.id, score: scoreMatch(toRow(l), answers) }))
    .sort((a, b) => b.score - a.score)
    .map(s => s.id);
}

export function browseListTitle(query: string, level?: string): string {
  if (!query) return "📚 Kurslar";
  const labels: Record<string, string> = {
    python: "Python",
    it: "IT",
    marketing: "Marketing",
    dizayn: "Dizayn",
    ingliz: "Ingliz tili",
    rus: "Rus tili",
  };
  const label = labels[query] ?? query;
  const lvl =
    level === "beginner" ? " (boshlang'ich)" : level === "some" ? " (o'rta)" : "";
  return `🔎 ${label}${lvl} bo'yicha kurslar`;
}

export async function conversationalReplyForWeb(
  userText: string,
  chat: ChatState
): Promise<{ reply: string; chat: ChatState }> {
  const low = userText.trim().toLowerCase();
  if (RE_GREETING.test(low) && !chat.greeted) {
    const reply = INTRO_VARIANTS[Math.floor(Math.random() * INTRO_VARIANTS.length)];
    return {
      reply,
      chat: {
        greeted: true,
        history: [
          ...chat.history,
          { role: "user" as const, content: userText },
          { role: "assistant" as const, content: reply },
        ].slice(-20),
      },
    };
  }
  if (RE_SMALLTALK.test(low)) {
    const reply = "Yaxshi, rahmat! Qaysi yo'nalishda kurs izlayapsiz? (IT, ingliz tili, marketing...)";
    return {
      reply,
      chat: {
        greeted: true,
        history: [
          ...chat.history,
          { role: "user" as const, content: userText },
          { role: "assistant" as const, content: reply },
        ].slice(-20),
      },
    };
  }
  const system =
    CHAT_SYSTEM_BASE +
    (chat.greeted
      ? "\nQayta salom bermang. Kurs yo'nalishi aytilsa — qisqa tasdiq, ro'yxat tizimda chiqadi."
      : "\nBirinchi marta qisqa salom bilan boshlang.");
  const ai = await chatCompletion({
    system,
    history: chat.history,
    user: userText.slice(0, 500),
    maxTokens: 150,
    temperature: 0.5,
  });
  let reply =
    ai ??
    (chat.greeted
      ? "Qaysi yo'nalishda kurs qidiryapsiz? Masalan: ingliz tili, IT, marketing."
      : INTRO_VARIANTS[0]);
  if (RE_BAD_REPLY.test(reply)) {
    reply = "Darslinker.uz da kurslar bor — yo'nalishni yozing (masalan: ingliz tili), ro'yxatni chiqaraman.";
  }
  return {
    reply,
    chat: {
      greeted: true,
      history: [
        ...chat.history,
        { role: "user" as const, content: userText },
        { role: "assistant" as const, content: reply },
      ].slice(-20),
    },
  };
}

function getAdminIds(): string[] {
  const raw =
    process.env.DarslinkerAdminIds ||
    process.env.DARSLINKER_ADMIN_IDS ||
    process.env.TELEGRAM_SUPER_ADMIN_CHAT_ID ||
    "";
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

export async function notifyAdminsInquiry(params: {
  listingId: number;
  phone: string;
  sessionKey: string;
}) {
  const l = await getCachedCourseById(params.listingId);
  if (!l) return;
  const site = process.env.AUTH_URL?.replace(/\/$/, "") || "https://darslinker.uz";
  const fmt = (p: number) => (p === 0 ? "Bepul" : `${new Intl.NumberFormat("uz-UZ").format(p)} so'm`);
  const lines = [
    "📩 <b>Yangi ma'lumot so'rovi</b> (veb /ai)",
    "",
    `📚 <b>Kurs:</b> ${escHtml(l.title)}`,
    `🏫 <b>Markaz:</b> ${escHtml(l.centerName)}`,
    `🏷 ${escHtml(l.categoryName)}`,
    `💰 ${escHtml(fmt(l.price))}`,
    "",
    `📞 <b>Telefon:</b> ${escHtml(params.phone)}`,
    `🆔 <b>Sessiya:</b> <code>${escHtml(params.sessionKey)}</code>`,
    "",
    `🔗 ${site}/kurslar/${l.groupSlug}/${l.slug}`,
  ];
  const token = process.env.TELEGRAM_STUDENT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const client = createTelegramClient(token);
  for (const adminId of getAdminIds()) {
    await client.sendMessage(adminId, lines.join("\n"), {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  }
}
