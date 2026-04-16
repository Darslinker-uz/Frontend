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
          <span className="text-[20px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight text-[#16181a]">
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
              Kurslar
            </Button>
          </Link>
          <Link href="/kurslar?format=online">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Onlayn
            </Button>
          </Link>
          <Link href="/kurslar?format=offline">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Oflayn
            </Button>
          </Link>
          <Link href="/blog">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Blog
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
                <span className="text-[20px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight text-[#16181a]">
                  Dars<span className="text-[#7ea2d4]">Linker</span>
                </span>
              </div>
              <nav className="flex-1 px-4 py-2">
                {[
                  { href: "/kurslar", label: "Kurslar" },
                  { href: "/kurslar?format=online", label: "Onlayn" },
                  { href: "/kurslar?format=offline", label: "Oflayn" },
                  { href: "/blog", label: "Blog" },
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
              <div className="px-6 pb-8" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
