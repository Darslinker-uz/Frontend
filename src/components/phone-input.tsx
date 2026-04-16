"use client";

import { useState } from "react";

function formatPhone(input: string) {
  const digits = input.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  let formatted = "";
  if (digits.length > 0) formatted = digits.slice(0, 2);
  if (digits.length > 2) formatted += " " + digits.slice(2, 5);
  if (digits.length > 5) formatted += " " + digits.slice(5, 7);
  if (digits.length > 7) formatted += " " + digits.slice(7, 9);
  return formatted;
}

function formatTg(input: string) {
  const clean = input.replace(/@/g, "").replace(/\s/g, "");
  return clean;
}

export function PhoneInput({ className }: { className?: string }) {
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-medium ${className?.includes("text-white") ? "text-white/50" : "text-[#16181a]"}`}>+998</span>
      <input
        type="tel"
        name="phone"
        value={value}
        onChange={(e) => setValue(formatPhone(e.target.value))}
        placeholder="77 123 45 67"
        maxLength={12}
        className={`${className} pl-[60px]`}
      />
    </div>
  );
}

export function TelegramInput({ className }: { className?: string }) {
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-medium ${className?.includes("text-white") ? "text-white/50" : "text-[#16181a]"}`}>@</span>
      <input
        type="text"
        name="telegram"
        value={value}
        onChange={(e) => setValue(formatTg(e.target.value))}
        placeholder="username"
        className={`${className} pl-[34px]`}
      />
    </div>
  );
}
