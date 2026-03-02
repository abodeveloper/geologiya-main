import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** O'zbek tilida sana brauzerda "M02" kabi xato ko'rinishini oldini olish */
const UZ_MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

export function formatDateLocalized(
  date: Date | string,
  language: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";

  if (language === "uz") {
    const day = d.getDate();
    const month = UZ_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const locale = language === "ru" ? "ru-RU" : "en-US";
  return d.toLocaleDateString(locale, options ?? { year: "numeric", month: "long", day: "numeric" });
}

export function formatTimeLocalized(date: Date | string, language: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";

  if (language === "uz") {
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  const locale = language === "ru" ? "ru-RU" : "en-US";
  return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}
