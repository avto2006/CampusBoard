import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ContactType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Tbilisi",
  }).format(new Date(iso));
}

export function contactHref(type: ContactType, handle: string): string {
  const h = handle.trim();
  if (/^https?:\/\//i.test(h)) return h;
  if (type === "telegram") return `https://t.me/${h.replace(/^@/, "")}`;
  if (type === "email") return `mailto:${h}`;
  return `https://www.linkedin.com/in/${h.replace(/^@/, "")}`;
}