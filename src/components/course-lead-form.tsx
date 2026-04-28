"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2 } from "lucide-react";
import { PhoneInput, TelegramInput } from "@/components/phone-input";

type Status = "idle" | "submitting" | "success" | "error" | "duplicate";

export function CourseLeadForm({ listingId }: { listingId: number }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Ism va telefon majburiy");
      return;
    }
    setStatus("submitting");
    try {
      const message = telegram.trim() ? `Telegram: ${telegram.trim()}` : null;
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, name, phone, message }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setStatus("duplicate");
        return;
      }
      if (res.status === 503) {
        // Bot xabari yuborilmadi — qayta urinish kerak (idle holatga qaytariladi)
        setError(data?.error ?? "Bot xabari yuborilmadi. Qayta urining.");
        setStatus("idle");
        return;
      }
      if (!res.ok) {
        setError(data?.error ?? "Xatolik yuz berdi");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setStatus("error");
    }
  };

  if (status === "success" || status === "duplicate") {
    return (
      <div className="rounded-[14px] p-5 text-center" style={{ backgroundColor: "#22c55e14", border: "1px solid #22c55e33" }}>
        <div className="w-11 h-11 mx-auto rounded-full bg-[#22c55e]/15 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-[15px] font-bold text-[#16181a]">
          {status === "success" ? "Ariza qabul qilindi!" : "Siz allaqachon ariza bergansiz"}
        </p>
        <p className="text-[12px] text-[#7c8490] mt-1">
          {status === "success" ? "Markaz tez orada siz bilan bog'lanadi" : "Tez orada javob olasiz"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="lead-name" className="text-[12px] text-[#7c8490] mb-1.5">Ismingiz</Label>
        <Input
          id="lead-name"
          placeholder="Ismingiz"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={status === "submitting"}
          className="rounded-[10px] h-11 border-[#e4e7ea] text-[16px]"
        />
      </div>
      <div>
        <Label htmlFor="lead-phone" className="text-[12px] text-[#7c8490] mb-1.5">Telefon</Label>
        <PhoneInput
          value={phone}
          onChange={e => setPhone(e.target.value)}
          disabled={status === "submitting"}
          className="w-full h-11 px-4 text-[16px] rounded-[10px] border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:border-[#7ea2d4] transition-colors"
        />
      </div>
      <div>
        <Label htmlFor="lead-tg" className="text-[12px] text-[#7c8490] mb-1.5">Telegram (ixtiyoriy)</Label>
        <TelegramInput
          value={telegram}
          onChange={e => setTelegram(e.target.value)}
          disabled={status === "submitting"}
          className="w-full h-11 px-4 text-[16px] rounded-[10px] border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:border-[#7ea2d4] transition-colors"
        />
      </div>
      {error && <p className="text-[13px] text-red-600">{error}</p>}
      <Button
        onClick={submit}
        disabled={status === "submitting"}
        className="w-full h-12 rounded-[12px] bg-[#16181a] text-white text-[15px] font-medium hover:bg-[#16181a]/80 border-0 flex items-center gap-2 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Yuborilmoqda..." : "Ariza yuborish"}
      </Button>
    </div>
  );
}
