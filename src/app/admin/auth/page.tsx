"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";
import { Shield, Phone, Lock, AlertCircle } from "lucide-react";

export default function AdminAuthPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
    if (!password) { setError("Parolni kiriting"); return; }

    setSubmitting(true);
    try {
      const res = await signIn("admin-password", {
        phone: "+998" + digits,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Telefon yoki parol noto'g'ri");
        setSubmitting(false);
        return;
      }
      // Full navigation so new session cookie is picked up by middleware
      window.location.href = "/admin";
    } catch {
      setError("Xatolik yuz berdi, qayta urining");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8" style={{ background: "linear-gradient(135deg, #0e1015 0%, #16181a 100%)" }}>
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <DarslinkerLogo size={32} />
          <span className="text-[20px] font-extrabold tracking-tight text-white">
            Dars<span className="text-[#7ea2d4]">Linker</span>
          </span>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white text-[#16181a]">Admin</span>
        </div>

        <div className="rounded-[20px] p-6 md:p-8" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-12 h-12 rounded-[14px] bg-white/[0.08] flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white/80" />
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-[-0.02em]">Admin kirish</h1>
          <p className="text-[13px] text-white/50 mt-1.5">Faqat tizim administratorlari uchun</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[12px] text-white/60 mb-1.5 block">Telefon raqam</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[15px] text-white font-medium">+998</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => handlePhone(e.target.value)}
                  placeholder="33 888 01 33"
                  maxLength={12}
                  disabled={submitting}
                  autoComplete="username"
                  className="w-full h-[48px] pl-[70px] pr-4 text-[16px] rounded-[10px] bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] text-white/60 mb-1.5 block">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={submitting}
                  autoComplete="current-password"
                  className="w-full h-[48px] pl-10 pr-4 text-[16px] rounded-[10px] bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-[13px] text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[48px] rounded-[10px] bg-white text-[#16181a] text-[14px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Tekshirilmoqda..." : "Kirish"}
            </button>
          </form>

          <p className="text-[11px] text-white/30 text-center mt-5">
            Oddiy foydalanuvchi kirishi: <a href="/auth" className="text-[#7ea2d4] hover:underline">/auth</a>
          </p>
        </div>
      </div>
    </div>
  );
}
