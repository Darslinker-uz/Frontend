/**
 * /aikurs — salom, yordam taklifi, anketа, telefon, admin Telegram, mos kurslar.
 */

import type { ChatTurn } from "@/lib/openai";
import { createTelegramClient, escHtml, normalizePhone } from "@/lib/telegram";
import type { AiAnswers } from "@/lib/ai-shared";
import {
  browseListTitleFromIntent,
  conversationalReplyForWeb,
  isVagueCourseRequest,
  resolveBrowseIntentAsync,
  searchCoursesByIntent,
} from "@/lib/ai-shared";
import type { CourseSearchIntent } from "@/lib/ai-course-search";
import type { WebAiAction, WebAiResponse, WebAiUi } from "@/lib/web-ai";

export type AikursFlow =
  | "idle"
  | "offer"
  | "quiz"
  | "phone"
  | "results"
  | "declined";

export type AikursSessionMeta = {
  flow: AikursFlow;
  mode: "intake" | "browse";
  resultIds: number[];
  page: number;
  browseQuery?: string;
  /** 1=direction … 4=time; yosh matn bilan (step 2) */
  quizStep: number;
};

type ChatState = {
  greeted: boolean;
  history: ChatTurn[];
  pendingInquiry?: { listingId: number };
};

function appendHistory(chat: ChatState, ...turns: ChatTurn[]): ChatState {
  return { ...chat, history: [...chat.history, ...turns].slice(-20) };
}

export type AikursIntakeAnswers = AiAnswers & {
  age?: string;
  leadPhone?: string;
};

type LoadedSession = {
  step: number;
  answers: AikursIntakeAnswers;
  meta: AikursSessionMeta | null;
  chat: ChatState;
};

export type AikursSessionApi = {
  load: (key: string) => Promise<LoadedSession>;
  save: (
    key: string,
    data: {
      step?: number;
      answers?: AikursIntakeAnswers;
      meta?: AikursSessionMeta | null;
      chat?: ChatState;
    }
  ) => Promise<void>;
  bumpLimit: (key: string) => Promise<void>;
  buildCoursesUi: (meta: AikursSessionMeta, title: string) => Promise<WebAiUi>;
  ok: (sessionId: string, msgs: string[], ui?: WebAiUi) => WebAiResponse;
  fail: (sessionId: string, error: string, limit?: boolean) => WebAiResponse;
};

const DIRECTION_GROUP_SLUGS: Record<string, string[]> = {
  it: ["it"],
  marketing: ["biznes"],
  design: ["dizayn"],
  language: ["tillar"],
  business: ["biznes"],
  unknown: [],
};

const DIRECTION_LABELS: Record<string, string> = {
  it: "IT",
  marketing: "Marketing",
  design: "Dizayn",
  language: "Tillar",
  business: "Biznes",
  unknown: "Bilmayman",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Boshlovchi",
  some: "Ozgina bilaman",
  experienced: "Tajribam bor",
};

const TIME_LABELS: Record<string, string> = {
  low: "3–5 soat",
  mid: "5–10 soat",
  high: "10+ soat",
};

const QUIZ_BUTTON_STEPS = [
  {
    key: "direction" as const,
    text: "Qaysi yo'nalish sizga qiziq?",
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
    text: "Hozir bu yo'nalish bo'yicha darajangiz qanday?",
    options: [
      { id: "beginner", label: "🌱 Boshlovchi" },
      { id: "some", label: "📚 Ozgina bilaman" },
      { id: "experienced", label: "⭐ Tajribam bor" },
    ],
  },
  {
    key: "time" as const,
    text: "Haftasiga qancha vaqt ajrata olasiz?",
    options: [
      { id: "low", label: "⏱ 3–5 soat" },
      { id: "mid", label: "⏰ 5–10 soat" },
      { id: "high", label: "🔥 10+ soat" },
    ],
  },
];

export const AIKURS_QUIZ_KEYS = ["direction", "age", "level", "time"] as const;

const RE_GREETING = /^(assalomu?\s*alaykum|assalom|salom|salam|hello|hi)\b/i;
const RE_IDENTITY =
  /sen\s+kimsan|siz\s+kimsiz|kim\s+siz|vazifa|vazifang|nima\s+qilasiz|nima\s+ishlaysan|yordamch|darslinker\s+ai/i;
const RE_YES = /^(ha|haa|yes|albatta|xo['']p|xop|roziman|mayli)\b/i;
const RE_NO = /^(yo['']?q|yoq|no|kerak\s*emas|hozircha\s*emas)\b/i;

const OFFER_QUESTION = "Sizga kurs topishda Darslinker AI yordam bersinmi?";
const OFFER_UI: WebAiUi = {
  kind: "menu",
  buttons: [
    { id: "aikurs_yes", label: "✅ Ha" },
    { id: "aikurs_no", label: "❌ Yo'q" },
  ],
};

function quizUiForStep(quizStep: number): WebAiUi | undefined {
  if (quizStep === 2) return undefined;
  const idx = quizStep === 1 ? 0 : quizStep === 3 ? 1 : quizStep === 4 ? 2 : -1;
  if (idx < 0) return undefined;
  const q = QUIZ_BUTTON_STEPS[idx];
  return {
    kind: "quiz",
    step: quizStep,
    total: 4,
    question: q.text,
    options: q.options.map(o => ({ id: o.id, label: o.label })),
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

export function parseLeadPhone(text: string): string | null {
  const digits = text.replace(/\D/g, "");
  if (digits.length < 9) return null;
  if (digits.startsWith("998") && digits.length >= 12) return normalizePhone(digits);
  if (digits.length === 9) return normalizePhone(digits);
  if (digits.length >= 12) return normalizePhone(digits);
  return normalizePhone(digits);
}

function parseAge(text: string): string | null {
  const m = text.trim().match(/\b(\d{1,2})\b/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n < 5 || n > 99) return null;
  return String(n);
}

function intentFromIntake(answers: AikursIntakeAnswers): CourseSearchIntent {
  const dir = answers.direction ?? "unknown";
  const groups = DIRECTION_GROUP_SLUGS[dir] ?? [];
  const level = answers.level as CourseSearchIntent["level"] | undefined;
  return {
    query: dir === "language" ? "til" : dir === "unknown" ? "" : dir,
    subjects: [],
    categorySlugs: [],
    groupSlugs: groups,
    keywords: [],
    level,
  };
}

function resultsTitle(answers: AikursIntakeAnswers): string {
  const dir = answers.direction ?? "unknown";
  const label = DIRECTION_LABELS[dir] ?? "Kurslar";
  return `🔍 ${label} bo'yicha kurslar`;
}

export async function notifyAdminsAikursLead(params: {
  answers: AikursIntakeAnswers;
  phone: string;
  sessionKey: string;
}) {
  const { answers, phone, sessionKey } = params;
  const lines = [
    "📩 <b>Yangi /aikurs lead</b>",
    "",
    `🎯 <b>Yo'nalish:</b> ${escHtml(DIRECTION_LABELS[answers.direction ?? "unknown"] ?? "—")}`,
    `🎂 <b>Yosh:</b> ${escHtml(answers.age ?? "—")}`,
    `📊 <b>Daraja:</b> ${escHtml(LEVEL_LABELS[answers.level ?? ""] ?? answers.level ?? "—")}`,
    `⏱ <b>Vaqt:</b> ${escHtml(TIME_LABELS[answers.time ?? ""] ?? answers.time ?? "—")}`,
    "",
    `📞 <b>Telefon:</b> ${escHtml(phone)}`,
    `🆔 <b>Sessiya:</b> <code>${escHtml(sessionKey)}</code>`,
    "",
    "🔗 Manba: darslinker.uz/aikurs",
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

async function identityAwareReply(
  text: string,
  chat: ChatState
): Promise<{ reply: string; chat: ChatState }> {
  const low = text.trim().toLowerCase();
  if (RE_IDENTITY.test(low)) {
    const reply =
      "Men Darslinker.uz ning AI maslahatchisiman — sizga mos kurs topishda yordam beraman. Platformadagi kurslarni tanlab, savollaringizga javob beraman.";
    return {
      reply,
      chat: appendHistory(chat, { role: "user", content: text }, { role: "assistant", content: reply }),
    };
  }
  return conversationalReplyForWeb(text, chat);
}

function shouldPromptOffer(text: string, meta: AikursSessionMeta | null): boolean {
  if (!meta || meta.flow === "idle") return true;
  if (meta.flow === "declined") return false;
  return false;
}

async function showCoursesFromIntake(
  sessionId: string,
  key: string,
  answers: AikursIntakeAnswers,
  api: AikursSessionApi,
  chat: ChatState
): Promise<WebAiResponse> {
  const intent = intentFromIntake(answers);
  const ids = await searchCoursesByIntent(intent);
  const title = resultsTitle(answers);
  const resultMeta: AikursSessionMeta = {
    flow: "results",
    mode: "intake",
    resultIds: ids,
    page: 0,
    quizStep: 0,
  };
  await api.save(key, {
    step: 10,
    answers,
    meta: resultMeta,
    chat: appendHistory(chat, { role: "assistant", content: title }),
  });
  const ui = await api.buildCoursesUi(resultMeta, title);
  return api.ok(
    sessionId,
    ids.length
      ? ["Rahmat! Tanlagan yo'nalishingiz bo'yicha mos kurslar chapda.", "Batafsil uchun kartani bosing."]
      : ["Hozircha shu yo'nalishda kurs topilmadi. Boshqa yo'nalishni yozib ko'ring."],
    ui
  );
}

export async function handleAikursAction(
  sessionId: string,
  key: string,
  action: WebAiAction,
  api: AikursSessionApi
): Promise<WebAiResponse> {
  const { answers, meta, chat } = await api.load(key);
  const flow = meta?.flow ?? "idle";

  if (action.type === "init") {
    const intro =
      "Assalomu alaykum! Men Darslinker AI — sizga mos kurs topishda yordam beraman. Savolingizni yozing (masalan: salom, kurs kerak, sen kimsan).";
    const nextChat = {
      ...chat,
      greeted: true,
      history: [...chat.history, { role: "assistant" as const, content: intro }],
    };
    await api.save(key, {
      step: 0,
      answers: {},
      meta: { flow: "idle", mode: "intake", resultIds: [], page: 0, quizStep: 0 },
      chat: nextChat,
    });
    return api.ok(sessionId, [intro]);
  }

  if (action.type === "aikurs_consent") {
    await api.bumpLimit(key);
    if (action.consent) {
      const nextMeta: AikursSessionMeta = {
        flow: "quiz",
        mode: "intake",
        resultIds: [],
        page: 0,
        quizStep: 1,
      };
      await api.save(key, { step: 1, answers: {}, meta: nextMeta, chat });
      const q = QUIZ_BUTTON_STEPS[0];
      return api.ok(sessionId, ["Zo'r! Bir nechta qisqa savolga javob bering.", q.text], quizUiForStep(1));
    }
    const declinedMeta: AikursSessionMeta = {
      flow: "declined",
      mode: "intake",
      resultIds: [],
      page: 0,
      quizStep: 0,
    };
    await api.save(key, { meta: declinedMeta, chat });
    return api.ok(
      sessionId,
      ["Mayli. Qanday yordam bera olaman? Yo'nalish yoki savolingizni yozing."],
      { kind: "menu", buttons: [] }
    );
  }

  if (action.type === "quiz_answer" && flow === "quiz" && meta) {
    await api.bumpLimit(key);
    const step = meta.quizStep;
    const nextAnswers = { ...answers, [action.key]: action.value } as AikursIntakeAnswers;

    if (action.key === "direction" && step === 1) {
      const nextMeta = { ...meta, quizStep: 2 };
      await api.save(key, { step: 2, answers: nextAnswers, meta: nextMeta, chat });
      return api.ok(sessionId, ["Yoshingiz nechada? (masalan: 22)"]);
    }
    if (action.key === "level" && step === 3) {
      const nextMeta = { ...meta, quizStep: 4 };
      await api.save(key, { step: 4, answers: nextAnswers, meta: nextMeta, chat });
      const q = QUIZ_BUTTON_STEPS[2];
      return api.ok(sessionId, [q.text], quizUiForStep(4));
    }
    if (action.key === "time" && step === 4) {
      const phoneMeta: AikursSessionMeta = { ...meta, flow: "phone", quizStep: 0 };
      await api.save(key, { step: 5, answers: nextAnswers, meta: phoneMeta, chat });
      return api.ok(sessionId, [
        "Telefon raqamingizni yozib qoldiring — biz sizga aloqaga chiqamiz.",
        "Masalan: +998901234567 yoki 901234567",
      ]);
    }
    return api.fail(sessionId, "Noto'g'ri bosqich");
  }

  if (action.type === "courses_page" && meta?.flow === "results") {
    const totalPages = Math.max(1, Math.ceil(meta.resultIds.length / 5));
    const page = Math.max(0, Math.min(action.page, totalPages - 1));
    const newMeta = { ...meta, page };
    await api.save(key, { meta: newMeta });
    const title =
      meta.mode === "browse" && meta.browseQuery
        ? browseListTitleFromIntent({ query: meta.browseQuery, subjects: [], categorySlugs: [], groupSlugs: [], keywords: [] })
        : resultsTitle(answers);
    const ui = await api.buildCoursesUi(newMeta, title);
    return api.ok(sessionId, [], ui);
  }

  if (action.type === "message") {
    await api.bumpLimit(key);
    const text = action.text.trim();
    if (!text) return api.fail(sessionId, "Xabar bo'sh");

    if (flow === "phone") {
      const phone = parseLeadPhone(text);
      if (!phone) {
        return api.fail(sessionId, "Telefon noto'g'ri. Masalan: +998901234567 yoki 901234567");
      }
      const nextAnswers = { ...answers, leadPhone: phone };
      await notifyAdminsAikursLead({ answers: nextAnswers, phone, sessionKey: key });
      const nextChat = appendHistory(
        chat,
        { role: "user", content: text },
        { role: "assistant", content: "✅ Rahmat! Tez orada bog'lanamiz." }
      );
      await api.save(key, { answers: nextAnswers, chat: nextChat });
      return showCoursesFromIntake(sessionId, key, nextAnswers, api, nextChat);
    }

    if (flow === "quiz" && meta?.quizStep === 2) {
      const age = parseAge(text);
      if (!age) {
        return api.fail(sessionId, "Yoshni raqam bilan yozing (masalan: 18 yoki 25)");
      }
      const nextAnswers = { ...answers, age };
      const nextMeta = { ...meta, quizStep: 3 };
      const nextChat = appendHistory(
        chat,
        { role: "user", content: text },
        { role: "assistant", content: QUIZ_BUTTON_STEPS[1].text }
      );
      await api.save(key, { step: 3, answers: nextAnswers, meta: nextMeta, chat: nextChat });
      return api.ok(sessionId, [QUIZ_BUTTON_STEPS[1].text], quizUiForStep(3));
    }

    if (flow === "offer") {
      if (RE_YES.test(text)) {
        return handleAikursAction(sessionId, key, { type: "aikurs_consent", consent: true }, api);
      }
      if (RE_NO.test(text)) {
        return handleAikursAction(sessionId, key, { type: "aikurs_consent", consent: false }, api);
      }
    }

    if (flow === "idle" || flow === "offer" || flow === "declined") {
      const browseEarly = await resolveBrowseIntentAsync(text, chat.history);
      if (browseEarly !== null && (flow === "idle" || flow === "declined")) {
        const ids = await searchCoursesByIntent(browseEarly);
        const title = browseListTitleFromIntent(browseEarly);
        const resultMeta: AikursSessionMeta = {
          flow: "results",
          mode: "browse",
          resultIds: ids,
          page: 0,
          browseQuery: browseEarly.query,
          quizStep: 0,
        };
        const hist = appendHistory(
          chat,
          { role: "user", content: text },
          { role: "assistant", content: title }
        );
        await api.save(key, { meta: resultMeta, chat: hist });
        const ui = await api.buildCoursesUi(resultMeta, title);
        return api.ok(sessionId, ids.length ? [title, "Pastdagi raqamlarni bosing:"] : ["Mos kurs topilmadi."], ui);
      }
    }

    if (flow === "results" || flow === "declined") {
      const browse = await resolveBrowseIntentAsync(text, chat.history);
      if (browse !== null) {
        const ids = await searchCoursesByIntent(browse);
        const title = browseListTitleFromIntent(browse);
        const resultMeta: AikursSessionMeta = {
          flow: "results",
          mode: "browse",
          resultIds: ids,
          page: 0,
          browseQuery: browse.query,
          quizStep: 0,
        };
        const hist = appendHistory(
          chat,
          { role: "user", content: text },
          { role: "assistant", content: title }
        );
        await api.save(key, { meta: resultMeta, chat: hist });
        const ui = await api.buildCoursesUi(resultMeta, title);
        return api.ok(sessionId, ids.length ? [title] : ["Mos kurs topilmadi."], ui);
      }
    }

    const { reply, chat: nextChat } = await identityAwareReply(text, chat);
    const needOffer =
      shouldPromptOffer(text, meta) &&
      (RE_GREETING.test(text) || RE_IDENTITY.test(text) || isVagueCourseRequest(text));

    if (needOffer && flow !== "quiz") {
      const offerMeta: AikursSessionMeta = {
        flow: "offer",
        mode: "intake",
        resultIds: [],
        page: 0,
        quizStep: 0,
      };
      const hist = appendHistory(nextChat, { role: "assistant", content: OFFER_QUESTION });
      await api.save(key, { meta: offerMeta, chat: hist });
      return api.ok(sessionId, [reply, OFFER_QUESTION], OFFER_UI);
    }

    await api.save(key, { chat: nextChat });
    return api.ok(sessionId, [reply]);
  }

  if (action.type === "course_open" && meta?.flow === "results") {
    return api.fail(sessionId, "Kursni chap paneldan oching");
  }

  return api.fail(sessionId, "Noma'lum amal");
}
