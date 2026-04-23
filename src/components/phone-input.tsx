"use client";

import { useState, type ChangeEvent } from "react";

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

interface ControlledInputProps {
  className?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function PhoneInput({ className, value: controlled, onChange, disabled }: ControlledInputProps) {
  const [internal, setInternal] = useState("");
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (!isControlled) setInternal(formatted);
    if (onChange) {
      const synthetic = { ...e, target: { ...e.target, value: formatted } } as ChangeEvent<HTMLInputElement>;
      onChange(synthetic);
    }
  };

  return (
    <div className="relative">
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-medium ${className?.includes("text-white") ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"}`}>+998</span>
      <input
        type="tel"
        name="phone"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="77 123 45 67"
        maxLength={12}
        className={`${className} pl-[60px]`}
      />
    </div>
  );
}

export function TelegramInput({ className, value: controlled, onChange, disabled }: ControlledInputProps) {
  const [internal, setInternal] = useState("");
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTg(e.target.value);
    if (!isControlled) setInternal(formatted);
    if (onChange) {
      const synthetic = { ...e, target: { ...e.target, value: formatted } } as ChangeEvent<HTMLInputElement>;
      onChange(synthetic);
    }
  };

  return (
    <div className="relative">
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-medium ${className?.includes("text-white") ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"}`}>@</span>
      <input
        type="text"
        name="telegram"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="username"
        className={`${className} pl-[34px]`}
      />
    </div>
  );
}
