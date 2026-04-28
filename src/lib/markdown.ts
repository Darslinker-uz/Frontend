// Minimal markdown -> HTML renderer used by /manba va /blog detail sahifalari.
// Supports: ## h2, ### h3, **bold**, *italic*, [link](url), `code`, - lists, > quote, paragraph.

export function stripMd(text: string): string {
  return text
    .replace(/[#*_`>]/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderMarkdown(input: string): string {
  const text = input.replace(/\r\n/g, "\n").trim();
  const blocks = text.split(/\n{2,}/);

  const inline = (s: string): string => {
    let r = escapeHtml(s);
    r = r.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#16181a]">$1</strong>');
    r = r.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    r = r.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#4a7ab5] underline underline-offset-2 hover:text-[#7ea2d4]">$1</a>');
    r = r.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#f0f2f3] text-[13px] font-mono">$1</code>');
    return r;
  };

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      if (/^### /.test(trimmed)) {
        return `<h3 class="text-[17px] md:text-[19px] font-bold text-[#16181a] mt-6 mb-2">${inline(trimmed.replace(/^### /, ""))}</h3>`;
      }
      if (/^## /.test(trimmed)) {
        return `<h2 class="text-[20px] md:text-[24px] font-bold text-[#16181a] mt-8 mb-3 tracking-[-0.01em]">${inline(trimmed.replace(/^## /, ""))}</h2>`;
      }
      if (/^[-*] /.test(trimmed)) {
        const items = trimmed.split(/\n/).map((line) => {
          const m = line.match(/^[-*] (.+)$/);
          return m ? `<li class="ml-1">${inline(m[1])}</li>` : "";
        }).filter(Boolean).join("");
        return `<ul class="list-disc pl-6 space-y-1.5 my-4 text-[15px] md:text-[16px] text-[#16181a]/80 leading-relaxed">${items}</ul>`;
      }
      if (/^\d+\. /.test(trimmed)) {
        const items = trimmed.split(/\n/).map((line) => {
          const m = line.match(/^\d+\. (.+)$/);
          return m ? `<li class="ml-1">${inline(m[1])}</li>` : "";
        }).filter(Boolean).join("");
        return `<ol class="list-decimal pl-6 space-y-1.5 my-4 text-[15px] md:text-[16px] text-[#16181a]/80 leading-relaxed">${items}</ol>`;
      }
      if (/^> /.test(trimmed)) {
        const inner = trimmed.split(/\n/).map((l) => l.replace(/^> ?/, "")).join(" ");
        return `<blockquote class="border-l-[3px] border-[#7ea2d4] pl-5 py-1 my-4 text-[15px] md:text-[16px] text-[#16181a]/70 italic">${inline(inner)}</blockquote>`;
      }
      const withBreaks = inline(trimmed).replace(/\n/g, "<br/>");
      return `<p class="text-[15px] md:text-[16px] text-[#16181a]/80 leading-[1.8] mb-4">${withBreaks}</p>`;
    })
    .join("\n");
}

// Estimate read time given content length (200 wpm).
export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} daqiqa`;
}
