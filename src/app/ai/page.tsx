import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, MessageCircle, Target, Search } from "lucide-react";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Darslinker AI — shaxsiy kurs maslahatchi",
  description:
    "Darslinker AI sizga mos kurs topishda yordam beradi — savollar, suhbat va O'zbekistondagi haqiqiy kurslar katalogi.",
  alternates: { canonical: `${SITE_URL}/ai` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/ai`,
    siteName: "Darslinker.uz",
    title: "Darslinker AI — shaxsiy kurs maslahatchi",
    description:
      "Mos kursni topish uchun AI yordamchi — quiz, suhbat va bazadan kurslar.",
  },
};

const features = [
  {
    icon: Target,
    title: "Mos kursni topish",
    text: "5 ta qisqa savolga javob bering — AI sizga mos kurslarni tanlab beradi.",
  },
  {
    icon: Search,
    title: "Mavzu bo'yicha qidiruv",
    text: "«Ingliz tili», «Python», «boshlang'ich» deb yozing — bazadan kurslar chiqadi.",
  },
  {
    icon: MessageCircle,
    title: "Tabiiy suhbat",
    text: "Savollaringizga odamdek javob beradi va Darslinker.uz kurslariga yo'naltiradi.",
  },
];

export default function AiPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#dce6f2] bg-gradient-to-b from-[#eef4fc] to-[#f8fafc]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#7ea2d4]/40 px-4 py-1.5 text-sm text-[#2d5a8a] mb-6">
            <Sparkles className="size-4" />
            Darslinker AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#16181a] tracking-tight">
            Shaxsiy kurs maslahatchingiz
          </h1>
          <p className="mt-4 text-[#6a7585] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            O&apos;ng pastki burchakdagi AI tugmasini bosing — mini chat ochiladi. U siz bilan
            suhbatlashadi, savollar beradi va Darslinker.uz dagi haqiqiy kurslarni topib beradi.
          </p>
          <p className="mt-6 text-sm text-[#6a7585]">
            Yoki{" "}
            <Link href="/kurslar" className="text-[#2d5a8a] font-medium hover:underline">
              barcha kurslar
            </Link>{" "}
            katalogidan o&apos;zingiz tanlang.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <h2 className="text-xl font-semibold text-[#16181a] text-center mb-8">Nima qila oladi?</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#dce6f2] bg-white p-6 shadow-sm"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#eef4fc] text-[#2d5a8a] mb-4">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-[#16181a]">{title}</h3>
              <p className="mt-2 text-sm text-[#6a7585] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <AiChatWidget />
    </>
  );
}
