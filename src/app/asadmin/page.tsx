"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";
import { UserCog, Phone, Lock, AlertCircle } from "lucide-react";

// Assistant login sahifasi — super admin yordamchilari uchun.
// Telefon + parol kodda hardcoded (src/lib/assistants.ts).

export default function AsadminPage() {
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
      const res = await signIn("assistant-password", {
        phone: "+998" + digits,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Telefon yoki parol noto'g'ri");
        setSubmitting(false);
        return;
      }
      window.location.href = "/admode/home";
    } catch {
      setError("Xatolik yuz berdi, qayta urining");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8" style={{ background: "linear-gradient(135deg, #1a1d24 0%, #2a2f3a 100%)" }}>
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <DarslinkerLogo size={32} />
          <span className="text-[20px] font-extrabold tracking-tight text-white">
            Dars<span className="text-[#7ea2d4]">Linker</span>
          </span>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#7ea2d4] text-white">Yordamchi</span>
        </div>

        <div className="rounded-[20px] p-6 md:p-7" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#7ea2d4]/20 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-[#7ea2d4]" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-white">Yordamchi panel</h1>
              <p className="text-[12px] text-white/50">Super admin yordamchisi uchun kirish</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] text-white/60 mb-1.5 block">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[15px] text-white/60">+998</span>
                <input
                  value={phone}
                  onChange={(e) => handlePhone(e.target.value)}
                  placeholder="90 123 45 67"
                  className="w-full h-[44px] pl-[78px] pr-4 rounded-[10px] text-[15px] focus:outline-none"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white" }}
                  inputMode="numeric"
                  autoComplete="tel"
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
                  placeholder="Parolni kiriting"
                  className="w-full h-[44px] pl-10 pr-4 rounded-[10px] text-[15px] focus:outline-none"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white" }}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-[10px]" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[44px] rounded-[10px] bg-[#7ea2d4] hover:bg-[#5b87c0] text-white text-[14px] font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <p className="text-[11px] text-white/40 mt-5 text-center">
            Yordamchi akkountini super admin yaratadi.
          </p>
        </div>
      </div>
    </div>
  );
}
