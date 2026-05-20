import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import { chatCompletion, type ChatTurn } from "@/lib/openai";
import { escHtml, type TelegramClient } from "@/lib/telegram";

// ==================== DARSLINKER AI (@darslinkerbot) ====================
// /ai → mos kurs quiz | Erkin chat: tarix (20 xabar)

const PAGE_SIZE = 5;
const MAX_CHAT_HISTORY = 20;
const SITE_BASE = process.env.AUTH_URL?.replace(/\/$/, "") || "https://darslinker.uz";

export type AiAnswers = {
  goal?: string;
  direction?: string;
  level?: string;
  time?: string;
  budget?: string;
};

type SessionMeta = {
  flow: "menu" | "quiz" | "results";
  mode: "match";
  resultIds: number[];
  page: number;
  listMessageId?: number;
  view: "list" | "detail";
  detailIdx?: number;
};

type ChatState = {
  greeted: boolean;
  history: ChatTurn[];
};

type QuestionKey = keyof AiAnswers;

interface QuestionDef {
  key: QuestionKey;
  text: string;
  options: { id: string; label: string }[];
}

const QUESTIONS: QuestionDef[] = [
  {
    key: "goal",
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
    key: "direction",
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
    key: "level",
    text: "Darajangiz qanday?",
    options: [
      { id: "beginner", label: "🌱 Boshlovchi" },
      { id: "some", label: "📚 Ozgina" },
      { id: "experienced", label: "⭐ Tajribali" },
    ],
  },
  {
    key: "time",
    text: "Haftasiga qancha vaqt?",
    options: [
      { id: "low", label: "⏱ 3–5 soat" },
      { id: "mid", label: "⏰ 5–10 soat" },
      { id: "high", label: "🔥 10+ soat" },
    ],
  },
  {
    key: "budget",
    text: "Kurs uchun qancha byudjet ajratasiz?",
    options: [
      { id: "low", label: "💰 500 minggacha" },
      { id: "mid", label: "💵 500 ming – 1.5 mln" },
      { id: "high", label: "💎 1.5 mln+" },
      { id: "free", label: "🆓 Bepul ham bo'laveradi" },
      { id: "any", label: "🤷 Muhim emas" },
    ],
  },
];

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

const CHAT_SYSTEM_BASE = `Sen "Darslinker AI" — Darslinker.uz kurs maslahatchisisan.
O'zbek tilida, aniq va qisqa javob ber (1–3 jumla, ortiqcha so'z yo'q).
Faqat kurslar, kasb o'rganish, IT, marketing, dizayn, tillar haqida gapir.
Boshqa mavzuga o'tsa — muloyim rad et, kurs mavzusiga qayt.
Kurs tanlash testi uchun /ai buyrug'ini taklif qil.
Emoji kam. HTML yo'q. Oldingi xabarlarni hisobga ol.`;

// ---------- helpers ----------

function todayTashkent(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" });
}

function getDailyLimit(): number {
  const n = parseInt(process.env.DailymessageLimit || process.env.DAILY_MESSAGE_LIMIT || "20", 10);
  return Number.isFinite(n) && n > 0 ? n : 20;
}

function isAiCommand(text: string | undefined): boolean {
  if (!text) return false;
  const t = text.trim().toLowerCase();
  const bot = (process.env.TELEGRAM_STUDENT_BOT_USERNAME || "darslinkerbot").toLowerCase();
  return t === "/ai" || t === `/ai@${bot}`;
}

function shouldSkipForAi(text: string | undefined, hasContact: boolean): boolean {
  if (hasContact) return true;
  if (!text) return false;
  const t = text.trim();
  return t.startsWith("/start") || t.startsWith("/help") || t.startsWith("/code") || t.startsWith("/groupid");
}

const DEFAULT_CHAT: ChatState = { greeted: false, history: [] };

function parseChat(raw: unknown): ChatState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ...DEFAULT_CHAT };
  const c = raw as Record<string, unknown>;
  const history = Array.isArray(c.history)
    ? c.history
        .filter((m): m is ChatTurn => {
          if (!m || typeof m !== "object") return false;
          const t = m as ChatTurn;
          return (t.role === "user" || t.role === "assistant") && typeof t.content === "string";
        })
        .slice(-MAX_CHAT_HISTORY)
    : [];
  return { greeted: Boolean(c.greeted), history };
}

function parseSessionJson(raw: unknown): { answers: AiAnswers; meta: SessionMeta | null; chat: ChatState } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { answers: {}, meta: null, chat: { ...DEFAULT_CHAT } };
  }
  const obj = raw as Record<string, unknown>;
  const { _meta, _chat, ...rest } = obj;
  const meta = _meta && typeof _meta === "object" && !Array.isArray(_meta)
    ? (_meta as SessionMeta)
    : null;
  return { answers: rest as AiAnswers, meta, chat: parseChat(_chat) };
}

function packSession(
  answers: AiAnswers,
  meta: SessionMeta | null,
  chat: ChatState
): Prisma.InputJsonValue {
  return { ...answers, ...(meta ? { _meta: meta } : {}), _chat: chat } as Prisma.InputJsonValue;
}

function appendHistory(chat: ChatState, userText: string, assistantText: string): ChatState {
  const history = [
    ...chat.history,
    { role: "user" as const, content: userText.slice(0, 400) },
    { role: "assistant" as const, content: assistantText.slice(0, 400) },
  ].slice(-MAX_CHAT_HISTORY);
  return { greeted: true, history };
}

async function showTyping(client: TelegramClient, chatId: number): Promise<void> {
  await client.sendChatAction(chatId, "typing");
}

function formatPrice(price: number): string {
  return price === 0 ? "Bepul" : `${new Intl.NumberFormat("uz-UZ").format(price)} so'm`;
}

function formatFormat(f: string): string {
  const m: Record<string, string> = { offline: "Offline", online: "Online", video: "Video", hybrid: "Gibrid" };
  return m[f] ?? f;
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

// ---------- DB session ----------

async function checkDailyLimit(chatId: string): Promise<{ ok: boolean }> {
  const limit = getDailyLimit();
  const today = todayTashkent();
  const session = await prisma.studentAiSession.findUnique({ where: { chatId } });
  const count = session?.dailyDate === today ? session.dailyCount : 0;
  return { ok: count < limit };
}

async function incrementDailyCount(chatId: string): Promise<void> {
  const today = todayTashkent();
  const session = await prisma.studentAiSession.findUnique({ where: { chatId } });
  const count = session?.dailyDate === today ? session.dailyCount + 1 : 1;
  await prisma.studentAiSession.upsert({
    where: { chatId },
    create: { chatId, dailyDate: today, dailyCount: 1, step: 0, answers: {} },
    update: { dailyDate: today, dailyCount: count },
  });
}

async function loadSession(chatId: string) {
  const row = await prisma.studentAiSession.findUnique({ where: { chatId } });
  const { answers, meta, chat } = parseSessionJson(row?.answers);
  return { step: row?.step ?? 0, answers, meta, chat };
}

async function saveSession(
  chatId: string,
  data: { step?: number; answers?: AiAnswers; meta?: SessionMeta | null; chat?: ChatState }
) {
  const current = await loadSession(chatId);
  const answers = data.answers ?? current.answers;
  const meta = data.meta !== undefined ? data.meta : current.meta;
  const chat = data.chat ?? current.chat;
  await prisma.studentAiSession.upsert({
    where: { chatId },
    create: {
      chatId,
      step: data.step ?? 0,
      answers: packSession(answers, meta, chat),
      dailyDate: todayTashkent(),
      dailyCount: 0,
    },
    update: {
      step: data.step ?? current.step,
      answers: packSession(answers, meta, chat),
    },
  });
}

// ---------- listings ----------

type CourseRow = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  format: string;
  duration: string | null;
  certificate: boolean;
  demoLesson: boolean;
  level: string | null;
  levels: string[];
  views: number;
  categoryName: string;
  groupSlug: string;
  centerName: string | null;
  score: number;
};

function scoreListing(l: Omit<CourseRow, "score">, answers: AiAnswers): number {
  let score = 0;
  const dir = answers.direction ?? "unknown";
  const groups = DIRECTION_GROUP_SLUGS[dir] ?? [];
  if (dir === "unknown" || groups.includes(l.groupSlug)) score += 35;
  else score -= 5;

  const lvl = answers.level ?? "beginner";
  const levelText = [l.level, ...l.levels].filter(Boolean).join(" ").toLowerCase();
  const kw = LEVEL_KEYWORDS[lvl] ?? [];
  if (kw.some(k => levelText.includes(k))) score += 22;
  else if (lvl === "beginner") score += 10;

  const budget = answers.budget ?? "any";
  if (budget === "free" && l.price === 0) score += 40;
  if (budget === "low" && l.price <= 500_000) score += 30;
  if (budget === "low" && l.price === 0) score += 35;
  if (budget === "mid" && l.price > 500_000 && l.price <= 1_500_000) score += 28;
  if (budget === "high" && l.price > 1_500_000) score += 28;
  if (budget === "any") score += 5;

  const time = answers.time;
  if (time === "low" && (l.format === "video" || l.format === "online")) score += 12;
  if (time === "high") score += 5;

  const goal = answers.goal;
  if (["income", "freelance", "career"].includes(goal ?? "") && ["it", "biznes"].includes(l.groupSlug)) {
    score += 12;
  }
  if (l.certificate) score += 6;
  if (l.demoLesson) score += 4;
  score += Math.min(l.views / 25, 12);
  return score;
}

async function fetchAllActive() {
  return prisma.listing.findMany({
    where: { status: "active", category: { active: true, pendingApproval: false } },
    select: {
      id: true, title: true, slug: true, description: true, price: true, format: true,
      duration: true, certificate: true, demoLesson: true, level: true, levels: true, views: true,
      category: { select: { name: true, group: { select: { slug: true } } } },
      user: { select: { centerName: true, name: true } },
    },
    take: 300,
  });
}

function toCourseRow(l: Awaited<ReturnType<typeof fetchAllActive>>[number], score = 0): CourseRow {
  return {
    id: l.id,
    title: l.title,
    slug: l.slug,
    description: l.description,
    price: l.price,
    format: l.format,
    duration: l.duration,
    certificate: l.certificate,
    demoLesson: l.demoLesson,
    level: l.level,
    levels: l.levels,
    views: l.views,
    categoryName: l.category.name,
    groupSlug: l.category.group.slug,
    centerName: l.user.centerName ?? l.user.name,
    score,
  };
}

async function rankForMatch(answers: AiAnswers): Promise<number[]> {
  const listings = await fetchAllActive();
  const scored = listings
    .map(l => {
      const row = toCourseRow(l);
      return { ...row, score: scoreListing(row, answers) };
    })
    .sort((a, b) => b.score - a.score || a.price - b.price);
  return scored.map(s => s.id);
}

async function getCoursesByIds(ids: number[]): Promise<Map<number, CourseRow>> {
  if (ids.length === 0) return new Map();
  const listings = await prisma.listing.findMany({
    where: { id: { in: ids } },
    select: {
      id: true, title: true, slug: true, description: true, price: true, format: true,
      duration: true, certificate: true, demoLesson: true, level: true, levels: true, views: true,
      category: { select: { name: true, group: { select: { slug: true } } } },
      user: { select: { centerName: true, name: true } },
    },
  });
  const map = new Map<number, CourseRow>();
  for (const l of listings) map.set(l.id, toCourseRow(l));
  return map;
}

// ---------- UI: menu, list, detail ----------

function mainMenuKeyboard() {
  return {
    inline_keyboard: [[{ text: "🎯 Mos kursni topish", callback_data: "ai:m:match" }]],
  };
}

function questionKeyboard(q: QuestionDef) {
  const rows: { text: string; callback_data: string }[][] = [];
  let row: { text: string; callback_data: string }[] = [];
  for (const opt of q.options) {
    row.push({ text: opt.label, callback_data: `ai:${q.key}:${opt.id}` });
    if (row.length === 2) { rows.push(row); row = []; }
  }
  if (row.length) rows.push(row);
  rows.push([{ text: "◀️ Menyu", callback_data: "ai:mn" }]);
  return { inline_keyboard: rows };
}

function listKeyboard(meta: SessionMeta, pageCount: number) {
  const start = meta.page * PAGE_SIZE;
  const pageIds = meta.resultIds.slice(start, start + PAGE_SIZE);
  const numRow = pageIds.map((_, i) => ({
    text: String(i + 1),
    callback_data: `ai:k:${i + 1}`,
  }));
  const rows: { text: string; callback_data: string }[][] = [];
  if (meta.page < pageCount - 1) {
    rows.push([{ text: "➡️ Keyingi 5 ta", callback_data: `ai:p:${meta.page + 1}` }]);
  }
  if (meta.page > 0) {
    rows.push([{ text: "⬅️ Oldingi 5 ta", callback_data: `ai:p:${meta.page - 1}` }]);
  }
  if (numRow.length) rows.push(numRow);
  rows.push([{ text: "◀️ Menyu", callback_data: "ai:mn" }]);
  return { inline_keyboard: rows };
}

function buildListText(
  courses: CourseRow[],
  meta: SessionMeta,
  title: string
): string {
  const start = meta.page * PAGE_SIZE;
  const total = meta.resultIds.length;
  if (courses.length === 0) {
    return "😔 Hozircha mos kurs topilmadi.\n\nKeyinroq /ai bilan qayta urinib ko'ring.";
  }
  const lines = [
    `<b>${escHtml(title)}</b>`,
    `<i>${start + 1}–${start + courses.length} / ${total} ta</i>`,
    "",
  ];
  courses.forEach((c, i) => {
    const n = start + i + 1;
    const short = truncate(c.title, 42);
    lines.push(`${n}. ${escHtml(short)} — ${escHtml(formatPrice(c.price))}`);
  });
  lines.push("", "<i>Raqam tugmasini bosing — kurs haqida batafsil.</i>");
  return lines.join("\n");
}

function buildDetailText(c: CourseRow): string {
  const url = `${SITE_BASE}/kurslar/${c.groupSlug}/${c.slug}`;
  const desc = c.description ? truncate(c.description.replace(/\s+/g, " "), 280) : null;
  const lines = [
    `📚 <b>${escHtml(c.title)}</b>`,
    "",
    `🏫 ${escHtml(c.centerName ?? "—")}`,
    `🏷 ${escHtml(c.categoryName)} · ${formatFormat(c.format)}`,
    `💰 ${escHtml(formatPrice(c.price))}`,
  ];
  if (c.duration) lines.push(`⏳ ${escHtml(c.duration)}`);
  if (c.level) lines.push(`📊 ${escHtml(c.level)}`);
  if (c.certificate) lines.push("📜 Sertifikat bor");
  if (c.demoLesson) lines.push("🎁 Demo dars bor");
  if (desc) lines.push("", escHtml(desc));
  lines.push("", `🔗 <a href="${url}">Saytda ochish</a>`);
  return lines.join("\n");
}

function detailKeyboard(meta: SessionMeta, pageCount: number) {
  const rows: { text: string; callback_data: string }[][] = [
    [{ text: "◀️ Ro'yxatga", callback_data: "ai:b" }],
  ];
  if (meta.page < pageCount - 1) {
    rows.unshift([{ text: "➡️ Keyingi 5 ta", callback_data: `ai:p:${meta.page + 1}` }]);
  }
  rows.push([{ text: "🏠 Menyu", callback_data: "ai:mn" }]);
  return { inline_keyboard: rows };
}

async function showMainMenu(client: TelegramClient, chatId: number, edit?: { messageId: number }) {
  const text =
    "🤖 <b>Darslinker AI</b>\n\n" +
    "Sizga mos kursni topish uchun tugmani bosing:";
  const opts = { parse_mode: "HTML" as const, reply_markup: mainMenuKeyboard(), disable_web_page_preview: true };
  if (edit) {
    await client.editMessageText(chatId, edit.messageId, text, opts);
  } else {
    await client.sendMessage(chatId, text, opts);
  }
}

async function renderResultsList(
  client: TelegramClient,
  chatId: number,
  meta: SessionMeta,
  title: string,
  edit?: { messageId: number }
): Promise<number | null> {
  const start = meta.page * PAGE_SIZE;
  const pageIds = meta.resultIds.slice(start, start + PAGE_SIZE);
  const map = await getCoursesByIds(pageIds);
  const courses = pageIds.map(id => map.get(id)).filter((c): c is CourseRow => !!c);
  const pageCount = Math.max(1, Math.ceil(meta.resultIds.length / PAGE_SIZE));
  const viewMeta: SessionMeta = { ...meta, view: "list", detailIdx: undefined };
  const text = buildListText(courses, viewMeta, title);
  const opts = {
    parse_mode: "HTML" as const,
    reply_markup: listKeyboard(viewMeta, pageCount),
    disable_web_page_preview: true,
  };

  if (edit) {
    await client.editMessageText(chatId, edit.messageId, text, opts);
    return edit.messageId;
  }
  const sent = await client.sendMessage(chatId, text, opts);
  return sent?.message_id ?? null;
}

async function renderDetail(
  client: TelegramClient,
  chatId: number,
  messageId: number,
  meta: SessionMeta,
  globalIdx: number
) {
  const id = meta.resultIds[globalIdx];
  if (!id) return;
  const map = await getCoursesByIds([id]);
  const c = map.get(id);
  if (!c) return;
  const pageCount = Math.max(1, Math.ceil(meta.resultIds.length / PAGE_SIZE));
  const detailMeta: SessionMeta = { ...meta, view: "detail", detailIdx: globalIdx };
  await saveSession(String(chatId), { meta: detailMeta });
  await client.editMessageText(chatId, messageId, buildDetailText(c), {
    parse_mode: "HTML",
    reply_markup: detailKeyboard(detailMeta, pageCount),
    disable_web_page_preview: true,
  });
}

// ---------- quiz ----------

function matchTextToOption(text: string, options: QuestionDef["options"]): string | null {
  const lower = text.toLowerCase().trim();
  const aliases: Record<string, string[]> = {
    income: ["daromad", "ish", "pul"], career: ["kasb"], freelance: ["frilans"],
    business: ["biznes"], growth: ["rivoj"],
    it: ["it", "dasturlash"], marketing: ["marketing", "smm"], design: ["dizayn"],
    language: ["til", "ingliz"], unknown: ["bilmayman"],
    beginner: ["boshlovchi"], some: ["ozgina"], experienced: ["tajriba"],
    low: ["3", "5 soat", "500", "arzon", "minggacha"],
    mid: ["5-10", "1.5"], high: ["10+", "1.5 mln"],
    free: ["bepul"], any: ["muhim emas"],
  };
  for (const o of options) {
    if ((aliases[o.id] ?? []).some(k => lower.includes(k))) return o.id;
  }
  return null;
}

async function sendQuestion(client: TelegramClient, chatId: number, stepIndex: number) {
  const q = QUESTIONS[stepIndex];
  if (!q) return;
  const intro = stepIndex === 0 ? "🎯 <b>Mos kursni topamiz!</b>\n\n" : "";
  await client.sendMessage(chatId, `${intro}<b>${escHtml(q.text)}</b>`, {
    parse_mode: "HTML",
    reply_markup: questionKeyboard(q),
    disable_web_page_preview: true,
  });
}

async function finishMatchQuiz(client: TelegramClient, chatId: number, answers: AiAnswers) {
  const ids = await rankForMatch(answers);
  const meta: SessionMeta = {
    flow: "results",
    mode: "match",
    resultIds: ids,
    page: 0,
    view: "list",
  };
  await saveSession(String(chatId), { step: 6, answers, meta });
  const msgId = await renderResultsList(
    client,
    chatId,
    meta,
    "🎓 Sizga mos kurslar",
  );
  if (msgId) {
    await saveSession(String(chatId), {
      meta: { ...meta, listMessageId: msgId },
    });
  }
}

async function startMatchQuiz(chatId: string) {
  await saveSession(chatId, {
    step: 1,
    answers: {},
    meta: { flow: "quiz", mode: "match", resultIds: [], page: 0, view: "list" },
  });
}

/** Erkin chat — tarix, bir marta salom, qisqa javob */
async function conversationalReply(userText: string, chat: ChatState): Promise<{ reply: string; chat: ChatState }> {
  const fallback = (msg: string, greeted: boolean) => {
    const low = msg.toLowerCase();
    if (!greeted && /^(salom|assalom|hello|hi)\b/.test(low)) {
      return "Assalomu alaykum! Men Darslinker AI — kurslar bo'yicha yordam beraman. Savolingizni yozing yoki mos kurs uchun /ai yuboring.";
    }
    if (/^(rahmat|tashakkur)/.test(low)) return "Arzimaydi! Yana savol bo'lsa yozing.";
    return "Kurslar haqida savolingizni yozing. Mos kurs topish uchun /ai yuboring.";
  };

  const system =
    CHAT_SYSTEM_BASE +
    (chat.greeted
      ? "\nMUHIM: Qayta salom bermang (Salom, Assalomu alaykum ishlatmang). To'g'ridan-to'g'ri javob bering."
      : "\nBU BIRINCHI MULOQOT: bir marta qisqa salom bilan boshlang, keyin savol bering.");

  const ai = await chatCompletion({
    system,
    history: chat.history,
    user: userText.slice(0, 500),
    maxTokens: 150,
    temperature: 0.4,
  });

  const reply = ai ?? fallback(userText, chat.greeted);
  const nextChat = appendHistory(chat, userText, reply);
  return { reply, chat: nextChat };
}

// ---------- public handlers ----------

export async function handleStudentAiMessage(
  chatId: number,
  text: string | undefined,
  client: TelegramClient
): Promise<boolean> {
  if (shouldSkipForAi(text, false)) return false;

  const chatKey = String(chatId);
  if (!(await checkDailyLimit(chatKey)).ok) {
    await client.sendMessage(
      chatId,
      `⏳ Kunlik AI limiti tugadi (${getDailyLimit()} ta/kun). Ertaga /ai bilan qayting.`,
    );
    return true;
  }

  const { step, answers, meta, chat } = await loadSession(chatKey);

  if (isAiCommand(text)) {
    await incrementDailyCount(chatKey);
    await saveSession(chatKey, { step: 0, answers: {}, meta: null, chat });
    await showMainMenu(client, chatId);
    return true;
  }

  if (step >= 1 && step <= 5 && text) {
    const q = QUESTIONS[step - 1];
    const matched = matchTextToOption(text, q.options);
    if (!matched) {
      await client.sendMessage(chatId, "Pastdagi tugmalardan tanlang 👇", {
        reply_markup: questionKeyboard(q),
      });
      return true;
    }
    await incrementDailyCount(chatKey);
    const nextAnswers = { ...answers, [q.key]: matched };
    const nextStep = step + 1;
    if (nextStep <= 5) {
      await saveSession(chatKey, { step: nextStep, answers: nextAnswers });
      await sendQuestion(client, chatId, nextStep - 1);
    } else {
      await finishMatchQuiz(client, chatId, nextAnswers);
    }
    return true;
  }

  if (step >= 1 && step <= 5) {
    await sendQuestion(client, chatId, step - 1);
    return true;
  }

  if (text?.trim()) {
    await incrementDailyCount(chatKey);
    await showTyping(client, chatId);
    const { reply, chat: nextChat } = await conversationalReply(text, chat);
    await saveSession(chatKey, { chat: nextChat });
    await client.sendMessage(chatId, escHtml(reply));
    return true;
  }

  return false;
}

export async function handleStudentAiCallback(
  chatId: number,
  messageId: number,
  data: string,
  client: TelegramClient,
  answerCb: (text?: string) => Promise<unknown>
): Promise<boolean> {
  if (!data.startsWith("ai:")) return false;

  const chatKey = String(chatId);
  if (!(await checkDailyLimit(chatKey)).ok) {
    await answerCb("Limit tugadi");
    return true;
  }

  const { step, answers, meta, chat } = await loadSession(chatKey);

  if (data === "ai:mn") {
    await answerCb();
    await saveSession(chatKey, { step: 0, answers: {}, meta: null, chat });
    await showMainMenu(client, chatId, { messageId });
    return true;
  }

  if (data === "ai:m:match") {
    await answerCb();
    await incrementDailyCount(chatKey);
    await startMatchQuiz(chatKey);
    await sendQuestion(client, chatId, 0);
    return true;
  }

  if (data === "ai:b" && meta) {
    await answerCb();
    const listMeta: SessionMeta = { ...meta, view: "list" };
    await saveSession(chatKey, { meta: listMeta, chat });
    await renderResultsList(client, chatId, listMeta, "🎓 Sizga mos kurslar", { messageId });
    return true;
  }

  const pageM = data.match(/^ai:p:(\d+)$/);
  if (pageM && meta) {
    await answerCb();
    const page = parseInt(pageM[1], 10);
    const newMeta: SessionMeta = { ...meta, page, view: "list" };
    await saveSession(chatKey, { meta: newMeta, chat });
    await renderResultsList(client, chatId, newMeta, "🎓 Sizga mos kurslar", { messageId });
    return true;
  }

  const pickM = data.match(/^ai:k:(\d)$/);
  if (pickM && meta) {
    await answerCb();
    const slot = parseInt(pickM[1], 10) - 1;
    const globalIdx = meta.page * PAGE_SIZE + slot;
    if (globalIdx >= 0 && globalIdx < meta.resultIds.length) {
      await renderDetail(client, chatId, messageId, meta, globalIdx);
    }
    return true;
  }

  const qM = data.match(/^ai:(\w+):([\w]+)$/);
  if (qM && step >= 1 && step <= 5) {
    const [, key, value] = qM;
    const qIndex = QUESTIONS.findIndex(q => q.key === key);
    if (qIndex < 0 || QUESTIONS[qIndex].key !== key) {
      await answerCb();
      return true;
    }
    await answerCb("✓");
    await incrementDailyCount(chatKey);
    const nextAnswers = { ...answers, [key]: value } as AiAnswers;
    const nextStep = qIndex + 2;
    if (nextStep <= 5) {
      await saveSession(chatKey, { step: nextStep, answers: nextAnswers });
      await sendQuestion(client, chatId, nextStep - 1);
    } else {
      await finishMatchQuiz(client, chatId, nextAnswers);
    }
    return true;
  }

  await answerCb();
  return true;
}

export async function tryStudentAi(
  chatId: number,
  text: string | undefined,
  hasContact: boolean,
  client: TelegramClient
): Promise<boolean> {
  if (hasContact || shouldSkipForAi(text, hasContact)) return false;
  if (!text?.trim()) return false;
  return handleStudentAiMessage(chatId, text, client);
}
