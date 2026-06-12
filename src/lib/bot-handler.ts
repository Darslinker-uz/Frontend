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
import { handleStudentAiCallback, tryCompleteInquiryFromContact, tryStudentAi } from "@/lib/student-ai";

// ==================== HANDLER ====================
// Shared update processor — used by both webhook and polling.
// `mode` selects which bot the update came from:
//   "provider" — @Darslinker_cbot, full CRM (lead callbacks, group ID, etc.)
//   "student"  — @darslinkerbot, login-code + Darslinker AI kurs maslahatchi

export type BotMode = "provider" | "student";

const CODE_TTL_MINUTES = 5;

function generateCode(): string {
  // 6-digit numeric code
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Guruh bog'lash uchun bir martalik token (16 belgi, URL-safe)
function generateGroupLinkToken(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 16; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME ?? "Darslinker_cbot";

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
    sendChatAction: () => Promise.resolve(false),
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
    } else if (update.callback_query) {
      if (mode === "student") {
        const q = update.callback_query;
        if (q.message && q.data?.startsWith("ai:")) {
          await handleStudentAiCallback(
            q.message.chat.id,
            q.message.message_id,
            q.data,
            client,
            (t) => client.answerCallbackQuery(q.id, t),
          );
        } else {
          await client.answerCallbackQuery(q.id);
        }
      } else {
        await handleCallback(update.callback_query);
      }
    }
  } catch (e) {
    console.error(`[bot:${mode}] handleUpdate error:`, e);
  }
}

async function handleMessage(msg: NonNullable<TgUpdate["message"]>, mode: BotMode, client: TelegramClient) {
  const chatId = msg.chat.id;
  const role: Role = mode === "student" ? "student" : "provider";
  const isGroupChat = msg.chat.type === "group" || msg.chat.type === "supergroup";

  // ==================== GURUH CHAT'DA — LINK FLOW + SILENT BY DEFAULT ====================
  // Provider bot guruhda har qanday xabarga "Tushunmadim" javob bermasligi kerak.
  // Faqat 3 ta aniq komandaga javob beradi: /start link_<token>, /unlinkgroup, /groupid
  // Boshqa hech qanday xabarga (matn, foto, sticker, kontakt — har qanday turdagi) javob yo'q.
  if (mode === "provider" && isGroupChat) {
    if (!msg.text) {
      return; // Matn emas (foto, sticker, kontakt va h.k.) — sukut saqlab return
    }
    const linkMatch = msg.text.match(/^\/start(?:@\w+)?\s+link_([a-z0-9]{16})$/i);
    if (linkMatch) {
      const token = linkMatch[1].toLowerCase();
      const user = await prisma.user.findUnique({ where: { groupLinkToken: token } });
      if (!user) {
        await client.sendMessage(chatId,
          "❌ Bog'lash tokeni topilmadi yoki muddati o'tgan.\n\n" +
          "Iltimos, dashboard'dan yangi token oling va qaytadan urinib ko'ring.",
          { parse_mode: "HTML" },
        );
        return;
      }
      // Bog'laymiz: groupChatId saqlaymiz, token'ni tozalaymiz (bir martalik)
      await prisma.user.update({
        where: { id: user.id },
        data: { groupChatId: String(chatId), groupLinkToken: null },
      });
      const groupTitle = msg.chat.title ?? "guruh";
      const displayName = user.centerName ?? user.name;
      await client.sendMessage(chatId,
        `✅ <b>Bog'landi!</b>\n\n` +
        `<b>${escHtml(displayName)}</b> uchun yangi arizalar endi shu guruhga keladi.\n\n` +
        `Bog'lashni bekor qilish: /unlinkgroup`,
        { parse_mode: "HTML" },
      );
      // User'ning shaxsiy chatiga ham xabar
      if (user.telegramChatId) {
        await client.sendMessage(user.telegramChatId,
          `✅ <b>Guruh bog'landi:</b> ${escHtml(groupTitle)}\n\n` +
          `Endi sizning barcha lid'laringiz shu guruhga yuboriladi (shaxsiy chatga emas).\n\n` +
          `Bog'lashni bekor qilish uchun /unlinkgroup buyrug'ini guruhda yoki bu yerda yuboring.`,
          { parse_mode: "HTML" },
        );
      }
      return;
    }

    // /unlinkgroup — guruhda ham ishlaydi
    if (msg.text === "/unlinkgroup" || msg.text === `/unlinkgroup@${BOT_USERNAME}`) {
      const user = await prisma.user.findFirst({ where: { groupChatId: String(chatId) } });
      if (!user) {
        await client.sendMessage(chatId, "Bu guruh hech qaysi markazga bog'lanmagan.", { parse_mode: "HTML" });
        return;
      }
      await prisma.user.update({ where: { id: user.id }, data: { groupChatId: null } });
      await client.sendMessage(chatId, "✅ Bog'lash bekor qilindi. Endi lid'lar yana shaxsiy chatga keladi.", { parse_mode: "HTML" });
      if (user.telegramChatId) {
        await client.sendMessage(user.telegramChatId, "ℹ️ Guruh bog'lashi bekor qilindi. Lid'lar yana sizning shaxsiy chatingizga keladi.", { parse_mode: "HTML" });
      }
      return;
    }

    // /groupid — guruh ID olish (debug uchun)
    if (msg.text === "/groupid" || msg.text === `/groupid@${BOT_USERNAME}`) {
      const info = `Guruh turi: ${msg.chat.type}\n` +
        `Guruh nomi: ${escHtml(msg.chat.title ?? "—")}\n` +
        `Guruh ID: <code>${chatId}</code>`;
      await client.sendMessage(chatId, info, { parse_mode: "HTML" });
      return;
    }

    // Guruh ichida boshqa hech qaysi xabarga javob bermaymiz (no "tushunmadim").
    // Callback button'lar (Bog'landim, Sotib oldi va h.k.) handleCallback orqali ishlaydi.
    return;
  }

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
      ? "👋 <b>Darslinker'ga xush kelibsiz!</b>\n\nKurslarni baholash va panelga kirish uchun telefon raqamingizni ulashing.\n\n🤖 AI bilan suhbat — shunchaki yozing. Kurs tanlash tugmalari: /ai"
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

  // Kurs bo'yicha qo'shimcha ma'lumot — telefon (login dan oldin)
  if (mode === "student" && msg.contact) {
    if (await tryCompleteInquiryFromContact(chatId, msg.contact, msg.from, client)) {
      return;
    }
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
    const providerExtra = mode === "provider"
      ? `\n\n👥 Jamoa bo'lib ishlaysizmi? /guruh — lid'lar shaxsiy chat o'rniga guruhingizga keladi.`
      : "";
    await client.sendMessage(chatId,
      `✅ Telefon qabul qilindi!\n\n` +
      `Saytga kirish uchun kod:\n\n` +
      `<code>${code}</code>\n\n` +
      `Kod ${CODE_TTL_MINUTES} daqiqa davomida amal qiladi.\n` +
      `Bu kodni <b>${loginUrl}</b> sahifasiga kiriting.${providerExtra}`,
      {
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true },
        disable_web_page_preview: true,
      },
    );
    return;
  }

  // /help
  if (msg.text === "/help" || msg.text?.startsWith("/help@")) {
    const helpStudent =
      "ℹ️ <b>Yordam</b>\n\n" +
      "/start — Ro'yxatdan o'tish\n" +
      "/code — Yangi kod so'rash\n" +
      "/ai — mos kursni topish\n\n" +
      "Shunchaki xabar yozing — AI samimiy javob beradi.";
    const helpProvider =
      "ℹ️ <b>Yordam</b>\n\n" +
      "/start — Ro'yxatdan o'tish\n" +
      "/code — Yangi kod so'rash\n" +
      "/guruh — Jamoa guruhini bog'lash (lid'lar guruhga keladi)\n" +
      "/unlinkgroup — Guruh bog'lashini bekor qilish";
    await client.sendMessage(chatId, mode === "student" ? helpStudent : helpProvider, {
      parse_mode: "HTML",
    });
    return;
  }

  // /guruh — provider uchun guruhga qo'shish flow (shaxsiy chatda)
  if (mode === "provider" && (msg.text === "/guruh" || msg.text === "/guruh@Darslinker_cbot" || msg.text === "/linkgroup")) {
    const user = await prisma.user.findFirst({ where: { telegramChatId: String(chatId) } });
    if (!user) {
      await client.sendMessage(chatId, "❌ Avval /start bosing va ro'yxatdan o'ting.");
      return;
    }
    // Agar allaqachon guruh bog'langan bo'lsa — eslatma
    if (user.groupChatId) {
      await client.sendMessage(chatId,
        `ℹ️ Sizning lid'laringiz allaqachon guruhga yuborilmoqda.\n\n` +
        `Bog'lashni bekor qilish: /unlinkgroup\n` +
        `Yangi guruhga o'tish: avval /unlinkgroup, keyin qaytadan /guruh`,
        { parse_mode: "HTML" },
      );
      return;
    }
    // Token generatsiya — eski bo'lsa qayta yoziladi
    const token = generateGroupLinkToken();
    await prisma.user.update({ where: { id: user.id }, data: { groupLinkToken: token } });
    const url = `https://t.me/${BOT_USERNAME}?startgroup=link_${token}`;
    await client.sendMessage(chatId,
      `👥 <b>Jamoa guruhiga bog'lash</b>\n\n` +
      `Quyidagi tugmani bosing va botni o'z guruhingizga qo'shing.\n\n` +
      `Botni qo'shgach, men sizga "Bog'landi" deb javob beraman va kelajakdagi lid'lar shaxsiy chat o'rniga shu guruhga keladi.\n\n` +
      `⚠️ Botga guruhda <b>admin</b> huquqi berilishi tavsiya etiladi.`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[
            { text: "📲 Guruhga qo'shish", url },
          ]],
        },
      },
    );
    return;
  }

  // /unlinkgroup — shaxsiy chatdan ham
  if (mode === "provider" && (msg.text === "/unlinkgroup" || msg.text === `/unlinkgroup@${BOT_USERNAME}`)) {
    const user = await prisma.user.findFirst({ where: { telegramChatId: String(chatId) } });
    if (!user) {
      await client.sendMessage(chatId, "❌ Avval /start bosing.");
      return;
    }
    if (!user.groupChatId) {
      await client.sendMessage(chatId, "Sizda bog'langan guruh yo'q.");
      return;
    }
    const oldGroup = user.groupChatId;
    await prisma.user.update({ where: { id: user.id }, data: { groupChatId: null } });
    await client.sendMessage(chatId, "✅ Guruh bog'lashi bekor qilindi. Endi lid'lar yana shaxsiy chatingizga keladi.");
    // Guruhga ham xabar
    await client.sendMessage(oldGroup, "ℹ️ Markaz egasi guruh bog'lashini bekor qildi. Lid'lar endi shu guruhga kelmaydi.").catch(() => null);
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

  // @darslinkerbot — Darslinker AI (har qanday matn yoki /ai)
  if (mode === "student") {
    const handled = await tryStudentAi(chatId, msg.text, !!msg.contact, client, msg.from);
    if (handled) return;
  }

  // Unknown message (provider bot)
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

  // Ownership check — chat ID provider'ning shaxsiy chati YOKI bog'langan guruh chat'i bo'lishi mumkin.
  // Bu strict isolation: faqat lid egasining chat'idan (shaxsiy yoki guruh) callback qabul qilamiz.
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { listing: { include: { user: { select: { telegramChatId: true, groupChatId: true } } } } },
  });
  const owner = lead?.listing.user;
  const isOwner = owner && (owner.telegramChatId === String(chatId) || owner.groupChatId === String(chatId));
  if (!lead || !isOwner) {
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

  // Normal flow: set contacted
  await prisma.lead.update({ where: { id: leadId }, data: { status: "contacted" } });

  // Guruh chat'da izoh kutilmaydi (kim yozsa ham aniq emas) — to'g'ridan-to'g'ri yopiladi.
  const isGroup = q.message.chat.type === "group" || q.message.chat.type === "supergroup";
  if (isGroup) {
    const text = await renderLeadMessage(leadId);
    if (text) await editMessageText(chatId, messageId, text, {
      parse_mode: "HTML", disable_web_page_preview: true,
      reply_markup: undefined,
    });
    await answerCallbackQuery(q.id, "✅ Bog'landim");
    return;
  }

  // Shaxsiy chat: izoh kutiladi
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

  // Caller'ga muvaffaqiyat yoki xato sifatida qaytariladi
  return Boolean(sent?.message_id);
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
  listingType?: "COURSE" | "TUTOR_SERVICE";
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

  const isTutor = params.listingType === "TUTOR_SERVICE";
  const providerLabel = isTutor ? "Repetitor" : "Markaz";
  const providerIcon = isTutor ? "👨‍🏫" : "🏫";
  const subjectLabel = isTutor ? "Xizmat" : "Kurs";
  const lines = [
    "📥 <b>Yangi lead</b>",
    "",
    `${providerIcon} <b>${providerLabel}:</b> ${escHtml(params.centerName)}`,
    `📚 <b>${subjectLabel}:</b> ${escHtml(params.course)}`,
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
