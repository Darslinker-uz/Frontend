"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MapPin, X, Loader2 } from "lucide-react";
import { detectLocation } from "@/lib/geolocation";

const COOKIE_NAME = "loc_pref";
const COOKIE_DAYS = 30;

interface FallbackInfo {
  from: "district" | "region";
  to: "region" | "all";
  nearby: number;
  expanded: number;
}

interface Props {
  // Server-side aktiv lokatsiya filter
  region: string | null;
  district: string | null;
  // Tumanda yetarli natija topilmasa, viloyatga kengaytirish info'si
  fallback: FallbackInfo | null;
}

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export function LocationBanner({ region, district, fallback }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showInitial, setShowInitial] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Birinchi tashrif banner: cookie yo'q va URL'da region filter yo'q bo'lsa
  useEffect(() => {
    const hasCookie = getCookie(COOKIE_NAME);
    const hasFilter = region || district;
    if (!hasCookie && !hasFilter) {
      // Geolocation API mavjudligini tekshirish (browser support)
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        setShowInitial(true);
      }
    }
  }, [region, district]);

  const requestLocation = () => {
    setRequesting(true);
    setError(null);
    setShowInitial(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detected = detectLocation(pos.coords.latitude, pos.coords.longitude);
        if (!detected) {
          setError("Joylashuvni aniqlay olmadim");
          setRequesting(false);
          return;
        }
        setCookie(COOKIE_NAME, "applied", COOKIE_DAYS);

        // URL params yangilash
        const params = new URLSearchParams(searchParams.toString());
        params.set("region", detected.region);
        if (detected.district) {
          params.set("district", detected.district);
        } else {
          params.delete("district");
        }
        router.push(`${pathname}?${params.toString()}`);
      },
      (err) => {
        setRequesting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "Brauzer/tizim joylashuvga ruxsat bermadi. URL'dagi 🔒 ikonkadan qayta yoqing yoki tizim sozlamalarini tekshiring."
          );
          setCookie(COOKIE_NAME, "denied", COOKIE_DAYS);
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Joylashuv mavjud emas. WiFi'ga ulanganingizni tekshiring.");
        } else if (err.code === err.TIMEOUT) {
          setError("Aniqlash juda uzoq vaqt oldi. Qayta urinib ko'ring.");
        } else {
          setError("Joylashuvni aniqlay olmadim. Qayta urinib ko'ring.");
        }
      },
      // Desktop'da WiFi-based geolocation ba'zan 10+ soniya kerak qiladi
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 }
    );
  };

  const dismiss = () => {
    setCookie(COOKIE_NAME, "skip", COOKIE_DAYS);
    setShowInitial(false);
  };

  const clearFilter = () => {
    setCookie(COOKIE_NAME, "skip", COOKIE_DAYS);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("region");
    params.delete("district");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  // 1) Fallback banner — tumanda kam topilgan, viloyatga kengaytirildi
  if (fallback && fallback.from === "district") {
    return (
      <div className="mb-4 rounded-[14px] border border-[#7ea2d4]/30 bg-[#7ea2d4]/8 px-4 py-3 flex items-start gap-3">
        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#4a7ab5]" />
        <div className="flex-1 text-[13px] text-[#16181a]/80 leading-relaxed">
          <strong className="font-semibold text-[#16181a]">{district}</strong> atrofida {fallback.nearby} ta kurs.{" "}
          <strong className="font-semibold text-[#16181a]">{region}</strong> bo&apos;yicha barcha {fallback.expanded} ta kurs ko&apos;rsatilmoqda.
        </div>
        <button
          onClick={clearFilter}
          className="text-[12px] text-[#4a7ab5] hover:text-[#3a5a8c] font-medium shrink-0"
        >
          Tozalash
        </button>
      </div>
    );
  }

  // 2) Aktiv viloyat/tuman filter
  if (region || district) {
    return (
      <div className="mb-4 rounded-[14px] border border-[#16181a]/10 bg-white px-4 py-3 flex items-center gap-3">
        <MapPin className="w-4 h-4 shrink-0 text-[#4a7ab5]" />
        <div className="flex-1 text-[13px] text-[#16181a]/80">
          <strong className="font-semibold text-[#16181a]">
            {district ? `${region} / ${district}` : region}
          </strong>
          {" "}bo&apos;yicha kurslar
        </div>
        <button
          onClick={clearFilter}
          className="text-[12px] text-[#4a7ab5] hover:text-[#3a5a8c] font-medium"
        >
          Tozalash
        </button>
      </div>
    );
  }

  // 3) Birinchi tashrif banner — Map preview card (V5)
  if (showInitial) {
    return (
      <div className="mb-5 rounded-[18px] bg-white border border-[#e4e7ea] overflow-hidden relative">
        <button
          onClick={dismiss}
          aria-label="Yopish"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#16181a]/60 hover:text-[#16181a] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mini xarita */}
        <div className="relative h-[120px] bg-[#dde6ef] overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 120" preserveAspectRatio="xMidYMid slice">
            <path d="M-20,40 Q90,15 180,50 T420,30" stroke="#a3bdd7" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M-20,75 Q120,90 250,70 T420,80" stroke="#a3bdd7" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M30,10 L30,110" stroke="#a3bdd7" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
            <path d="M150,10 L150,110" stroke="#a3bdd7" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
            <path d="M270,10 L270,110" stroke="#a3bdd7" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
            <circle cx="80" cy="55" r="3" fill="#7ea2d4" opacity="0.5" />
            <circle cx="180" cy="80" r="3" fill="#7ea2d4" opacity="0.5" />
            <circle cx="280" cy="40" r="3" fill="#7ea2d4" opacity="0.5" />
            <circle cx="320" cy="75" r="2.5" fill="#7ea2d4" opacity="0.4" />
            <circle cx="50" cy="90" r="2.5" fill="#7ea2d4" opacity="0.4" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#4a7ab5]/30 animate-ping" />
              <div className="relative w-11 h-11 rounded-full bg-[#4a7ab5] flex items-center justify-center shadow-xl">
                <MapPin className="w-5 h-5 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-5">
          <h3 className="text-[15px] md:text-[16px] font-bold text-[#16181a]">
            Sizning hududingizdagi kurslar
          </h3>
          <p className="text-[12px] md:text-[13px] text-[#7c8490] mt-1 leading-relaxed">
            Joylashuvni aniqlasak, eng yaqin o&apos;quv markazlarni topamiz
          </p>
          <button
            onClick={requestLocation}
            disabled={requesting}
            className="mt-3 w-full md:w-auto h-[40px] px-4 rounded-[10px] bg-[#4a7ab5] hover:bg-[#3a5a8c] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {requesting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Aniqlanyapti...
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5" /> OK
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 4) Xatolik bo'lsa snackbar (qisqa)
  if (error) {
    return (
      <div className="mb-4 rounded-[12px] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-4 py-2.5 flex items-center gap-2 text-[12.5px] text-[#16181a]/80">
        <span className="flex-1">{error}</span>
        <button onClick={() => setError(null)} className="opacity-70 hover:opacity-100">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
}
