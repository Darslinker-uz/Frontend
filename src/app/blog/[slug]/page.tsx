import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { blogs } from "@/data/blogs";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogs.find((b) => b.slug === slug);
  if (!post) return { title: "Topilmadi" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogs.find((b) => b.slug === slug);
  if (!post) notFound();

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[680px] mx-auto px-5 py-10 md:py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-8 hover:text-[#4a7ab5] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Maqolalar
        </Link>
        <span className="block text-[13px] text-[#7ea2d4] font-medium mb-3">{post.category}</span>
        <h1 className="text-[28px] md:text-[38px] font-bold text-[#16181a] leading-[1.2] tracking-[-0.02em]">{post.title}</h1>
        <div className="flex items-center gap-4 mt-5 text-[13px] text-[#7c8490]">
          <span>{post.author}</span>
          <span>{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
        </div>
        <div className="border-t border-[#e4e7ea] mt-8 pt-8">
          <div className="space-y-6">
            {post.content.map((block, i) => {
              if (block.type === "h2") return <h2 key={i} className="text-[20px] font-bold text-[#16181a] mt-10">{block.text}</h2>;
              if (block.type === "quote") return <blockquote key={i} className="border-l-[3px] border-[#7ea2d4] pl-5 py-1 text-[16px] text-[#16181a]/70 italic">{block.text}</blockquote>;
              return <p key={i} className="text-[16px] text-[#16181a]/70 leading-[1.8]">{block.text}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
