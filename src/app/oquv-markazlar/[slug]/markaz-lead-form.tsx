"use client";

import { useState } from "react";
import { Send, CheckCircle2, MessageSquare, User, Phone } from "lucide-react";

type Props = {
  centerName: string;
  // Real markaz uchun listingId — API'ga POST qilinadi
  // Null (fake markaz) — demo uchun simulate qilinadi
  firstListingId: number | null;
};

export function MarkazLeadForm({ centerName, firstListingId }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Ism va telefon raqamingizni kiriting");
      return;
    }
    setState("sending");

    // Real markaz: /api/leads ga POST qilamiz
    if (firstListingId) {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId: firstListingId,
            name: name.trim(),
            phone: phone.trim(),
            message: message.trim() ? `[Markaz kontakti] ${message.trim()}` : "[Markaz kontakti]",
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Yuborishda xatolik. Qaytadan urinib ko'ring.");
          setState("idle");
          return;
        }
        setState("sent");
      } catch {
        setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
        setState("idle");
      }
      return;
    }

    // Fake markaz (demo) — simulate
    await new Promise((r) => setTimeout(r, 800));
    setState("sent");
  };

  if (state === "sent") {
    return (
      <div className="bg-white border border-emerald-200 rounded-[20px] p-6 md:p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-700" />
        </div>
        <h3 className="text-[18px] md:text-[20px] font-bold text-[#16181a]">Arizangiz qabul qilindi</h3>
        <p className="text-[13px] md:text-[14px] text-[#6a7585] mt-2 max-w-[380px] mx-auto">
          <span className="font-semibold">{centerName}</span> vakili siz bilan 24 soat ichida bog&apos;lanadi.
        </p>
        <button
          type="button"
          onClick={() => {
            setName("");
            setPhone("");
            setMessage("");
            setState("idle");
          }}
          className="mt-5 text-[13px] text-emerald-700 hover:text-emerald-800 font-semibold"
        >
          Yana ariza yuborish
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6 space-y-3">
      <div>
        <label className="block text-[12px] font-semibold text-[#16181a] mb-1.5">Ismingiz</label>
        <div className="flex items-center gap-2 px-3 bg-[#f8fbfa] border border-[#e4e7ea] rounded-[12px] focus-within:border-emerald-400">
          <User className="w-4 h-4 text-[#7c8490]" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ism va familiya"
            required
            className="flex-1 bg-transparent text-[14px] text-[#16181a] py-2.5 outline-none placeholder:text-[#7c8490]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#16181a] mb-1.5">Telefon raqam</label>
        <div className="flex items-center gap-2 px-3 bg-[#f8fbfa] border border-[#e4e7ea] rounded-[12px] focus-within:border-emerald-400">
          <Phone className="w-4 h-4 text-[#7c8490]" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998 90 123 45 67"
            required
            className="flex-1 bg-transparent text-[14px] text-[#16181a] py-2.5 outline-none placeholder:text-[#7c8490]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#16181a] mb-1.5">Xabar (ixtiyoriy)</label>
        <div className="flex items-start gap-2 px-3 bg-[#f8fbfa] border border-[#e4e7ea] rounded-[12px] focus-within:border-emerald-400">
          <MessageSquare className="w-4 h-4 text-[#7c8490] mt-3" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Qaysi kurs sizni qiziqtiradi?"
            rows={3}
            className="flex-1 bg-transparent text-[14px] text-[#16181a] py-2.5 outline-none resize-none placeholder:text-[#7c8490]"
          />
        </div>
      </div>

      {error && (
        <div className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 rounded-[10px] px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-[14px] md:text-[15px] font-semibold rounded-[12px] px-5 py-3 transition-colors"
      >
        {state === "sending" ? (
          <>Yuborilmoqda...</>
        ) : (
          <>
            <Send className="w-4 h-4" /> Markazga ariza yuborish
          </>
        )}
      </button>

      <p className="text-[11.5px] text-[#7c8490] text-center">
        Ariza yuborish bilan <a href="/sharhlar" className="underline">foydalanish shartlari</a>ga rozilik bildirasiz
      </p>
    </form>
  );
}
