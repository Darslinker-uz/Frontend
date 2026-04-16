import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-lg">
      <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-6">Profil</h1>

      <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="w-14 h-14 rounded-[16px] bg-[#7ea2d4]/20 flex items-center justify-center">
            <User className="h-6 w-6 text-[#7ea2d4]" />
          </div>
          <div>
            <p className="text-[16px] font-semibold text-white">Demo User</p>
            <p className="text-[13px] text-white/30">Kurs egasi</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-[12px] text-white/30 mb-1.5 block">Ism</label>
            <input placeholder="Ismingiz" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
          </div>
          <div>
            <label className="text-[12px] text-white/30 mb-1.5 block">Telefon</label>
            <input disabled placeholder="+998 90 123 45 67" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-[15px] text-white/30 placeholder:text-white/15" />
          </div>
          <div>
            <label className="text-[12px] text-white/30 mb-1.5 block">Telegram</label>
            <input placeholder="@username" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
          </div>
          <button className="w-full h-[46px] rounded-[10px] bg-[#7ea2d4] text-white text-[15px] font-medium hover:bg-[#6b91c3] transition-colors mt-2">
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
