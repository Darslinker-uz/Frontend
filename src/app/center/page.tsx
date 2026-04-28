import { BotLoginForm } from "@/components/bot-login-form";

export const metadata = { title: "O'quv markaz kirish" };

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "Darslinker_cbot";

export default function CenterAuthPage() {
  return (
    <BotLoginForm
      title="O'quv markaz kirish"
      subtitle="O'quv markaz egalari va o'qituvchilar uchun"
      botUsername={BOT_USERNAME}
      expectedRole="provider"
      successPath="/center/home"
      altLabel="O'quvchimisiz?"
      altHref="/student"
    />
  );
}
