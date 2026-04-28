"use client";

import { useState } from "react";
import { Star, Phone, KeyRound, AlertCircle, MessageSquare, X, ExternalLink, CheckCircle2 } from "lucide-react";

// Reyting kodlari student bot orqali yuboriladi — bu provider'lar uchun mo'ljallangan
// asosiy bot bilan adashmaslik uchun.
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_STUDENT_BOT_USERNAME || "darslinkerbot";

export function RatingForm({ listingId }: { listingId: number }) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [hover, setHover] = useState(0);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

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
    if (stars < 1 || stars > 5) { setError("Yulduz tanlang"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          phone: "+998" + digits,
          code,
          stars,
          comment: comment.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Xatolik");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSubmitting(false);
    }
  }

  function reset() {
    setOpen(false);
    setDone(false);
    setStars(5);
    setHover(0);
    setPhone("");
    setCode("");
    setComment("");
    setError("");
    setSubmitting(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-[40px] px-4 rounded-[10px] bg-white border border-[#e4e7ea] text-[13px] font-medium text-[#16181a] hover:bg-[#f0f2f3] transition-colors"
      >
        <Star className="w-4 h-4" /> Reyting qoldirish
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={reset} />
          <div className="relative w-full max-w-[460px] max-h-[92vh] overflow-y-auto rounded-t-[20px] md:rounded-[20px] bg-white p-5 md:p-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-[18px] font-bold text-[#16181a]">Kursni baholang</h2>
              <button onClick={reset} className="w-8 h-8 rounded-full bg-[#f0f2f3] flex items-center justify-center text-[#7c8490] hover:text-[#16181a] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {done ? (
              <div className="py-6 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="text-[16px] font-semibold text-[#16181a]">Rahmat!</p>
                <p className="text-[13px] text-[#7c8490] mt-1">Reytingingiz qabul qilindi.</p>
                <button onClick={reset} className="mt-5 h-[40px] px-5 rounded-[10px] bg-[#16181a] text-white text-[13px] font-semibold">Yopish</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Yulduzlar */}
                <div>
                  <label className="block text-[12px] text-[#6a7585] mb-2 font-medium">Sizning bahongiz</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const filled = (hover || stars) >= n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setStars(n)}
                          onMouseEnter={() => setHover(n)}
                          onMouseLeave={() => setHover(0)}
                          className="p-1"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${filled ? "fill-amber-400 text-amber-400" : "text-[#d4d7db]"}`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-[13px] text-[#7c8490] ml-2">{stars}/5</span>
                  </div>
                </div>

                {/* Telegram bot ko'rsatma */}
                <div className="rounded-[12px] bg-[#eaf1fb] border border-[#7ea2d4]/30 p-3">
                  <p className="text-[12px] text-[#16181a] font-medium">Tasdiqlash kodi olish:</p>
                  <ol className="text-[12px] text-[#6a7585] mt-1.5 space-y-0.5 list-decimal list-inside">
                    <li>@{BOT_USERNAME} bot'ni oching</li>
                    <li><code className="px-1.5 py-0.5 rounded bg-white border border-[#e4e7ea] text-[11px] font-mono">/start</code> yuboring va telefonni ulashing</li>
                    <li>Kelgan 6-xonali kodni shu yerga kiriting</li>
                  </ol>
                  <a
                    href={`https://t.me/${BOT_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-[#2AABEE] font-medium hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Botni ochish
                  </a>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-[12px] text-[#6a7585] mb-1.5 font-medium">Telefon raqam</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[14px] text-[#16181a] font-medium">+998</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => handlePhone(e.target.value)}
                      placeholder="77 123 45 67"
                      maxLength={12}
                      disabled={submitting}
                      className="w-full h-[44px] pl-[68px] pr-3 text-[14px] rounded-[10px] bg-white border border-[#e4e7ea] focus:outline-none focus:border-[#7ea2d4] transition-colors"
                    />
                  </div>
                </div>

                {/* Kod */}
                <div>
                  <label className="block text-[12px] text-[#6a7585] mb-1.5 font-medium">6-xonali kod</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      disabled={submitting}
                      className="w-full h-[44px] pl-10 pr-3 text-[16px] tracking-[4px] text-center font-bold rounded-[10px] bg-white border border-[#e4e7ea] focus:outline-none focus:border-[#7ea2d4] transition-colors"
                    />
                  </div>
                </div>

                {/* Komment */}
                <div>
                  <label className="block text-[12px] text-[#6a7585] mb-1.5 font-medium">Izoh (ixtiyoriy)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#7c8490]" />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 500))}
                      placeholder="Kurs haqida fikringizni yozing..."
                      rows={3}
                      disabled={submitting}
                      className="w-full pl-10 pr-3 py-2.5 text-[13px] rounded-[10px] bg-white border border-[#e4e7ea] focus:outline-none focus:border-[#7ea2d4] transition-colors resize-none"
                    />
                  </div>
                  <p className="text-[10px] text-[#7c8490] mt-1">{comment.length}/500</p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-[12px] text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[44px] rounded-[10px] bg-[#16181a] text-white text-[14px] font-semibold hover:bg-[#26282c] transition-colors disabled:opacity-60"
                >
                  {submitting ? "Yuborilmoqda..." : "Reytingni yuborish"}
                </button>

                <p className="text-[10px] text-center text-[#7c8490]">
                  Avval qoldirgan baholaringiz yangisi bilan almashtiriladi.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
