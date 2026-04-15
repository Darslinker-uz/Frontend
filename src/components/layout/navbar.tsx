"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-[#e4e7ea]">
      <div className="px-4 md:max-w-[1600px] md:mx-auto md:px-20 flex items-center justify-between h-[62px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <DarslinkerLogo size={28} />
          <span className="text-[20px] font-[family-name:var(--font-outfit)] font-bold tracking-tight text-[#16181a]">
            Dars<span className="text-[#7ea2d4]">Linker</span>
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/kurslar">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Kategoriyalar
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Kirish
            </Button>
          </Link>
          <Link href="/dashboard/listings/new">
            <Button className="rounded-[10px] bg-[#16181a] text-white hover:bg-[#16181a]/90 h-9 px-5 text-[14px] font-medium border-0">
              E&apos;lon berish
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <div className="p-2 rounded-[10px] hover:bg-[#f2f4f5] transition-colors">
              <Menu className="h-5 w-5 text-[#16181a]" />
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <div className="flex flex-col h-full">
              <div className="px-6 pt-8 pb-4 flex items-center gap-2">
                <DarslinkerLogo size={28} />
                <span className="text-[20px] font-[family-name:var(--font-outfit)] font-bold tracking-tight text-[#16181a]">
                  Dars<span className="text-[#7ea2d4]">Linker</span>
                </span>
              </div>
              <nav className="flex-1 px-4 py-2">
                {[
                  { href: "/kurslar", label: "Kategoriyalar" },
                  { href: "/auth", label: "Kirish" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3.5 text-[16px] text-[#16181a]/80 hover:text-[#16181a] hover:bg-[#f2f4f5] rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="px-6 pb-8">
                <Link
                  href="/dashboard/listings/new"
                  onClick={() => setOpen(false)}
                >
                  <Button className="w-full rounded-[10px] bg-[#16181a] text-white h-12 text-[15px] font-medium border-0">
                    E&apos;lon berish
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
