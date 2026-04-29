// Minimal Telegram Bot API client for darslinker.uz
// Supports multiple bots — the default exports use TELEGRAM_BOT_TOKEN (provider bot @Darslinker_cbot).
// For the student bot use `createTelegramClient(process.env.TELEGRAM_STUDENT_BOT_TOKEN!)`.

const DEFAULT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!DEFAULT_TOKEN && process.env.NODE_ENV !== "test") {
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

export interface TelegramClient {
  sendMessage: (chatId: number | string, text: string, opts?: { reply_markup?: Keyboard; parse_mode?: "HTML" | "MarkdownV2"; disable_web_page_preview?: boolean }) => Promise<TgMessage | null>;
  answerCallbackQuery: (id: string, text?: string) => Promise<unknown>;
  editMessageText: (chatId: number | string, messageId: number, text: string, opts?: { reply_markup?: Keyboard; parse_mode?: "HTML" | "MarkdownV2"; disable_web_page_preview?: boolean }) => Promise<unknown>;
  editMessageReplyMarkup: (chatId: number | string, messageId: number, replyMarkup?: Keyboard) => Promise<unknown>;
  getUpdates: (offset?: number, timeout?: number) => Promise<TgUpdate[] | null>;
  setWebhook: (url: string, secretToken?: string) => Promise<unknown>;
  deleteWebhook: () => Promise<unknown>;
}

export function createTelegramClient(token: string | undefined): TelegramClient {
  const BASE = token ? `https://api.telegram.org/bot${token}` : "";

  // 3 ta urinish (kichik backoff bilan) — birinchi marta cold-start yoki transient
  // network bilan bog'liq xato bo'lsa, keyingi urinishlar muvaffaqiyatli bo'ladi.
  // getUpdates long-poll: Telegram `timeout` soniya kutadi — abort muddati shundan uzun bo'lishi kerak.
  async function call<T>(
    method: string,
    body: Record<string, unknown>,
    retries = 3,
    requestTimeoutMs = 10_000
  ): Promise<T | null> {
    if (!token) return null;
    let lastError: unknown = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
        const res = await fetch(`${BASE}/${method}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await res.json();
        if (!data.ok) {
          // Telegram API'ning aniq xatosi (masalan, chat_id noto'g'ri) — qayta urinish foydasiz
          console.error(`Telegram ${method} failed (attempt ${attempt}):`, data.description);
          if (data.error_code && (data.error_code === 400 || data.error_code === 403)) {
            return null;
          }
          lastError = new Error(data.description || `HTTP ${res.status}`);
        } else {
          return data.result as T;
        }
      } catch (e) {
        lastError = e;
        console.error(`Telegram ${method} error (attempt ${attempt}/${retries}):`, e);
      }
      // Backoff: 200ms, 600ms
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 300));
      }
    }
    if (lastError) {
      console.error(`Telegram ${method} all ${retries} attempts failed:`, lastError);
    }
    return null;
  }

  return {
    sendMessage: (chatId, text, opts) =>
      call<TgMessage>("sendMessage", { chat_id: chatId, text, ...opts }),
    answerCallbackQuery: (id, text) =>
      call("answerCallbackQuery", { callback_query_id: id, text }),
    editMessageText: (chatId, messageId, text, opts) =>
      call("editMessageText", { chat_id: chatId, message_id: messageId, text, ...opts }),
    editMessageReplyMarkup: (chatId, messageId, replyMarkup) =>
      call("editMessageReplyMarkup", { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }),
    getUpdates: (offset, pollTimeoutSec = 25) => {
      const requestMs = Math.max(45_000, (pollTimeoutSec + 20) * 1000);
      return call<TgUpdate[]>(
        "getUpdates",
        { offset, timeout: pollTimeoutSec, allowed_updates: ["message", "callback_query"] },
        3,
        requestMs
      );
    },
    setWebhook: (url, secretToken) =>
      call("setWebhook", { url, secret_token: secretToken, allowed_updates: ["message", "callback_query"] }),
    deleteWebhook: () => call("deleteWebhook", { drop_pending_updates: true }),
  };
}

// Default client = provider bot (@Darslinker_cbot). Pre-existing imports continue working.
const defaultClient = createTelegramClient(DEFAULT_TOKEN);

export const sendMessage = defaultClient.sendMessage;
export const answerCallbackQuery = defaultClient.answerCallbackQuery;
export const editMessageText = defaultClient.editMessageText;
export const editMessageReplyMarkup = defaultClient.editMessageReplyMarkup;
export const getUpdates = defaultClient.getUpdates;
export const setWebhook = defaultClient.setWebhook;
export const deleteWebhook = defaultClient.deleteWebhook;

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
