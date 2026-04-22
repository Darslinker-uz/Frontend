"use client";

import { useState } from "react";
import { PhoneInput, TelegramInput } from "@/components/phone-input";

type Status = "idle" | "submitting" | "success" | "error";

export function HelpForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name.trim() || !phone.trim() || !interest.trim()) {
      setError("Ism, telefon va yo'nalish majburiy");
      return;
    }
    setStatus("submitting");
    try {
      const message = telegram.trim() ? `Telegram: ${telegram.trim()}` : null;
      const res = await fetch("/api/help-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, interest, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Xatolik yuz berdi");
        setStatus("error");
        return;
      }
      setStatus("success");
      setName(""); setPhone(""); setTelegram(""); setInterest("");
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-[520px] mx-auto rounded-[16px] bg-white/90 border border-[#7ea2d4]/40 p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#7ea2d4]/20 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-[#2d5a8a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p className="text-[17px] font-bold text-[#16181a]">Ariza yuborildi!</p>
        <p className="text-[13px] text-[#6a7585] mt-1">Tez orada siz bilan bog'lanamiz</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-[13px] text-[#2d5a8a] font-medium hover:underline"
        >
          Yana ariza yuborish
        </button>
      </div>
    );
  }

  const baseInput = "w-full h-[52px] px-4 text-[16px] rounded-[12px] bg-white/80 border border-[#c5cdd8] text-[#16181a] placeholder:text-[#6a7585]/50 focus:outline-none focus:border-[#7ea2d4] transition-all";

  return (
    <div className="max-w-[520px] mx-auto space-y-3">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Ismingiz"
        className={baseInput}
        disabled={status === "submitting"}
      />
      <PhoneInput
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className={baseInput}
        disabled={status === "submitting"}
      />
      <TelegramInput
        value={telegram}
        onChange={e => setTelegram(e.target.value)}
        className={baseInput}
        disabled={status === "submitting"}
      />
      <input
        value={interest}
        onChange={e => setInterest(e.target.value)}
        placeholder="Qaysi sohaga qiziqasiz?"
        className={baseInput}
        disabled={status === "submitting"}
      />
      {error && (
        <p className="text-[13px] text-red-600 text-center">{error}</p>
      )}
      <button
        onClick={submit}
        disabled={status === "submitting"}
        className="w-full h-[52px] rounded-[12px] bg-[#2d5a8a] text-white text-[15px] font-semibold hover:bg-[#2d5a8a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Yuborilmoqda..." : "Ariza yuborish"}
      </button>
    </div>
  );
}
