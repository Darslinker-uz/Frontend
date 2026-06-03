import type { Metadata } from "next";
import { GptOziChat } from "@/components/gptozi/gptozi-chat";

export const metadata: Metadata = {
  title: "GPT ozi",
  description: "To'g'ridan-to'g'ri OpenAI chat (promptsiz)",
  robots: { index: false, follow: false },
};

export default function GptOziPage() {
  return <GptOziChat />;
}
