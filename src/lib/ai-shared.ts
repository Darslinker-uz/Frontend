/**
 * Darslinker AI — Telegram va veb uchun umumiy mantiq.
 */

if (process.env.NEXT_RUNTIME && !process.env.SKIP_SERVER_ONLY) { require("server-only"); }

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

export type { CourseSearchIntent, CourseSearchIntent as BrowseIntent } from "@/lib/ai-course-search";
export {
  resolveCourseSearchIntent,
  resolveCourseSearchIntent as resolveBrowseIntent,
  resolveCourseSearchIntentAsync,
  resolveCourseSearchIntentAsync as resolveBrowseIntentAsync,
  searchCoursesByIntent,
  searchListingsByQuery,
  browseListTitleFromIntent,
  browseListTitle,
  isVagueCourseRequest,
  hasTopicInTextOrHistory,
  getDirectionClarificationReply,
} from "@/lib/ai-course-search";

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

const CHAT_SYSTEM_BASE = `Sen Darslinker.uz platformasining shaxsiy yordamchisisan — iliq, odamdek, tabiiy muloqot qil.
O'zbek tilida, 1–3 qisqa jumla. Emoji juda kam.
ASOSIY: salom va muloyim javob. HECH QACHON salomni rad etmang.
Faqat darslinker.uz kurslari — Duolingo, Preply, Coursera TAVSIYA QILMA.
Kurslar ro'yxatini o'zing to'qima — tizim bazadan chiqaradi.
Agar foydalanuvchi faqat «kurs kerak» yoki «kurslarni ko'rsat» desa, avval qaysi yo'nalish (ingliz tili, IT, kimyo, marketing…) ekanini so'ra; ro'yxatni o'zing chiqarma.`;

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
