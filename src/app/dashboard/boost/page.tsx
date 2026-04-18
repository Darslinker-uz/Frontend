"use client";

import Link from "next/link";
import { ArrowLeft, Zap, ChevronRight, Crown, Sparkles } from "lucide-react";

const MY_LISTINGS = [
  { id: 1, title: "JavaScript & React Full-stack", category: "IT & Dasturlash", status: "aktiv", boost: "A" as const },
  { id: 2, title: "UI/UX dizayn Figma masterclass", category: "Dizayn", status: "aktiv", boost: "B" as const },
  { id: 3, title: "IELTS Intensive 7.0+", category: "Xorijiy tillar", status: "pauza", boost: null },
];

export default function BoostSelectPage() {
  const activeListings = MY_LISTINGS.filter(l => l.status === "aktiv");

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-1">E&apos;lonni ko&apos;tarish</h1>
      <p className="text-[14px] text-white/40 mb-6">Qaysi e&apos;lonni boost qilmoqchisiz?</p>

      {/* Info cards — A/B class */}
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <div className="rounded-[14px] bg-gradient-to-br from-[#7ea2d4]/10 to-[#4a7ab5]/5 border border-[#7ea2d4]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-[#7ea2d4]" />
            <span className="text-[14px] font-bold text-white">A-class</span>
          </div>
          <p className="text-[12px] text-white/50">Bosh sahifadagi katta slider — premium ko&apos;rinish</p>
          <p className="text-[13px] font-bold text-white mt-2">100,000 so&apos;m/kun</p>
        </div>
        <div className="rounded-[14px] bg-gradient-to-br from-[#8b7bb5]/10 to-[#6b5b95]/5 border border-[#8b7bb5]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#8b7bb5]" />
            <span className="text-[14px] font-bold text-white">B-class</span>
          </div>
          <p className="text-[12px] text-white/50">Mashhur kurslar — doim aylanuvchi slider</p>
          <p className="text-[13px] font-bold text-white mt-2">70,000 so&apos;m/kun</p>
        </div>
      </div>

      {/* Listings */}
      <p className="text-[13px] font-semibold text-white/60 uppercase tracking-wider mb-3">Aktiv e&apos;lonlar</p>
      {activeListings.length > 0 ? (
        <div className="space-y-2">
          {activeListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/dashboard/listings/${listing.id}/boost`}
              className="flex items-center gap-3 rounded-[14px] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:border-[#7ea2d4]/30 transition-all p-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-white/30">{listing.category}</span>
                  {listing.boost && (
                    <span className="h-[18px] px-2 rounded-full bg-gradient-to-r from-[#7ea2d4] to-[#4a7ab5] text-white text-[10px] font-bold flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 fill-white" /> {listing.boost}-class
                    </span>
                  )}
                </div>
                <p className="text-[14px] font-semibold text-white">{listing.title}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#7ea2d4] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] border border-dashed border-white/[0.08] p-8 text-center">
          <p className="text-[14px] text-white/40 mb-3">Aktiv e&apos;lon yo&apos;q</p>
          <Link href="/dashboard/listings/new" className="inline-flex items-center gap-2 h-[36px] px-4 rounded-[8px] bg-white/[0.06] text-white text-[13px] font-medium hover:bg-white/[0.1] transition-colors">
            Yangi e&apos;lon qo&apos;shish
          </Link>
        </div>
      )}
    </div>
  );
}
