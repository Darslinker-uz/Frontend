"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User as UserIcon, Building2, GraduationCap, AlertCircle, Sparkles, FileText, ArrowLeft } from "lucide-react";

type Step = "profile-type" | "details";
type ProfileType = "CENTER" | "TUTOR";

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const sessionName = (session?.user as { name?: string } | undefined)?.name ?? "";

  const [step, setStep] = useState<Step>("profile-type");
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [name, setName] = useState(sessionName);
  const [centerName, setCenterName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function pickProfileType(t: ProfileType) {
    setProfileType(t);
    setError("");
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!profileType) {
      setError("Profil turini tanlang");
      setStep("profile-type");
      return;
    }
    const nm = name.trim();
    const cn = centerName.trim();
    if (nm.length < 2) {
      setError(profileType === "TUTOR" ? "Ismingizni to'liq kiriting" : "Mas'ul shaxs ismini kiriting");
      return;
    }
    if (profileType === "CENTER" && cn.length < 2) {
      setError("O'quv markaz nomini kiriting");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nm, centerName: cn, profileType, bio: bio.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Saqlashda xatolik");
        setSubmitting(false);
        return;
      }
      await update({ onboardingCompleted: true, profileType });
      router.push("/center/home");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f3] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-[520px]">
        <div className="bg-white rounded-[20px] border border-[#e4e7ea] p-6 md:p-8">
          {/* Step 1: Profile type selection */}
          {step === "profile-type" && (
            <>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#7ea2d4] to-[#4a7ab5] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-[22px] md:text-[26px] font-bold text-[#16181a] tracking-[-0.02em]">Xush kelibsiz!</h1>
              </div>
              <p className="text-[13px] md:text-[14px] text-[#7c8490] mt-2">
                Boshlashdan oldin kim sifatida ro&apos;yxatdan o&apos;tayotganingizni tanlang.
                Bu ma&apos;lumot dashboard va public sahifalarda ko&apos;rinadi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => pickProfileType("TUTOR")}
                  className="group flex flex-col items-start gap-3 p-5 rounded-[16px] border-2 border-[#e4e7ea] hover:border-[#7ea2d4] hover:bg-[#f8fbff] text-left transition-all"
                >
                  <div className="w-12 h-12 rounded-[12px] bg-violet-50 group-hover:bg-violet-100 text-violet-700 flex items-center justify-center transition-colors">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[16px] font-bold text-[#16181a]">Repetitor</div>
                    <div className="text-[12px] text-[#7c8490] mt-1">Shaxsiy o&apos;qituvchi — individual yoki kichik guruh</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => pickProfileType("CENTER")}
                  className="group flex flex-col items-start gap-3 p-5 rounded-[16px] border-2 border-[#e4e7ea] hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all"
                >
                  <div className="w-12 h-12 rounded-[12px] bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[16px] font-bold text-[#16181a]">O&apos;quv markaz</div>
                    <div className="text-[12px] text-[#7c8490] mt-1">Tashkilot — jamoa, filiallar, ko&apos;p kurs</div>
                  </div>
                </button>
              </div>

              <p className="text-[11px] text-[#7c8490] mt-5 text-center">
                Profil turini keyinroq <span className="text-[#16181a] font-medium">admin</span> orqali o&apos;zgartirish mumkin
              </p>
            </>
          )}

          {/* Step 2: Details */}
          {step === "details" && profileType && (
            <>
              <button
                type="button"
                onClick={() => { setStep("profile-type"); setError(""); }}
                className="inline-flex items-center gap-1 text-[12px] text-[#7c8490] hover:text-[#16181a] mb-4 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Profil turini o&apos;zgartirish
              </button>

              <div className="flex items-center gap-3 mb-1">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
                  profileType === "TUTOR"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {profileType === "TUTOR" ? <GraduationCap className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <h1 className="text-[20px] md:text-[24px] font-bold text-[#16181a] tracking-[-0.02em]">
                  {profileType === "TUTOR" ? "Repetitor ma'lumotlari" : "Markaz ma'lumotlari"}
                </h1>
              </div>
              <p className="text-[13px] text-[#7c8490] mt-2">
                {profileType === "TUTOR"
                  ? "O'zingiz haqingizda qisqa ma'lumot bering — ota-onalar va o'quvchilar buni ko'radi."
                  : "Markaz haqida qisqa ma'lumot — saytda ushbu nom ostida ko'rinasiz."}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[12px] text-[#6a7585] mb-1.5 font-medium">
                    {profileType === "TUTOR" ? "Ismingiz va familiyangiz *" : "Mas'ul shaxs ismi *"}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={profileType === "TUTOR" ? "Masalan: Sarvar Nazarov" : "Masalan: Jasur Karimov"}
                      maxLength={100}
                      disabled={submitting}
                      className="w-full h-[48px] pl-10 pr-4 text-[15px] rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/40 focus:outline-none focus:border-[#7ea2d4] transition-colors"
                    />
                  </div>
                </div>

                {profileType === "CENTER" && (
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
                    <p className="text-[11px] text-[#7c8490]/80 mt-1.5">E&apos;lonlaringizda va katalogda ushbu nom ko&apos;rinadi</p>
                  </div>
                )}

                <div>
                  <label className="block text-[12px] text-[#6a7585] mb-1.5 font-medium">
                    Qisqacha tavsif <span className="text-[#7c8490]/60">(ixtiyoriy, lekin tavsiya etiladi)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-[#7c8490]" />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={profileType === "TUTOR"
                        ? "Misol: 8 yil tajribali matematika repetitori. DTM va maktab dasturlari bo'yicha individual darslar."
                        : "Misol: 2015-yildan beri faoliyat yuritamiz. IT, dizayn va marketing yo'nalishlarida zamonaviy dasturlar."}
                      maxLength={2000}
                      rows={3}
                      disabled={submitting}
                      className="w-full pl-10 pr-4 pt-3 pb-2 text-[14px] rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/40 focus:outline-none focus:border-[#7ea2d4] transition-colors resize-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#7c8490]/80 mt-1.5">Google va AI'lar siz haqingizda bilishi uchun muhim ({bio.length}/2000)</p>
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
                  {submitting ? "Saqlanmoqda..." : "Ro'yxatdan o'tishni yakunlash"}
                </button>
              </form>

              <p className="text-[11px] text-[#7c8490] mt-5 text-center">
                Bu ma&apos;lumotlarni keyin <span className="text-[#16181a] font-medium">Sozlamalar</span>da o&apos;zgartirish mumkin
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
