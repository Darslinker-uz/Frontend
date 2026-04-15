import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, History } from "lucide-react";

export const metadata: Metadata = {
  title: "Balans",
};

export default function BalancePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-[#232324] tracking-tight mb-10">
        Balans
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <div className="p-8 rounded-2xl gradient-hero text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <p className="text-[14px] text-white/50 mb-1">Joriy balans</p>
            <p className="text-4xl font-bold">
              50 000 <span className="text-lg font-normal text-white/50">so&apos;m</span>
            </p>
            <Button className="mt-6 h-11 px-6 rounded-xl bg-white text-[#232324] text-[14px] font-medium hover:bg-white/90 border-0">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              To&apos;ldirish
            </Button>
          </div>
        </div>

        {/* History */}
        <div className="p-8 rounded-2xl bg-white border border-[#e8ecef]">
          <div className="flex items-center gap-2 mb-6">
            <History className="h-5 w-5 text-[#232324]/30" />
            <h2 className="text-[18px] font-semibold text-[#232324]">
              To&apos;lov tarixi
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-[#e8ecef]">
            <p className="text-[15px] text-[#232324]/30">
              Hali to&apos;lovlar yo&apos;q
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
