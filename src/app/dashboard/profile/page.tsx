import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "Profil",
};

export default function ProfilePage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-[#232324] tracking-tight mb-10">
        Profil
      </h1>

      <div className="p-8 rounded-2xl bg-white border border-[#e8ecef]">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#e8ecef]">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center shadow-sm">
            <User className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-[16px] font-semibold text-[#232324]">
              Demo User
            </p>
            <p className="text-[14px] text-[#232324]/40">Kurs egasi</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <Label className="text-[13px] text-[#232324]/50 mb-1.5">Ism</Label>
            <Input
              placeholder="Ismingiz"
              className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
            />
          </div>
          <div>
            <Label className="text-[13px] text-[#232324]/50 mb-1.5">
              Telefon
            </Label>
            <Input
              disabled
              placeholder="+998 90 123 45 67"
              className="rounded-xl h-11 border-[#e8ecef] bg-[#f5f7f7]"
            />
          </div>
          <div>
            <Label className="text-[13px] text-[#232324]/50 mb-1.5">
              Telegram
            </Label>
            <Input
              placeholder="@username"
              className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
            />
          </div>
          <Button className="w-full h-12 rounded-xl gradient-accent border-0 text-white text-[15px] font-medium shadow-sm hover:shadow-md transition-shadow mt-2">
            Saqlash
          </Button>
        </div>
      </div>
    </div>
  );
}
