"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, ChevronRight, Crown, Sparkles } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";

interface ApiListing {
  id: number;
  title: string;
  status: "pending" | "active" | "paused" | "rejected";
  category: { id: number; name: string; slug: string } | null;
  _count: { boosts: number };
}

interface BoostRow {
  id: number;
  type: "a_class" | "b_class";
  status: "pending" | "active" | "ended" | "stopped" | "rejected";
  endDate: string;
  listingId: number;
}

export default function BoostSelectPage() {
  const { config } = useDashboardTheme();
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [boosts, setBoosts] = useState<BoostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [lRes, bRes] = await Promise.all([
          fetch("/api/dashboard/listings", { cache: "no-store" }),
          fetch("/api/dashboard/boost", { cache: "no-store" }),
        ]);
        const lData: { listings: ApiListing[] } = await lRes.json();
        const bData: { boosts: BoostRow[] } = await bRes.json();
        if (cancelled) return;
        setListings(lData.listings ?? []);
        setBoosts(bData.boosts ?? []);
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const activeListings = listings.filter(l => l.status === "active");
  const now = Date.now();
  const activeBoostByListing = new Map<number, BoostRow>();
  for (const b of boosts) {
    if (b.status === "active" && new Date(b.endDate).getTime() > now) {
      activeBoostByListing.set(b.listingId, b);
    }
  }
  const pendingBoostCount = boosts.filter(b => b.status === "pending").length;

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/center/listings" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>E&apos;lonni ko&apos;tarish</h1>
      <p className="text-[14px] mb-6" style={{ color: config.textMuted }}>Qaysi e&apos;lonni boost qilmoqchisiz?</p>

      {pendingBoostCount > 0 && (
        <div className="rounded-[12px] p-3 mb-5 flex items-center gap-2" style={{ backgroundColor: "#f59e0b14", border: "1px solid #f59e0b33", color: "#f59e0b" }}>
          <Zap className="w-4 h-4 shrink-0" />
          <p className="text-[12px]">{pendingBoostCount} ta boost admin tasdig&apos;ini kutmoqda</p>
        </div>
      )}

      {/* Info cards — A/B class */}
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <div className="rounded-[14px] bg-gradient-to-br from-[#7ea2d4]/10 to-[#4a7ab5]/5 border border-[#7ea2d4]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-[#7ea2d4]" />
            <span className="text-[14px] font-bold" style={{ color: config.text }}>A-class</span>
          </div>
          <p className="text-[12px]" style={{ color: config.textMuted }}>Bosh sahifadagi katta slider — premium ko&apos;rinish</p>
          <p className="text-[13px] font-bold mt-2" style={{ color: config.text }}>100,000 so&apos;m/kun</p>
        </div>
        <div className="rounded-[14px] bg-gradient-to-br from-[#8b7bb5]/10 to-[#6b5b95]/5 border border-[#8b7bb5]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#8b7bb5]" />
            <span className="text-[14px] font-bold" style={{ color: config.text }}>B-class</span>
          </div>
          <p className="text-[12px]" style={{ color: config.textMuted }}>Mashhur kurslar — doim aylanuvchi slider</p>
          <p className="text-[13px] font-bold mt-2" style={{ color: config.text }}>50,000 so&apos;m/kun</p>
        </div>
      </div>

      {/* Listings */}
      <p className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textMuted }}>Aktiv e&apos;lonlar</p>
      {loading ? (
        <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
      ) : activeListings.length > 0 ? (
        <div className="space-y-2">
          {activeListings.map((listing) => {
            const activeBoost = activeBoostByListing.get(listing.id);
            return (
              <Link
                key={listing.id}
                href={`/center/listings/${listing.id}/boost`}
                className="flex items-center gap-3 rounded-[14px] transition-all p-4"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px]" style={{ color: config.textDim }}>{listing.category?.name ?? "—"}</span>
                    {activeBoost && (
                      <span className="h-[18px] px-2 rounded-full bg-gradient-to-r from-[#7ea2d4] to-[#4a7ab5] text-white text-[10px] font-bold flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5 fill-white" /> {activeBoost.type === "a_class" ? "A" : "B"}-class
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-semibold" style={{ color: config.text }}>{listing.title}</p>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color: config.textDim }} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[14px] border border-dashed p-8 text-center" style={{ borderColor: config.surfaceBorder }}>
          <p className="text-[14px] mb-3" style={{ color: config.textMuted }}>Aktiv e&apos;lon yo&apos;q</p>
          <Link href="/center/listings/new" className="inline-block h-[36px] px-4 rounded-[10px] text-[13px] font-medium leading-[36px]" style={{ backgroundColor: config.accent, color: config.accentText }}>
            Yangi e&apos;lon qo&apos;shish
          </Link>
        </div>
      )}
    </div>
  );
}
