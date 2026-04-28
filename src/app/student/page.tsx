import { BotLoginForm } from "@/components/bot-login-form";

export const metadata = { title: "O'quvchi kirish" };

const STUDENT_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_STUDENT_BOT_USERNAME || "darslinkerbot";

export default function StudentAuthPage() {
  return (
    <BotLoginForm
      title="O'quvchi kirish"
      subtitle="Reyting qoldirish va kelajakdagi o'quvchi paneli uchun"
      botUsername={STUDENT_BOT_USERNAME}
      expectedRole="student"
      successPath="/"
      altLabel="O'quv markazsiz?"
      altHref="/center"
    />
  );
}
