// src/i18n.ts (yoki src/lib/i18n.ts)

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import type { LocalizedObject } from "@/shared/types/localized";

export const localized = (obj: LocalizedObject, key: string, fallbackLang = "uz"): string => {
  if (!obj || typeof obj !== "object") return "";

  const currentLang = i18next.resolvedLanguage || i18next.language || fallbackLang;
  const order = [currentLang, fallbackLang, "uz", "ru", "en"];

  for (const lang of order) {
    const value = obj[`${key}_${lang}`];
    if (value != null && value !== "") {
      return String(value).trim();
    }
  }

  for (const k of Object.keys(obj)) {
    if (k.startsWith(`${key}_`) && obj[k] != null && obj[k] !== "") {
      return String(obj[k]).trim();
    }
  }

  return "";
};

declare module "i18next" {
  interface i18n {
    localized: typeof localized;
  }
}
i18next.localized = localized;

declare global {
  interface Window {
    localized?: typeof localized;
  }
}
if (typeof window !== "undefined") {
  window.localized = localized;
}

// --- i18next Sozlamalari ---
i18next
  .use(HttpBackend)
  .use(LanguageDetector) // 2. DETEKTOR ULANDI
  .use(initReactI18next)
  .init({
    lng: "uz", // Sukut bo‘yicha o‘zbek tili (birinchi kirishda)
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru", "en"],
    ns: ["common"],
    defaultNS: "common",

    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
    },

    backend: {
      loadPath: "/locales/{{lng}}/common.json",
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    debug: import.meta.env.DEV,
  });

i18next.on("languageChanged", () => {
  // Til o'zgarganda qo'shimcha logika kerak bo'lsa shu yerga yoziladi
});

export default i18next;