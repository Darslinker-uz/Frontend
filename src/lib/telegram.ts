// Minimal Telegram Bot API client for darslinker.uz

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : "";

if (!TOKEN && process.env.NODE_ENV !== "test") {
  console.warn("TELEGRAM_BOT_TOKEN is not set — bot calls will fail silently");
}

export interface TgUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TgChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  first_name?: string;
  last_name?: string;
  username?: string;
  title?: string;
}

export interface TgContact {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
}

export interface TgMessage {
  message_id: number;
  from?: TgUser;
  chat: TgChat;
  date: number;
  text?: string;
  contact?: TgContact;
}

export interface TgCallbackQuery {
  id: string;
  from: TgUser;
  message?: TgMessage;
  data?: string;
}

export interface TgUpdate {
  update_id: number;
  message?: TgMessage;
  callback_query?: TgCallbackQuery;
}

type Keyboard = {
  inline_keyboard?: { text: string; callback_data?: string; url?: string }[][];
  keyboard?: { text: string; request_contact?: boolean }[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  remove_keyboard?: boolean;
};

async function call<T>(method: string, body: Record<string, unknown>): Promise<T | null> {
  if (!TOKEN) return null;
  try {
    const res = await fetch(`${BASE}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error(`Telegram ${method} failed:`, data.description);
      return null;
    }
    return data.result as T;
  } catch (e) {
    console.error(`Telegram ${method} error:`, e);
    return null;
  }
}

export function sendMessage(
  chatId: number | string,
  text: string,
  opts?: {
    reply_markup?: Keyboard;
    parse_mode?: "HTML" | "MarkdownV2";
    disable_web_page_preview?: boolean;
  },
) {
  return call<TgMessage>("sendMessage", {
    chat_id: chatId,
    text,
    ...opts,
  });
}

export function answerCallbackQuery(id: string, text?: string) {
  return call("answerCallbackQuery", { callback_query_id: id, text });
}

export function editMessageText(
  chatId: number | string,
  messageId: number,
  text: string,
  opts?: {
    reply_markup?: Keyboard;
    parse_mode?: "HTML" | "MarkdownV2";
    disable_web_page_preview?: boolean;
  },
) {
  return call("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...opts,
  });
}

export function editMessageReplyMarkup(
  chatId: number | string,
  messageId: number,
  replyMarkup?: Keyboard,
) {
  return call("editMessageReplyMarkup", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: replyMarkup,
  });
}

export function getUpdates(offset?: number, timeout = 25) {
  return call<TgUpdate[]>("getUpdates", { offset, timeout, allowed_updates: ["message", "callback_query"] });
}

export function setWebhook(url: string, secretToken?: string) {
  return call("setWebhook", { url, secret_token: secretToken, allowed_updates: ["message", "callback_query"] });
}

export function deleteWebhook() {
  return call("deleteWebhook", { drop_pending_updates: true });
}

// Escape helper for HTML parse mode
export function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Normalize a phone number to digits only (drops +, spaces, dashes)
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  // Ensure starts with 998 for UZ
  if (digits.startsWith("998")) return "+" + digits;
  if (digits.length === 9) return "+998" + digits;
  return "+" + digits;
}
