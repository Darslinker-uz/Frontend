"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, ExternalLink, Phone, KeyRound, AlertCircle } from "lucide-react";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "Darslinker_cbot";

export default function AuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handlePhone(value: string) {
    const digits = value.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
    let formatted = "";
    if (digits.length > 0) formatted = digits.slice(0, 2);
    if (digits.length > 2) formatted += " " + digits.slice(2, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 9);
    setPhone(formatted);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) { setError("Telefon raqamni to'liq kiriting"); return; }
    if (!/^\d{6}$/.test(code)) { setError("6 xonali kod kiriting"); return; }

    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        phone: "+998" + digits,
        code,
        redirect: false,
      });
      if (res?.error) {
        setError("Kod noto'g'ri yoki muddati tugagan");
        setSubmitting(false);
        return;
      }
      // Success — redirect to dashboard; admin role handled server-side
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Xatolik yuz berdi, qayta urining");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f3] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-[440px]">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6 hover:text-[#4a7ab5] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Asosiy sahifa
        </Link>

        <div className="bg-white rounded-[20px] border border-[#e4e7ea] p-6 md:p-8">
          <h1 className="text-[22px] md:text-[26px] font-bold text-[#16181a] tracking-[-0.02em]">Kirish</h1>
          <p className="text-[13px] text-[#7c8490] mt-1.5">Telegram bot orqali tezkor kirish</p>

          {/* Step 1: Open bot */}
          <div className="mt-6 rounded-[14px] bg-[#eaf1fb] border border-[#7ea2d4]/30 p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#7ea2d4] text-white flex items-center justify-center text-[13px] font-bold shrink-0">1</div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#16181a]">Botni oching</p>
                <p className="text-[12px] text-[#6a7585] mt-0.5 mb-3">
                  Botga telefon raqamingizni ulashing — bot sizga 6-xonali kod yuboradi.
                </p>
                <a
                  href={`https://t.me/${BOT_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-[#2AABEE] text-white text-[13px] font-semibold hover:bg-[#2197d3] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> @{BOT_USERNAME}
                </a>
              </div>
            </div>
          </div>

          {/* Step 2: Enter phone + code */}
          <form onSubmit={handleSubmit} className="mt-4 rounded-[14px] bg-[#f0f2f3] p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#16181a] text-white flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">2</div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#16181a] mb-3">Telefon va kodni kiriting</p>

                <label className="block text-[12px] text-[#6a7585] mb-1.5">Telefon raqam</label>
                <div className="relative mb-3">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[15px] text-[#16181a] font-medium">+998</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => handlePhone(e.target.value)}
                    placeholder="77 123 45 67"
                    maxLength={12}
                    disabled={submitting}
                    className="w-full h-[48px] pl-[70px] pr-4 text-[16px] rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/40 focus:outline-none focus:border-[#7ea2d4] transition-colors"
                  />
                </div>

                <label className="block text-[12px] text-[#6a7585] mb-1.5">Bot yuborgan 6-xonali kod</label>
                <div className="relative mb-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    disabled={submitting}
                    className="w-full h-[48px] pl-10 pr-4 text-[18px] tracking-[6px] text-center font-bold rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/30 focus:outline-none focus:border-[#7ea2d4] transition-colors"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 mt-2 text-[12px] text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[48px] mt-3 rounded-[10px] bg-[#16181a] text-white text-[14px] font-semibold hover:bg-[#16181a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Tekshirilmoqda..." : "Kirish"}
                </button>
              </div>
            </div>
          </form>

          <p className="text-[11px] text-[#7c8490] text-center mt-5">
            Muammo bormi? Botga <code className="bg-[#f0f2f3] px-1.5 py-0.5 rounded">/code</code> yozib yangi kod so&apos;rang.
          </p>
        </div>
      </div>
    </div>
  );
}
