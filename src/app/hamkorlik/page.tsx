"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function HamkorlikPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Submit success bo'lgach yuqoriga scroll — aks holda foydalanuvchi
  // pastdagi formada turib tasdiq xabarini ko'rmasdan footer'ga tushib qoladi
  useEffect(() => {
    if (status === "success") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [status]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    telegram: "",
    centerName: "",
    category: "",
    city: "",
    studentsCount: "",
    message: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhone = (value: string) => {
    const digits = value.replace(/\D/g, "").replace(/^998/, "");
    let formatted = "";
    if (digits.length > 0) formatted = digits.slice(0, 2);
    if (digits.length > 2) formatted += " " + digits.slice(2, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 9);
    updateField("phone", formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          telegram: form.telegram ? `@${form.telegram}` : null,
          centerName: form.centerName,
          category: form.category,
          city: form.city,
          studentsCount: form.studentsCount,
          message: form.message || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error ?? "Xatolik yuz berdi");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Tarmoq xatosi, qayta urining");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-[#f0f2f3] min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-[400px]">
          <div className="w-16 h-16 rounded-full bg-[#2d6a5a]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-[#2d6a5a]" />
          </div>
          <h1 className="text-[24px] md:text-[30px] font-bold text-[#16181a]">Ariza qabul qilindi!</h1>
          <p className="text-[15px] text-[#7c8490] mt-3">Tez orada siz bilan bog&apos;lanamiz. Odatda 24 soat ichida javob beramiz.</p>
          <Link href="/" className="inline-flex items-center gap-2 h-[44px] px-6 rounded-[12px] bg-[#16181a] text-white text-[14px] font-medium mt-6 hover:bg-[#16181a]/90 transition-colors">
            Asosiy sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full h-[48px] px-4 text-[16px] rounded-[12px] bg-[#f0f2f3] border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:border-[#7ea2d4] transition-colors";
  const busy = status === "submitting";

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[600px] mx-auto px-5 pt-2 pb-6 md:pt-4 md:pb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6 hover:text-[#4a7ab5] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Asosiy sahifa
        </Link>

        <div className="mb-6">
          <h1 className="text-[24px] md:text-[32px] font-bold text-[#16181a] leading-[1.2] tracking-[-0.02em]">
            Kurslaringizni DarsLinker&apos;da joylashtiring
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#7c8490] mt-2">
            O&apos;quv markazingiz yoki shaxsiy kurslaringizni platformamizda joylashtiring va yangi o&apos;quvchilar oqimiga ega bo&apos;ling.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-[#e4e7ea] p-5 md:p-7">
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">Ism-familiya *</label>
                <input type="text" required value={form.name} onChange={(e) => updateField("name", e.target.value)} disabled={busy} placeholder="To'liq ismingiz" className={inputClass} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">Telefon raqam *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#16181a] font-medium">+998</span>
                  <input type="tel" required value={form.phone} onChange={(e) => handlePhone(e.target.value)} disabled={busy} placeholder="77 123 45 67" maxLength={12} className={`${inputClass} pl-[60px]`} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">Telegram</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#16181a] font-medium">@</span>
                <input type="text" value={form.telegram} onChange={(e) => updateField("telegram", e.target.value.replace(/@/g, "").replace(/\s/g, ""))} disabled={busy} placeholder="username" className={`${inputClass} pl-[34px]`} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">O&apos;quv markaz nomi *</label>
                <input type="text" required value={form.centerName} onChange={(e) => updateField("centerName", e.target.value)} disabled={busy} placeholder="Masalan: Najot Ta'lim" className={inputClass} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">Kurs yo&apos;nalishi *</label>
                <input type="text" required value={form.category} onChange={(e) => updateField("category", e.target.value)} disabled={busy} placeholder="Masalan: IT, Dizayn" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">Shahar *</label>
                <input type="text" required value={form.city} onChange={(e) => updateField("city", e.target.value)} disabled={busy} placeholder="Toshkent" className={inputClass} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">O&apos;quvchilar soni *</label>
                <input type="text" required value={form.studentsCount} onChange={(e) => updateField("studentsCount", e.target.value)} disabled={busy} placeholder="Masalan: 80-100" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#16181a] mb-1.5">Qo&apos;shimcha xabar</label>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                disabled={busy}
                placeholder="Savollar yoki qo'shimcha ma'lumot..."
                rows={3}
                className="w-full px-4 py-3 text-[16px] rounded-[12px] bg-[#f0f2f3] border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:border-[#7ea2d4] transition-colors resize-none"
              />
            </div>
          </div>

          {errorMsg && <p className="text-[13px] text-red-600 mt-3">{errorMsg}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-[50px] rounded-[14px] bg-[#16181a] text-white text-[15px] font-semibold mt-5 flex items-center justify-center gap-2 hover:bg-[#16181a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" /> {busy ? "Yuborilmoqda..." : "Ariza yuborish"}
          </button>

          <p className="text-[12px] text-[#7c8490] text-center mt-3">
            Arizangiz 24 soat ichida ko&apos;rib chiqiladi
          </p>
        </form>
      </div>
    </div>
  );
}
