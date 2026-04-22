"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  // Design tokens — optional overrides
  bg?: string;
  border?: string;
  text?: string;
  textMuted?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  label = "Rasm",
  hint = "JPG/PNG/WEBP · 5 MB gacha",
  bg = "rgba(255,255,255,0.04)",
  border = "rgba(255,255,255,0.08)",
  text = "#ffffff",
  textMuted = "rgba(255,255,255,0.55)",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Yuklashda xato");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Tarmoq xatosi, qayta urining");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const triggerPick = () => inputRef.current?.click();

  const remove = () => {
    onChange(null);
    setError(null);
  };

  return (
    <div>
      {label && <label className="text-[12px] mb-1.5 block" style={{ color: textMuted }}>{label}</label>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onPick}
        disabled={disabled || uploading}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2">
          <div className="relative rounded-[10px] overflow-hidden" style={{ border: `1px solid ${border}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Rasm" className="w-full h-[180px] object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={triggerPick}
              disabled={disabled || uploading}
              className="flex-1 h-9 px-3 rounded-[8px] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}
            >
              <Upload className="w-3.5 h-3.5" /> Almashtirish
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={disabled || uploading}
              className="flex-1 h-9 px-3 rounded-[8px] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              style={{ backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}
            >
              <X className="w-3.5 h-3.5" /> O&apos;chirish
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerPick}
          disabled={disabled || uploading}
          className="w-full h-[140px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
          style={{ backgroundColor: bg, borderColor: border, color: textMuted }}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: text }} />
              <p className="text-[13px]" style={{ color: textMuted }}>Yuklanmoqda...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: border }}>
                <ImageIcon className="w-5 h-5" style={{ color: textMuted }} />
              </div>
              <p className="text-[13px] font-medium" style={{ color: text }}>Rasmni yuklash</p>
              <p className="text-[11px]" style={{ color: textMuted }}>{hint}</p>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-2 flex items-start gap-1.5 text-[12px]" style={{ color: "#ef4444" }}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
