"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User as UserIcon, Building2, AlertCircle, Sparkles } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const sessionName = (session?.user as { name?: string } | undefined)?.name ?? "";

  const [name, setName] = useState(sessionName);
  const [centerName, setCenterName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const nm = name.trim();
    const cn = centerName.trim();
    if (nm.length < 2) { setError("Ismingizni to'liq kiriting"); return; }
    if (cn.length < 2) { setError("O'quv markaz nomini kiriting"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nm, centerName: cn }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Saqlashda xatolik");
        setSubmitting(false);
        return;
      }
      // Flip the onboarding flag in the session token so middleware stops
      // bouncing us back to /auth/welcome.
      await update({ onboardingCompleted: true });
      router.push("/center/home");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f3] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-[460px]">
        <div className="bg-white rounded-[20px] border border-[#e4e7ea] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#7ea2d4] to-[#4a7ab5] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-[#16181a] tracking-[-0.02em]">Xush kelibsiz!</h1>
          </div>
          <p className="text-[13px] text-[#7c8490] mt-2">
            Boshlashdan oldin o&apos;zingiz va o&apos;quv markazingiz haqida qisqa ma&apos;lumot bering.
            Bu ma&apos;lumotlar e&apos;lonlaringizda foydalanuvchilarga ko&apos;rinadi.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[12px] text-[#6a7585] mb-1.5 font-medium">Ismingiz *</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Jasur Karimov"
                  maxLength={100}
                  disabled={submitting}
                  className="w-full h-[48px] pl-10 pr-4 text-[15px] rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/40 focus:outline-none focus:border-[#7ea2d4] transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#7c8490]/80 mt-1.5">Telefon raqam egasi (mas&apos;ul shaxs) ismi</p>
            </div>

            <div>
              <label className="block text-[12px] text-[#6a7585] mb-1.5 font-medium">O&apos;quv markaz nomi *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                <input
                  type="text"
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  placeholder="Masalan: Najot Ta'lim"
                  maxLength={100}
                  disabled={submitting}
                  className="w-full h-[48px] pl-10 pr-4 text-[15px] rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/40 focus:outline-none focus:border-[#7ea2d4] transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#7c8490]/80 mt-1.5">E&apos;lonlaringizda ushbu nom ko&apos;rinadi</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-[12px] text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[48px] rounded-[10px] bg-[#16181a] text-white text-[14px] font-semibold hover:bg-[#26282c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saqlanmoqda..." : "Davom etish"}
            </button>
          </form>

          <p className="text-[11px] text-[#7c8490] mt-5 text-center">
            Keyin bu ma&apos;lumotlarni <span className="text-[#16181a] font-medium">Sozlamalar</span> bo&apos;limida o&apos;zgartira olasiz.
          </p>
        </div>
      </div>
    </div>
  );
}
