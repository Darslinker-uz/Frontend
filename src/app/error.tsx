"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-[20px] bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-2">Xatolik yuz berdi</h1>
        <p className="text-[14px] text-[#7c8490] mb-8">Nimadir noto&apos;g&apos;ri ketdi. Iltimos, qayta urinib ko&apos;ring.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-[10px] bg-[#16181a] text-white text-[14px] font-medium hover:bg-[#2a2d31] transition-colors">
            <RefreshCw className="w-4 h-4" /> Qayta urinish
          </button>
          <Link href="/" className="inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] text-[14px] font-medium hover:bg-[#f5f7fa] transition-colors">
            <Home className="w-4 h-4" /> Bosh sahifa
          </Link>
        </div>

        {error.digest && (
          <p className="text-[11px] text-[#a0a6ae] mt-6">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
