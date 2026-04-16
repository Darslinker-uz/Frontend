import { Wallet, ArrowUpRight, History } from "lucide-react";

export default function BalancePage() {
  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-6">Balans</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Balance Card */}
        <div className="rounded-[16px] bg-gradient-to-br from-[#7ea2d4] to-[#4a7ab5] p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <div className="w-11 h-11 rounded-[12px] bg-white/15 flex items-center justify-center mb-5">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <p className="text-[13px] text-white/50 mb-1">Joriy balans</p>
            <p className="text-[32px] font-bold text-white">
              50,000 <span className="text-[16px] font-normal text-white/50">so&apos;m</span>
            </p>
            <button className="mt-5 h-[42px] px-5 rounded-[10px] bg-white text-[#16181a] text-[14px] font-medium flex items-center gap-2 hover:bg-white/90 transition-colors">
              <ArrowUpRight className="h-4 w-4" /> To&apos;ldirish
            </button>
          </div>
        </div>

        {/* History */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <History className="h-5 w-5 text-white/20" />
            <h2 className="text-[16px] font-bold text-white">To&apos;lov tarixi</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-10 rounded-[12px] border border-dashed border-white/[0.08]">
            <p className="text-[14px] text-white/20">Hali to&apos;lovlar yo&apos;q</p>
          </div>
        </div>
      </div>
    </div>
  );
}
