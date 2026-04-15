import type { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Kirish",
  description: "Darslinker.uz platformasiga kirish yoki ro'yxatdan o'tish",
};

export default function AuthPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] text-[#232324]/40 hover:text-[#232324]/60 mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Bosh sahifa
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mb-6 shadow-sm">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-[28px] font-bold text-[#232324] tracking-tight">
            Kirish
          </h1>
          <p className="text-[15px] text-[#232324]/40 mt-2">
            Telefon raqamingizga SMS kod yuboramiz
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <Label
              htmlFor="phone"
              className="text-[13px] text-[#232324]/50 mb-1.5"
            >
              Telefon raqam
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+998 90 123 45 67"
              className="h-13 rounded-xl border-[#e8ecef] text-[16px] focus-visible:ring-[#7ea2d4]/30"
            />
          </div>
          <Button className="w-full h-13 rounded-xl gradient-accent border-0 text-white text-[15px] font-medium shadow-sm hover:shadow-md transition-shadow">
            Kodni yuborish
          </Button>
        </div>

        <p className="text-[13px] text-[#232324]/30 text-center mt-6 leading-relaxed">
          Davom etish orqali{" "}
          <Link href="#" className="text-[#7ea2d4] hover:underline">
            foydalanish shartlari
          </Link>
          ga rozilik bildirasiz
        </p>
      </div>
    </div>
  );
}
