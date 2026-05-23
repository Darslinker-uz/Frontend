/**
 * Darslinker AI — veb (/ai sahifa) mini chat.
 * Telegram @darslinkerbot bilan bir xil mantiq, JSON javob.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import { chatCompletion, type ChatTurn } from "@/lib/openai";
import { normalizePhone } from "@/lib/telegram";
import type { AiAnswers } from "@/lib/ai-shared";
import { getCachedCoursesByIds } from "@/lib/courses-redis";

const PAGE_SIZE = 5;
const SITE_BASE = process.env.AUTH_URL?.replace(/\/$/, "") || "https://darslinker.uz";

export type WebAiAction =
  | { type: "init" }
  | { type: "message"; text: string }
  | { type: "menu_match" }
  | { type: "quiz_answer"; key: string; value: string }
  | { type: "courses_page"; page: number }
  | { type: "course_open"; index: number }
  | { type: "course_inquiry"; listingId: number }
  | { type: "inquiry_phone"; phone: string; listingId?: number };

export type WebCourseCard = {
  id: number;
  title: string;
  price: string;
  format: string;
  centerName: string;
  categoryName: string;
  url: string;
};

export type WebCourseDetail = WebCourseCard & {
  duration: string | null;
  level: string | null;
  certificate: boolean;
  demoLesson: boolean;
  description: string | null;
};

export type WebAiUi =
  | { kind: "menu"; buttons: { id: string; label: string }[] }
  | {
      kind: "quiz";
      step: number;
      total: number;
      question: string;
      options: { id: string; label: string }[];
    }
  | {
      kind: "courses";
      title: string;
      courses: WebCourseCard[];
      /** To'liq tartiblangan ID ro'yxati (sahifalashdan tashqari) */
      resultIds: number[];
      page: number;
      totalPages: number;
      total: number;
    }
  | { kind: "course"; course: WebCourseDetail }
  | { kind: "phone"; listingId: number; courseTitle: string };

export type WebAiResponse = {
  ok: boolean;
  error?: string;
  sessionId: string;
  assistantMessages: string[];
  ui?: WebAiUi;
  limitReached?: boolean;
};

// ——— Quiz savollar (student-ai bilan bir xil) ———

const QUESTIONS = [
  {
    key: "goal" as const,
    text: "Nima maqsadda kurs qidiryapsiz?",
    options: [
      { id: "income", label: "📈 Daromad" },
      { id: "career", label: "🎯 Yangi kasb" },
      { id: "freelance", label: "🌐 Freelance" },
      { id: "business", label: "🏢 Biznes" },
      { id: "growth", label: "🌱 Rivojlanish" },
    ],
  },
  {
    key: "direction" as const,
    text: "Qaysi yo'nalish qiziq?",
    options: [
      { id: "it", label: "💻 IT" },
      { id: "marketing", label: "📣 Marketing" },
      { id: "design", label: "🎨 Dizayn" },
      { id: "language", label: "🗣 Til" },
      { id: "business", label: "📊 Biznes" },
      { id: "unknown", label: "🤷 Bilmayman" },
    ],
  },
  {
    key: "level" as const,
    text: "Darajangiz qanday?",
    options: [
      { id: "beginner", label: "🌱 Boshlovchi" },
      { id: "some", label: "📚 Ozgina" },
      { id: "experienced", label: "⭐ Tajribali" },
    ],
  },
  {
    key: "time" as const,
    text: "Haftasiga qancha vaqt?",
    options: [
      { id: "low", label: "⏱ 3–5 soat" },
      { id: "mid", label: "⏰ 5–10 soat" },
      { id: "high", label: "🔥 10+ soat" },
    ],
  },
  {
    key: "budget" as const,
    text: "Kurs uchun qancha byudjet?",
    options: [
      { id: "low", label: "💰 500 minggacha" },
      { id: "mid", label: "💵 500 ming – 1.5 mln" },
      { id: "high", label: "💎 1.5 mln+" },
      { id: "free", label: "🆓 Bepul" },
      { id: "any", label: "🤷 Muhim emas" },
    ],
  },
];

type SessionMeta = {
  flow: "menu" | "quiz" | "results";
  mode: "match" | "browse";
  resultIds: number[];
  page: number;
  browseQuery?: string;
};

type ChatState = {
  greeted: boolean;
  history: ChatTurn[];
  pendingInquiry?: { listingId: number };
};

function webKey(sessionId: string) {
  return `web:${sessionId}`;
}

function todayTashkent() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" });
}

function getDailyLimit() {
  const n = parseInt(process.env.DailymessageLimit || "20", 10);
  return Number.isFinite(n) && n > 0 ? n : 20;
}

async function checkLimit(key: string) {
  const session = await prisma.studentAiSession.findUnique({ where: { chatId: key } });
  const count = session?.dailyDate === todayTashkent() ? session.dailyCount : 0;
  return count < getDailyLimit();
}

async function bumpLimit(key: string) {
  const today = todayTashkent();
  const session = await prisma.studentAiSession.findUnique({ where: { chatId: key } });
  const count = session?.dailyDate === today ? session.dailyCount + 1 : 1;
  await prisma.studentAiSession.upsert({
    where: { chatId: key },
    create: { chatId: key, dailyDate: today, dailyCount: 1, step: 0, answers: {} },
    update: { dailyDate: today, dailyCount: count },
  });
}

function parseStored(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { answers: {} as AiAnswers, meta: null as SessionMeta | null, chat: { greeted: false, history: [] as ChatTurn[] } };
  }
  const o = raw as Record<string, unknown>;
  const { _meta, _chat, ...rest } = o;
  const meta = _meta && typeof _meta === "object" && !Array.isArray(_meta) ? (_meta as SessionMeta) : null;
  const c = _chat && typeof _chat === "object" && !Array.isArray(_chat) ? (_chat as Record<string, unknown>) : {};
  const history = Array.isArray(c.history)
    ? (c.history as ChatTurn[]).filter(t => t.role === "user" || t.role === "assistant").slice(-20)
    : [];
  const pending =
    c.pendingInquiry && typeof c.pendingInquiry === "object"
      ? { listingId: Number((c.pendingInquiry as { listingId: number }).listingId) }
      : undefined;
  return {
    answers: rest as AiAnswers,
    meta,
    chat: { greeted: Boolean(c.greeted), history, pendingInquiry: pending?.listingId ? pending : undefined },
  };
}

function pack(answers: AiAnswers, meta: SessionMeta | null, chat: ChatState): Prisma.InputJsonValue {
  return { ...answers, ...(meta ? { _meta: meta } : {}), _chat: chat } as Prisma.InputJsonValue;
}

async function load(key: string) {
  const row = await prisma.studentAiSession.findUnique({ where: { chatId: key } });
  const p = parseStored(row?.answers);
  return { step: row?.step ?? 0, ...p };
}

async function save(
  key: string,
  data: { step?: number; answers?: AiAnswers; meta?: SessionMeta | null; chat?: ChatState }
) {
  const cur = await load(key);
  await prisma.studentAiSession.upsert({
    where: { chatId: key },
    create: {
      chatId: key,
      step: data.step ?? 0,
      answers: pack(data.answers ?? {}, data.meta ?? null, data.chat ?? cur.chat),
      dailyDate: todayTashkent(),
      dailyCount: 0,
    },
    update: {
      step: data.step ?? cur.step,
      answers: pack(data.answers ?? cur.answers, data.meta !== undefined ? data.meta : cur.meta, data.chat ?? cur.chat),
    },
  });
}

function formatPrice(price: number) {
  return price === 0 ? "Bepul" : `${new Intl.NumberFormat("uz-UZ").format(price)} so'm`;
}

function formatFormat(f: string) {
  const m: Record<string, string> = { offline: "Offline", online: "Online", video: "Video", hybrid: "Gibrid" };
  return m[f] ?? f;
}

async function fetchListings(ids: number[]) {
  if (!ids.length) return [];
  const cached = await getCachedCoursesByIds(ids);
  return cached.map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    price: c.price,
    format: c.format as "offline" | "online" | "video" | "hybrid",
    duration: c.duration,
    certificate: c.certificate,
    demoLesson: c.demoLesson,
    level: c.level,
    category: { name: c.categoryName, group: { slug: c.groupSlug } },
    user: { centerName: c.centerName, name: c.centerName },
  }));
}

function toCard(l: Awaited<ReturnType<typeof fetchListings>>[number]): WebCourseCard {
  const g = l.category.group.slug;
  return {
    id: l.id,
    title: l.title,
    price: formatPrice(l.price),
    format: formatFormat(l.format),
    centerName: l.user.centerName ?? l.user.name,
    categoryName: l.category.name,
    url: `${SITE_BASE}/kurslar/${g}/${l.slug}`,
  };
}

function toDetail(l: Awaited<ReturnType<typeof fetchListings>>[number]): WebCourseDetail {
  return {
    ...toCard(l),
    duration: l.duration,
    level: l.level,
    certificate: l.certificate,
    demoLesson: l.demoLesson,
    description: l.description,
  };
}

import {
  resolveBrowseIntentAsync,
  searchCoursesByIntent,
  rankListingsForMatch,
  browseListTitleFromIntent,
  browseListTitle,
  conversationalReplyForWeb,
  notifyAdminsInquiry,
} from "@/lib/ai-shared";

async function buildCoursesUi(meta: SessionMeta, title: string): Promise<WebAiUi> {
  const total = meta.resultIds.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(meta.page, totalPages - 1);
  const slice = meta.resultIds.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const rows = await fetchListings(slice);
  return {
    kind: "courses",
    title,
    resultIds: meta.resultIds,
    page,
    totalPages,
    total,
    courses: rows.map(toCard),
  };
}

function quizUi(step: number): WebAiUi {
  const q = QUESTIONS[step - 1];
  return {
    kind: "quiz",
    step,
    total: QUESTIONS.length,
    question: q.text,
    options: q.options.map(o => ({ id: o.id, label: o.label })),
  };
}

function ok(sessionId: string, msgs: string[], ui?: WebAiUi): WebAiResponse {
  return { ok: true, sessionId, assistantMessages: msgs, ui };
}

function fail(sessionId: string, error: string, limit?: boolean): WebAiResponse {
  return { ok: false, sessionId, error, assistantMessages: [], limitReached: limit };
}

export async function processWebAi(sessionId: string, action: WebAiAction): Promise<WebAiResponse> {
  const key = webKey(sessionId);

  if (action.type !== "init" && !(await checkLimit(key))) {
    return fail(sessionId, `Kunlik limit (${getDailyLimit()}) tugadi. Ertaga qayting.`, true);
  }

  const { step, answers, meta, chat } = await load(key);

  if (action.type === "init") {
    const intro =
      "Assalomu alaykum! Men Darslinker.uz shaxsiy yordamchisiman — sizga mos kurs topishda yordam beraman.";
    const nextChat = { ...chat, greeted: true, history: [...chat.history, { role: "assistant" as const, content: intro }] };
    await save(key, { step: 0, meta: null, chat: nextChat });
    return ok(sessionId, [intro], {
      kind: "menu",
      buttons: [{ id: "menu_match", label: "🎯 Mos kursni topish" }],
    });
  }

  if (action.type === "menu_match") {
    await bumpLimit(key);
    await save(key, { step: 1, answers: {}, meta: { flow: "quiz", mode: "match", resultIds: [], page: 0 }, chat });
    const q = QUESTIONS[0];
    return ok(sessionId, ["🎯 Zo'r! Bir nechta savolga javob bering.", q.text], quizUi(1));
  }

  if (action.type === "quiz_answer") {
    await bumpLimit(key);
    const qIndex = QUESTIONS.findIndex(q => q.key === action.key);
    if (qIndex < 0) return fail(sessionId, "Noto'g'ri javob");
    const nextAnswers = { ...answers, [action.key]: action.value } as AiAnswers;
    const nextStep = qIndex + 2;
    if (nextStep <= 5) {
      await save(key, { step: nextStep, answers: nextAnswers });
      const q = QUESTIONS[nextStep - 1];
      return ok(sessionId, [q.text], quizUi(nextStep));
    }
    const ids = await rankListingsForMatch(nextAnswers);
    const resultMeta: SessionMeta = { flow: "results", mode: "match", resultIds: ids, page: 0 };
    await save(key, { step: 6, answers: nextAnswers, meta: resultMeta });
    const title = "🎓 Sizga mos kurslar";
    const ui = await buildCoursesUi(resultMeta, title);
    return ok(
      sessionId,
      ids.length ? ["Rahmat! Sizga mos kurslar:", "Raqamni bosing — batafsil ko'rasiz."] : ["Hozircha mos kurs topilmadi."],
      ui
    );
  }

  if (action.type === "courses_page" && meta) {
    const totalPages = Math.max(1, Math.ceil(meta.resultIds.length / PAGE_SIZE));
    const page = Math.max(0, Math.min(action.page, totalPages - 1));
    const newMeta = { ...meta, page };
    await save(key, { meta: newMeta });
    const title = meta.mode === "browse" ? browseListTitle(meta.browseQuery ?? "") : "🎓 Sizga mos kurslar";
    const ui = await buildCoursesUi(newMeta, title);
    return ok(sessionId, [], ui);
  }

  if (action.type === "course_open" && meta) {
    const idx = meta.page * PAGE_SIZE + action.index;
    const id = meta.resultIds[idx];
    if (!id) return fail(sessionId, "Kurs topilmadi");
    const rows = await fetchListings([id]);
    if (!rows[0]) return fail(sessionId, "Kurs topilmadi");
    return ok(sessionId, [], { kind: "course", course: toDetail(rows[0]) });
  }

  if (action.type === "course_inquiry") {
    await bumpLimit(key);
    const rows = await fetchListings([action.listingId]);
    const title = rows[0]?.title ?? "Kurs";
    await save(key, { chat: { ...chat, pendingInquiry: { listingId: action.listingId } } });
    return ok(
      sessionId,
      [
        "📞 Qo'shimcha ma'lumot olish",
        "Telefon raqamingizni qoldiring, biz sizga aloqaga chiqamiz (masalan: 991234567):",
      ],
      { kind: "phone", listingId: action.listingId, courseTitle: title }
    );
  }

  if (action.type === "inquiry_phone") {
    const listingId = action.listingId ?? chat.pendingInquiry?.listingId;
    if (!listingId) return fail(sessionId, "Avval kursni tanlang");
    const phone = normalizePhone(action.phone.replace(/\D/g, "").length === 9 ? `998${action.phone.replace(/\D/g, "")}` : action.phone);
    await notifyAdminsInquiry({ listingId, phone, sessionKey: key });
    await save(key, { chat: { ...chat, pendingInquiry: undefined } });
    return ok(sessionId, ["✅ Rahmat! Tez orada siz bilan bog'lanamiz."]);
  }

  if (action.type === "message") {
    await bumpLimit(key);
    const text = action.text.trim();
    if (!text) return fail(sessionId, "Xabar bo'sh");

    if (chat.pendingInquiry) {
      const digits = text.replace(/\D/g, "");
      if (digits.length < 9) return fail(sessionId, "Telefon noto'g'ri. Masalan: 991234567");
      return processWebAi(sessionId, {
        type: "inquiry_phone",
        phone: text,
        listingId: chat.pendingInquiry.listingId,
      });
    }

    const browse = await resolveBrowseIntentAsync(text, chat.history);
    if (browse !== null) {
      const ids = await searchCoursesByIntent(browse);
      const title = browseListTitleFromIntent(browse);
      const resultMeta: SessionMeta = { flow: "results", mode: "browse", resultIds: ids, page: 0, browseQuery: browse.query };
      const hist = {
        ...chat,
        history: [...chat.history, { role: "user" as const, content: text }, { role: "assistant" as const, content: title }],
      };
      await save(key, { step: 0, meta: resultMeta, chat: hist });
      const ui = await buildCoursesUi(resultMeta, title);
      return ok(sessionId, ids.length ? [title, "Pastdagi raqamlarni bosing:"] : ["Mos kurs topilmadi."], ui);
    }

    const { reply, chat: nextChat } = await conversationalReplyForWeb(text, chat);
    await save(key, { chat: nextChat });
    return ok(sessionId, [reply], { kind: "menu", buttons: [{ id: "menu_match", label: "🎯 Mos kursni topish" }] });
  }

  return fail(sessionId, "Noma'lum amal");
}

export function createWebSessionId(): string {
  return crypto.randomUUID();
}
