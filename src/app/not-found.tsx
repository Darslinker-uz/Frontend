import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-md w-full text-center">
        <div className="text-[120px] font-bold leading-none mb-4 bg-gradient-to-r from-[#7ea2d4] to-[#4a7ab5] bg-clip-text text-transparent">404</div>
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-2">Sahifa topilmadi</h1>
        <p className="text-[14px] text-[#7c8490] mb-8">Siz qidirayotgan sahifa ko&apos;chirilgan yoki mavjud emas.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-[10px] bg-[#16181a] text-white text-[14px] font-medium hover:bg-[#2a2d31] transition-colors">
            <Home className="w-4 h-4" /> Bosh sahifa
          </Link>
          <Link href="/kurslar" className="inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-[10px] bg-white border border-[#e4e7ea] text-[#16181a] text-[14px] font-medium hover:bg-[#f5f7fa] transition-colors">
            <Search className="w-4 h-4" /> Kurslarni ko&apos;rish
          </Link>
        </div>
      </div>
    </div>
  );
}
