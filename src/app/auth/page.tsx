"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Phone, Lock, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotFound(false);

    if (!phone || phone.length < 9) {
      setError("Telefon raqamni kiriting");
      return;
    }
    if (!password) {
      setError("Parolni kiriting");
      return;
    }

    // TODO: API ga so'rov yuborish
    // Hozircha demo: bazada yo'q deb ko'rsatamiz
    setNotFound(true);
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-8">
          <ArrowLeft className="w-4 h-4" /> Bosh sahifa
        </Link>

        {!notFound ? (
          /* KIRISH FORMASI */
          <div className="bg-white rounded-[20px] border border-[#e4e7ea] p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-[16px] bg-[#7ea2d4]/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-[#7ea2d4]" />
              </div>
              <h1 className="text-[22px] font-bold text-[#16181a]">Kirish</h1>
              <p className="text-[14px] text-[#7c8490] mt-1">Dashboard ga kirish uchun ma&apos;lumotlaringizni kiriting</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[13px] text-[#7c8490] mb-1.5 block">Telefon raqam</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full h-[48px] pl-10 pr-4 rounded-[12px] border border-[#e4e7ea] text-[16px] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:ring-2 focus:ring-[#7ea2d4]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#7c8490] mb-1.5 block">Parol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingiz"
                    className="w-full h-[48px] pl-10 pr-4 rounded-[12px] border border-[#e4e7ea] text-[16px] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:ring-2 focus:ring-[#7ea2d4]/30 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-[13px] text-red-500">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button type="submit" className="w-full h-[48px] rounded-[14px] bg-[#16181a] text-white text-[15px] font-medium hover:bg-[#16181a]/80 transition-colors">
                Kirish
              </button>
            </form>

            <p className="text-[13px] text-[#7c8490] text-center mt-5">
              Hisobingiz yo&apos;qmi?{" "}
              <a href="https://t.me/darslinker_bot" target="_blank" rel="noopener noreferrer" className="text-[#7ea2d4] font-medium">
                Telegram orqali ro&apos;yxatdan o&apos;ting
              </a>
            </p>
          </div>
        ) : (
          /* RO'YXATDAN O'TISH — Telegram botga yo'naltirish */
          <div className="bg-white rounded-[20px] border border-[#e4e7ea] p-8 text-center">
            <div className="w-14 h-14 rounded-[16px] bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>

            <h2 className="text-[20px] font-bold text-[#16181a]">Hisob topilmadi</h2>
            <p className="text-[14px] text-[#7c8490] mt-2">
              <span className="font-medium text-[#16181a]">{phone}</span> raqami bazada topilmadi. Avval Telegram bot orqali ro&apos;yxatdan o&apos;ting.
            </p>

            <a
              href="https://t.me/darslinker_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full h-[48px] rounded-[14px] bg-[#16181a] text-white text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-[#16181a]/80 transition-colors"
            >
              <Send className="w-4 h-4" />
              Telegram bot orqali ro&apos;yxatdan o&apos;tish
            </a>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-left">
                <span className="w-6 h-6 rounded-full bg-[#f0f2f3] flex items-center justify-center shrink-0 text-[12px] font-bold text-[#7c8490]">1</span>
                <p className="text-[13px] text-[#7c8490]">Telegram botga o&apos;ting va &quot;Boshlash&quot; tugmasini bosing</p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="w-6 h-6 rounded-full bg-[#f0f2f3] flex items-center justify-center shrink-0 text-[12px] font-bold text-[#7c8490]">2</span>
                <p className="text-[13px] text-[#7c8490]">Telefon raqam va parol o&apos;rnating</p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="w-6 h-6 rounded-full bg-[#f0f2f3] flex items-center justify-center shrink-0 text-[12px] font-bold text-[#7c8490]">3</span>
                <p className="text-[13px] text-[#7c8490]">Shu sahifaga qaytib kiring</p>
              </div>
            </div>

            <button onClick={() => setNotFound(false)} className="mt-5 text-[13px] text-[#7ea2d4] font-medium">
              ← Kirish sahifasiga qaytish
            </button>
          </div>
        )}

        <p className="text-[12px] text-[#7c8490]/60 text-center mt-4">
          Kirib, siz <Link href="#" className="text-[#7ea2d4]">foydalanish shartlari</Link>ga rozilik bildirasiz
        </p>
      </div>
    </div>
  );
}
