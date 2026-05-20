// Minimal OpenAI Chat Completions client (Darslinker AI)

const API_URL = "https://api.openai.com/v1/chat/completions";

export function getOpenAiConfig() {
  const apiKey = process.env.GPT_KEY || process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  return { apiKey, model };
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function chatCompletion(params: {
  system: string;
  user?: string;
  history?: ChatTurn[];
  maxTokens?: number;
  temperature?: number;
}): Promise<string | null> {
  const { apiKey, model } = getOpenAiConfig();
  if (!apiKey) {
    console.warn("[openai] GPT_KEY yo'q — AI matn generatsiyasi o'tkaziladi");
    return null;
  }

  const messages: { role: string; content: string }[] = [
    { role: "system", content: params.system },
  ];
  if (params.history?.length) {
    for (const t of params.history) {
      messages.push({ role: t.role, content: t.content });
    }
  }
  if (params.user) {
    messages.push({ role: "user", content: params.user });
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: params.temperature ?? 0.5,
        max_tokens: params.maxTokens ?? 400,
        messages,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[openai] API xato:", data?.error?.message ?? res.status);
      return null;
    }
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch (e) {
    console.error("[openai] so'rov xato:", e);
    return null;
  }
}
