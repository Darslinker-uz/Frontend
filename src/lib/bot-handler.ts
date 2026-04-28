import { prisma } from "@/lib/prisma";
import {
  sendMessage,
  answerCallbackQuery,
  editMessageText,
  normalizePhone,
  escHtml,
  createTelegramClient,
  type TgUpdate,
  type TelegramClient,
} from "@/lib/telegram";
import type { LeadStatus, Role } from "@/generated/prisma";

// ==================== HANDLER ====================
// Shared update processor — used by both webhook and polling.
// `mode` selects which bot the update came from:
//   "provider" — @Darslinker_cbot, full CRM (lead callbacks, group ID, etc.)
//   "student"  — @darslinkerbot, login-code only (used for rating + future student panel)

export type BotMode = "provider" | "student";

const CODE_TTL_MINUTES = 5;

function generateCode(): string {
  // 6-digit numeric code
  return String(Math.floor(100000 + Math.random() * 900000));
}

let _studentClient: TelegramClient | null = null;
function getClient(mode: BotMode): TelegramClient {
  if (mode === "student") {
    if (!_studentClient) {
      _studentClient = createTelegramClient(process.env.TELEGRAM_STUDENT_BOT_TOKEN);
    }
    return _studentClient;
  }
  // provider — reuse the default exported client (bound to TELEGRAM_BOT_TOKEN)
  return {
    sendMessage,
    answerCallbackQuery,
    editMessageText,
    editMessageReplyMarkup: () => Promise.resolve(null),
    getUpdates: () => Promise.resolve(null),
    setWebhook: () => Promise.resolve(null),
    deleteWebhook: () => Promise.resolve(null),
  };
}

export async function handleUpdate(update: TgUpdate, mode: BotMode = "provider"): Promise<void> {
  try {
    const client = getClient(mode);
    if (update.message) {
      await handleMessage(update.message, mode, client);
    } else if (update.callback_query && mode === "provider") {
      // Lead callbacks (Bog'landim) only exist in the provider bot.
      await handleCallback(update.callback_query);
    }
  } catch (e) {
    console.error(`[bot:${mode}] handleUpdate error:`, e);
  }
}

async function handleMessage(msg: NonNullable<TgUpdate["message"]>, mode: BotMode, client: TelegramClient) {
  const chatId = msg.chat.id;
  const role: Role = mode === "student" ? "student" : "provider";

  // /groupid — for guruh orqali admin ID olish (provider bot only)
  if (mode === "provider" && (msg.text === "/groupid" || msg.text === "/groupid@Darslinker_cbot")) {
    const info = msg.chat.type === "private"
      ? `Bu shaxsiy chat.\nChat ID: <code>${chatId}</code>`
      : `Guruh turi: ${msg.chat.type}\n` +
        `Guruh nomi: ${escHtml(msg.chat.title ?? "—")}\n` +
        `Guruh ID: <code>${chatId}</code>\n\n` +
        `Ushbu ID'ni <code>.env</code>'ga qo'shing:\n<code>TELEGRAM_ADMIN_GROUP_ID=${chatId}</code>`;
    await client.sendMessage(chatId, info, { parse_mode: "HTML", disable_web_page_preview: true });
    return;
  }

  // /start
  if (msg.text === "/start") {
    const greeting = mode === "student"
      ? "👋 <b>Darslinker'ga xush kelibsiz!</b>\n\nKurslarni baholash va o'quvchi paneliga kirish uchun telefon raqamingizni ulashing."
      : "👋 <b>Darslinker CRM</b>'ga xush kelibsiz!\n\nRo'yxatdan o'tish yoki saytga kirish uchun telefon raqamingizni ulashing.";
    await client.sendMessage(chatId, greeting, {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [[{ text: "📱 Telefonni ulashish", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return;
  }

  // Contact share
  if (msg.contact) {
    const phone = normalizePhone(msg.contact.phone_number);
    const name = [msg.contact.first_name, msg.contact.last_name].filter(Boolean).join(" ") || "Foydalanuvchi";

    // Upsert user — role depends on which bot the message came from.
    // If the same phone is already in DB with a different role, keep the existing role
    // (someone could rate as a student first then become a provider, or vice versa —
    // we don't auto-flip roles here; admin can change manually).
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { telegramChatId: String(chatId), lastActiveAt: new Date() },
      });
    } else {
      await prisma.user.create({
        data: {
          name,
          phone,
          passwordHash: "", // bot-only for now
          role,
          telegramChatId: String(chatId),
          // Onboarding only meaningful for providers (welcome page asks for centerName)
          onboardingCompleted: role === "provider" ? false : true,
        },
      });
    }

    // Generate login code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);
    // Invalidate previous unused codes for this phone
    await prisma.authCode.updateMany({
      where: { phone, usedAt: null },
      data: { usedAt: new Date() },
    });
    await prisma.authCode.create({
      data: { phone, code, chatId: String(chatId), expiresAt },
    });

    const loginUrl = mode === "student" ? "darslinker.uz/student" : "darslinker.uz/center";
    await client.sendMessage(chatId,
      `✅ Telefon qabul qilindi!\n\n` +
      `Saytga kirish uchun kod:\n\n` +
      `<code>${code}</code>\n\n` +
      `Kod ${CODE_TTL_MINUTES} daqiqa davomida amal qiladi.\n` +
      `Bu kodni <b>${loginUrl}</b> sahifasiga kiriting.`,
      {
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true },
        disable_web_page_preview: true,
      },
    );
    return;
  }

  // /help
  if (msg.text === "/help") {
    await client.sendMessage(chatId,
      "ℹ️ <b>Yordam</b>\n\n" +
      "/start — Ro'yxatdan o'tish\n" +
      "/code — Yangi kod so'rash (agar avval ro'yxatdan o'tgan bo'lsangiz)",
      { parse_mode: "HTML" },
    );
    return;
  }

  // /code — re-request code for existing user
  if (msg.text === "/code") {
    const user = await prisma.user.findFirst({
      where: { telegramChatId: String(chatId) },
    });
    if (!user) {
      await client.sendMessage(chatId,
        "❌ Siz hali ro'yxatdan o'tmagansiz. /start bosing.",
      );
      return;
    }
    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);
    await prisma.authCode.updateMany({
      where: { phone: user.phone, usedAt: null },
      data: { usedAt: new Date() },
    });
    await prisma.authCode.create({
      data: { phone: user.phone, code, chatId: String(chatId), expiresAt },
    });
    await client.sendMessage(chatId,
      `🔑 Yangi kod:\n\n<code>${code}</code>\n\n` +
      `${CODE_TTL_MINUTES} daqiqa amal qiladi.`,
      { parse_mode: "HTML", disable_web_page_preview: true },
    );
    return;
  }

  // Pending note for contacted lead — user is typing a note after pressing Bog'landim
  // (provider bot only — student bot doesn't manage leads)
  if (mode === "provider" && msg.text && !msg.text.startsWith("/")) {
    const pending = await prisma.botPendingAction.findUnique({
      where: { chatId: String(chatId) },
    });
    if (pending && pending.action === "note_for_contacted") {
      const lead = await prisma.lead.findUnique({
        where: { id: pending.leadId },
        include: { listing: { include: { user: { select: { telegramChatId: true } } } } },
      });
      if (lead && lead.listing.user.telegramChatId === String(chatId)) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { note: msg.text.trim() },
        });
        await prisma.botPendingAction.delete({ where: { chatId: String(chatId) } });

        const text = await renderLeadMessage(lead.id);
        if (text) {
          await editMessageText(chatId, pending.messageId, text, {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: undefined,
          });
        }
        await client.sendMessage(chatId, "✓ Izoh saqlandi");
        return;
      }
    }
  }

  // Unknown message
  await client.sendMessage(chatId,
    "Tushunmadim 🤔 /start yoki /help bosing.",
  );
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new_lead: "Yangi",
  contacted: "Bog'landim",
  callback: "Qayta aloqa",
  converted: "Sotib oldi",
  not_interested: "Sotib olmadi",
  disputed: "Sifatsiz",
};

const STATUS_ICONS: Record<LeadStatus, string> = {
  new_lead: "🆕",
  contacted: "✅",
  callback: "📞",
  converted: "💰",
  not_interested: "🚫",
  disputed: "❌",
};

// Rebuild the full lead card message from current DB state
async function renderLeadMessage(leadId: number): Promise<string | null> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { listing: { select: { title: true } } },
  });
  if (!lead) return null;

  let telegram: string | null = null;
  let msgRest: string | null = null;
  if (lead.message) {
    const tgMatch = lead.message.match(/Telegram:\s*@?(\w+)/i);
    if (tgMatch) {
      telegram = "@" + tgMatch[1];
      msgRest = lead.message.replace(/Telegram:\s*@?\w+/i, "").trim() || null;
    } else {
      msgRest = lead.message;
    }
  }

  const formatted = lead.createdAt.toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const lines = [
    "🎯 <b>Yangi ariza!</b>",
    "",
    `📚 <b>Kurs:</b> ${escHtml(lead.listing.title)}`,
    "",
    `👤 <b>Ism:</b> ${escHtml(lead.name)}`,
    `📞 <b>Telefon:</b> ${escHtml(lead.phone)}`,
  ];
  if (telegram) lines.push(`✈️ <b>Telegram:</b> ${escHtml(telegram)}`);
  lines.push(`🕐 <b>Vaqt:</b> ${escHtml(formatted)}`);
  if (msgRest) lines.push("", `💬 <b>Xabar:</b> ${escHtml(msgRest)}`);

  if (lead.status !== "new_lead") {
    lines.push("", `${STATUS_ICONS[lead.status]} <b>Holat:</b> ${STATUS_LABELS[lead.status]}`);
  }
  if (lead.note) {
    lines.push(`📝 <b>Izoh:</b> ${escHtml(lead.note)}`);
  }

  return lines.join("\n");
}

async function handleCallback(q: NonNullable<TgUpdate["callback_query"]>) {
  const data = q.data ?? "";
  if (!q.message) { await answerCallbackQuery(q.id); return; }

  const chatId = q.message.chat.id;
  const messageId = q.message.message_id;

  const m = data.match(/^lead:(\d+):(contacted|skip_note)$/);
  if (!m) { await answerCallbackQuery(q.id); return; }
  const leadId = Number(m[1]);
  const action = m[2];

  // Ownership check
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { listing: { include: { user: { select: { telegramChatId: true } } } } },
  });
  if (!lead || lead.listing.user.telegramChatId !== String(chatId)) {
    await answerCallbackQuery(q.id, "Ruxsat yo'q");
    return;
  }

  // Skip note → just clear pending action and render final message without keyboard
  if (action === "skip_note") {
    await prisma.botPendingAction.deleteMany({ where: { chatId: String(chatId) } });
    const text = await renderLeadMessage(leadId);
    if (text) await editMessageText(chatId, messageId, text, {
      parse_mode: "HTML", disable_web_page_preview: true,
      reply_markup: undefined,
    });
    await answerCallbackQuery(q.id, "Izohsiz saqlandi");
    return;
  }

  // Guard: only transition from new_lead. If status already changed from CRM,
  // just re-sync the message so outdated buttons disappear.
  if (lead.status !== "new_lead") {
    await answerCallbackQuery(q.id, "Holat allaqachon yangilangan");
    const fresh = await prisma.lead.findUnique({ where: { id: leadId } });
    const text = await renderLeadMessage(leadId);
    if (text && fresh) await editMessageText(chatId, messageId, text, {
      parse_mode: "HTML", disable_web_page_preview: true,
      reply_markup: keyboardForLead(leadId, fresh.status, !!fresh.note),
    });
    return;
  }

  // Normal flow: set contacted, ask for optional note
  await prisma.lead.update({ where: { id: leadId }, data: { status: "contacted" } });
  await prisma.botPendingAction.upsert({
    where: { chatId: String(chatId) },
    create: { chatId: String(chatId), leadId, action: "note_for_contacted", messageId },
    update: { leadId, action: "note_for_contacted", messageId },
  });

  const base = await renderLeadMessage(leadId);
  const text = `${base}\n\n📝 <i>Qo'shimcha izoh yozmoqchimisiz? Shu yerga matn yozib yuboring yoki "Izohsiz" bosing.</i>`;
  await editMessageText(chatId, messageId, text, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: "⏭ Izohsiz", callback_data: `lead:${leadId}:skip_note` }]],
    },
  });
  await answerCallbackQuery(q.id, "✅ Bog'landim");
}

// Public: send a new-lead notification to a teacher's Telegram chat
export async function notifyNewLead(params: {
  leadId: number;
  teacherChatId: string;
  studentName: string;
  studentPhone: string;
  course: string;
  message?: string | null;
  createdAt?: Date;
}) {
  // Extract optional "Telegram: ..." line from message for a clean display
  let telegram: string | null = null;
  let rest: string | null = null;
  if (params.message) {
    const tgMatch = params.message.match(/Telegram:\s*@?(\w+)/i);
    if (tgMatch) {
      telegram = "@" + tgMatch[1];
      rest = params.message.replace(/Telegram:\s*@?\w+/i, "").trim() || null;
    } else {
      rest = params.message;
    }
  }

  // Format time in Tashkent timezone (UTC+5)
  const d = params.createdAt ?? new Date();
  const formatted = d.toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines = [
    "🎯 <b>Yangi ariza!</b>",
    "",
    `📚 <b>Kurs:</b> ${escHtml(params.course)}`,
    "",
    `👤 <b>Ism:</b> ${escHtml(params.studentName)}`,
    `📞 <b>Telefon:</b> ${escHtml(params.studentPhone)}`,
  ];
  if (telegram) {
    lines.push(`✈️ <b>Telegram:</b> ${escHtml(telegram)}`);
  }
  lines.push(`🕐 <b>Vaqt:</b> ${escHtml(formatted)}`);
  if (rest) {
    lines.push("", `💬 <b>Izoh:</b> ${escHtml(rest)}`);
  }
  lines.push("", "Batafsil: darslinker.uz/center/leads");
  const sent = await sendMessage(params.teacherChatId, lines.join("\n"), {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: keyboardForLead(params.leadId, "new_lead", false),
  });

  // Persist bot chat/message id so we can later edit this message
  // when the teacher updates the lead status via the web CRM.
  if (sent?.message_id) {
    await prisma.lead.update({
      where: { id: params.leadId },
      data: {
        botChatId: String(params.teacherChatId),
        botMessageId: sent.message_id,
      },
    }).catch(e => console.error("[lead] persist bot msg failed", e));
  }
}

// Sync the bot message for a lead after CRM status/note change
export async function syncLeadBotMessage(leadId: number) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || !lead.botChatId || !lead.botMessageId) return;
  const text = await renderLeadMessage(leadId);
  if (!text) return;
  await editMessageText(lead.botChatId, lead.botMessageId, text, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: keyboardForLead(leadId, lead.status, !!lead.note),
  });
}

// Keyboard: only show "Bog'landim" for new leads. Teacher manages the rest from CRM.
function keyboardForLead(leadId: number, status: LeadStatus, _hasNote: boolean) {
  void _hasNote;
  if (status === "new_lead") {
    return {
      inline_keyboard: [
        [{ text: "✅ Bog'landim", callback_data: `lead:${leadId}:contacted` }],
      ],
    };
  }
  return undefined;
}

function formatTashkent(d: Date) {
  return d.toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Send lead notification to the admin monitoring group (if configured)
export async function notifyAdminGroup(params: {
  centerName: string;
  course: string;
  studentName: string;
  studentPhone: string;
  message?: string | null;
  createdAt?: Date;
}) {
  const groupId = process.env.TELEGRAM_ADMIN_GROUP_ID;
  if (!groupId) return;

  let telegram: string | null = null;
  let rest: string | null = null;
  if (params.message) {
    const tgMatch = params.message.match(/Telegram:\s*@?(\w+)/i);
    if (tgMatch) {
      telegram = "@" + tgMatch[1];
      rest = params.message.replace(/Telegram:\s*@?\w+/i, "").trim() || null;
    } else {
      rest = params.message;
    }
  }

  const d = params.createdAt ?? new Date();
  const formatted = d.toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines = [
    "📥 <b>Yangi lead</b>",
    "",
    `🏫 <b>Markaz:</b> ${escHtml(params.centerName)}`,
    `📚 <b>Kurs:</b> ${escHtml(params.course)}`,
    "",
    `👤 <b>Ism:</b> ${escHtml(params.studentName)}`,
    `📞 <b>Telefon:</b> ${escHtml(params.studentPhone)}`,
  ];
  if (telegram) lines.push(`✈️ <b>Telegram:</b> ${escHtml(telegram)}`);
  lines.push(`🕐 <b>Vaqt:</b> ${escHtml(formatted)}`);
  if (rest) lines.push("", `💬 <b>Izoh:</b> ${escHtml(rest)}`);
  lines.push("", "Panel: darslinker.uz/admode/leads");

  await sendMessage(groupId, lines.join("\n"), {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

async function notifySuperAdmin(text: string) {
  const chatId = process.env.TELEGRAM_SUPER_ADMIN_CHAT_ID;
  if (!chatId) return;
  await sendMessage(chatId, text, { parse_mode: "HTML", disable_web_page_preview: true });
}

// Homepage "Yordam kerakmi?" form submission
export async function notifyHelpLead(params: {
  name: string;
  phone: string;
  interest: string;
  message?: string | null;
  createdAt?: Date;
}) {
  const lines = [
    "💬 <b>Yangi yordam so'rovi</b>",
    "",
    `👤 <b>Ism:</b> ${escHtml(params.name)}`,
    `📞 <b>Telefon:</b> ${escHtml(params.phone)}`,
    `🎯 <b>Yo'nalish:</b> ${escHtml(params.interest)}`,
    `🕐 <b>Vaqt:</b> ${escHtml(formatTashkent(params.createdAt ?? new Date()))}`,
  ];
  if (params.message) lines.push("", `📝 <b>Xabar:</b> ${escHtml(params.message)}`);
  lines.push("", "Panel: darslinker.uz/admode/leads?tab=yordam");
  await notifySuperAdmin(lines.join("\n"));
}

// Partnership form submission
export async function notifyPartnerApplication(params: {
  name: string;
  phone: string;
  telegram?: string | null;
  centerName: string;
  category: string;
  city: string;
  studentsCount: string;
  message?: string | null;
  createdAt?: Date;
}) {
  const lines = [
    "🤝 <b>Yangi hamkorlik arizasi</b>",
    "",
    `🏫 <b>Markaz:</b> ${escHtml(params.centerName)}`,
    `🗺 <b>Shahar:</b> ${escHtml(params.city)}`,
    `📚 <b>Yo'nalish:</b> ${escHtml(params.category)}`,
    `👥 <b>O'quvchilar:</b> ${escHtml(params.studentsCount)}`,
    "",
    `👤 <b>Ism:</b> ${escHtml(params.name)}`,
    `📞 <b>Telefon:</b> ${escHtml(params.phone)}`,
  ];
  if (params.telegram) lines.push(`✈️ <b>Telegram:</b> ${escHtml(params.telegram)}`);
  lines.push(`🕐 <b>Vaqt:</b> ${escHtml(formatTashkent(params.createdAt ?? new Date()))}`);
  if (params.message) lines.push("", `📝 <b>Xabar:</b> ${escHtml(params.message)}`);
  lines.push("", "Panel: darslinker.uz/admode/leads?tab=hamkorlik");
  await notifySuperAdmin(lines.join("\n"));
}

// Teacher's listing approved by admin
export async function notifyListingApproved(params: {
  teacherChatId: string;
  title: string;
  listingSlug: string;
  categorySlug: string;
}) {
  const text = [
    "✅ <b>E'loningiz tasdiqlandi!</b>",
    "",
    `📚 <b>${escHtml(params.title)}</b>`,
    "",
    "E'loningiz endi saytda barcha o'quvchilarga ko'rinadi.",
    "",
    `Ko'rish: darslinker.uz/kurslar/${params.categorySlug}/${params.listingSlug}`,
  ].join("\n");
  await sendMessage(params.teacherChatId, text, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

// Teacher's listing rejected by admin
export async function notifyListingRejected(params: {
  teacherChatId: string;
  title: string;
  reason: string;
}) {
  const text = [
    "❌ <b>E'loningiz rad etildi</b>",
    "",
    `📚 <b>${escHtml(params.title)}</b>`,
    "",
    `<b>Sabab:</b>`,
    escHtml(params.reason),
    "",
    "Kamchiliklarni tuzatib, e'lonni qaytadan yuboring.",
    "",
    "Panel: darslinker.uz/center/listings",
  ].join("\n");
  await sendMessage(params.teacherChatId, text, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

// Teacher created a new listing — needs moderation
export async function notifyListingPending(params: {
  title: string;
  centerName: string;
  category: string;
  price: number;
  listingId: number;
  createdAt?: Date;
}) {
  const priceText = params.price === 0 ? "Bepul" : new Intl.NumberFormat("uz-UZ").format(params.price) + " so'm";
  const lines = [
    "📝 <b>Yangi e'lon moderatsiyaga tushdi</b>",
    "",
    `📚 <b>Kurs:</b> ${escHtml(params.title)}`,
    `🏫 <b>Markaz:</b> ${escHtml(params.centerName)}`,
    `🏷 <b>Kategoriya:</b> ${escHtml(params.category)}`,
    `💰 <b>Narx:</b> ${escHtml(priceText)}`,
    `🕐 <b>Vaqt:</b> ${escHtml(formatTashkent(params.createdAt ?? new Date()))}`,
    "",
    `Ko'rish: darslinker.uz/admode/listings/${params.listingId}/edit`,
  ];
  await notifySuperAdmin(lines.join("\n"));
}

// Teacher purchased a new boost — admin must review
export async function notifyBoostPending(params: {
  boostId: number;
  listingTitle: string;
  centerName: string;
  type: "a_class" | "b_class";
  daysTotal: number;
  totalPaid: number;
  createdAt?: Date;
}) {
  const typeLabel = params.type === "a_class" ? "A-class" : "B-class";
  const lines = [
    "🚀 <b>Yangi boost so'rovi</b>",
    "",
    `📚 <b>Kurs:</b> ${escHtml(params.listingTitle)}`,
    `🏫 <b>Markaz:</b> ${escHtml(params.centerName)}`,
    `⭐️ <b>Tur:</b> ${typeLabel}`,
    `📅 <b>Davomiylik:</b> ${params.daysTotal} kun`,
    `💰 <b>Summa:</b> ${new Intl.NumberFormat("uz-UZ").format(params.totalPaid)} so'm`,
    `🕐 <b>Vaqt:</b> ${escHtml(formatTashkent(params.createdAt ?? new Date()))}`,
    "",
    `Ko'rish: darslinker.uz/admode/boosts`,
  ];
  await notifySuperAdmin(lines.join("\n"));
}

// Teacher's boost approved
export async function notifyBoostApproved(params: {
  teacherChatId: string;
  listingTitle: string;
  type: "a_class" | "b_class";
  daysTotal: number;
}) {
  const typeLabel = params.type === "a_class" ? "A-class" : "B-class";
  const text = [
    "✅ <b>Boost tasdiqlandi!</b>",
    "",
    `📚 <b>${escHtml(params.listingTitle)}</b>`,
    `⭐️ ${typeLabel} · ${params.daysTotal} kun`,
    "",
    "E'loningiz endi ko'tarilgan holatda ko'rinadi.",
  ].join("\n");
  await sendMessage(params.teacherChatId, text, { parse_mode: "HTML", disable_web_page_preview: true });
}

// Admin topped up user's balance
export async function notifyBalanceTopup(params: {
  teacherChatId: string;
  amount: number;
  newBalance: number;
  note?: string;
}) {
  const fmt = new Intl.NumberFormat("uz-UZ");
  const lines = [
    "💰 <b>Balansingiz to'ldirildi</b>",
    "",
    `<b>Qo'shildi:</b> ${fmt.format(params.amount)} so'm`,
    `<b>Yangi balans:</b> ${fmt.format(params.newBalance)} so'm`,
  ];
  if (params.note) {
    lines.push("", `<i>Izoh:</i> ${escHtml(params.note)}`);
  }
  await sendMessage(params.teacherChatId, lines.join("\n"), { parse_mode: "HTML", disable_web_page_preview: true });
}

// Teacher's boost rejected — balance refunded
export async function notifyBoostRejected(params: {
  teacherChatId: string;
  listingTitle: string;
  type: "a_class" | "b_class";
  refundAmount: number;
  reason: string;
}) {
  const typeLabel = params.type === "a_class" ? "A-class" : "B-class";
  const text = [
    "❌ <b>Boost rad etildi</b>",
    "",
    `📚 <b>${escHtml(params.listingTitle)}</b>`,
    `⭐️ ${typeLabel}`,
    "",
    `<b>Sabab:</b> ${escHtml(params.reason)}`,
    "",
    `💰 Balansingizga qaytarildi: <b>${new Intl.NumberFormat("uz-UZ").format(params.refundAmount)} so'm</b>`,
  ].join("\n");
  await sendMessage(params.teacherChatId, text, { parse_mode: "HTML", disable_web_page_preview: true });
}
