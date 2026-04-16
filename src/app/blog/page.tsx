import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { blogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kurslar, ta'lim va kasblar haqida foydali maqolalar",
};

export default function BlogPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] tracking-[-0.03em]">
            Blog
          </h1>
          <p className="text-[15px] md:text-[18px] text-[#7c8490] mt-2 font-light">
            Kurslar va ta&apos;lim haqida foydali maqolalar
          </p>
        </div>

        {/* Blog grid — Outline → hover fill */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group block">
              <div className="rounded-[20px] border-2 border-[#e4e7ea] p-6 hover:border-[#16181a] transition-all duration-300 h-full flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c8490]">{blog.category}</span>
                <h3 className="text-[19px] font-bold text-[#16181a] leading-tight mt-3">{blog.title}</h3>
                <p className="text-[14px] text-[#7c8490] mt-3 line-clamp-2 flex-1">{blog.excerpt}</p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#e4e7ea]">
                  <div className="flex items-center gap-3 text-[12px] text-[#7c8490]">
                    <span>{blog.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#e4e7ea] group-hover:border-[#16181a] flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-[#7c8490] group-hover:text-[#16181a] transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
