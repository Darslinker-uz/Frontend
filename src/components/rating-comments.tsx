"use client";

import { useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface Comment {
  id: number;
  comment: string;
  phoneMasked: string;
  createdAt: string | Date;
}

const PAGE_SIZE = 10;

export function RatingComments({ comments }: { comments: Comment[] }) {
  const [visible, setVisible] = useState(0);

  if (comments.length === 0) return null;

  const showMore = () => setVisible((v) => Math.min(v + PAGE_SIZE, comments.length));
  const remaining = comments.length - visible;

  if (visible === 0) {
    return (
      <div className="mt-6 pt-5 border-t border-[#e4e7ea] text-center">
        <button
          type="button"
          onClick={showMore}
          className="inline-flex items-center gap-2 h-[40px] px-5 rounded-[10px] bg-white border border-[#e4e7ea] text-[13px] font-medium text-[#16181a] hover:bg-[#f0f2f3] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Izohlarni ko&apos;rish ({comments.length})
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-5 border-t border-[#e4e7ea] space-y-4">
      <h3 className="text-[14px] font-semibold text-[#16181a]">Sharhlar ({comments.length})</h3>
      {comments.slice(0, visible).map((c) => (
        <div key={c.id} className="rounded-[12px] bg-[#f0f2f3] p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[12px] font-medium text-[#16181a]">{c.phoneMasked}</span>
            <span className="text-[11px] text-[#7c8490]">
              {new Date(c.createdAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" })}
            </span>
          </div>
          <p className="text-[13px] text-[#16181a]/85 mt-2 leading-relaxed">{c.comment}</p>
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
        {remaining > 0 && (
          <button
            type="button"
            onClick={showMore}
            className="inline-flex items-center gap-2 h-[36px] px-4 rounded-[8px] text-[12px] font-medium text-[#7ea2d4] hover:bg-[#7ea2d4]/10 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Yana {Math.min(remaining, PAGE_SIZE)} ta ko&apos;rsatish
          </button>
        )}
        <button
          type="button"
          onClick={() => setVisible(0)}
          className="inline-flex items-center gap-2 h-[36px] px-4 rounded-[8px] text-[12px] font-medium text-[#7c8490] hover:bg-[#16181a]/5 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          Yopish
        </button>
      </div>
    </div>
  );
}
