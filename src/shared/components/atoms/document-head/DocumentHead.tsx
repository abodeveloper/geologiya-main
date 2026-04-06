import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { localized } from "@/i18n";

const MIN_KEYWORDS_COUNT = 100;
const AUTO_KEYWORDS = Array.from({ length: 120 }, (_, i) => `nggqi-${i + 1}`);

const buildKeywords = (seed: string[]): string => {
  const merged = Array.from(new Set([...seed, ...AUTO_KEYWORDS]));

  while (merged.length < MIN_KEYWORDS_COUNT) {
    merged.push(`nggqi-extra-${merged.length + 1}`);
  }

  return merged.join(", ");
};

/** Tilga qarab faqat <title> / og:title uchun */
const SITE_TITLE: Record<string, string> = {
  uz: "H.M.Abdullayev nomidagi Geologiya va geofizika instituti",
  ru: "Институт геологии и геофизики имени Х.М. Абдуллаева",
  en: "Institute of Geology and Geophysics named after H.M. Abdullaev",
};

/** SEO: barcha tillar uchun bir xil (o‘zgarmaydi) */
const SITE_KEYWORDS = buildKeywords([
  "H.M.Abdullayev",
  "Abdullayev",
  "geologiya",
  "geofizika",
  "institut",
  "GGI",
  "NGGQI",
  "O'zbekiston",
  "Toshkent",
  "neft",
  "gaz",
  "qidiruv",
  "neft va gaz",
  "ilmiy tadqiqot",
  "neft-gaz konlari",
  "geologik qidiruv",
  "uglevodorod",
  "quduq",
  "seysmika",
]);

const SITE_DESCRIPTION =
  "H.M.Abdullayev nomidagi Geologiya va geofizika instituti (GGI) — O'zbekistonda yer fanlari, neft-gaz geologiyasi va geofizika bo‘yicha ilmiy tadqiqotlar va xizmatlar.";

function setOrCreateMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function DocumentHead() {
  const { i18n } = useTranslation();
  const { data: company } = useCompanyInfo();

  useEffect(() => {
    const applyMeta = () => {
      const raw = i18n.resolvedLanguage || i18n.language || "uz";
      const lang = raw.split("-")[0];

      const orgName = company ? localized(company, "name").trim() : "";
      const fallbackTitle = SITE_TITLE[lang] ?? SITE_TITLE.uz;
      const title = orgName || fallbackTitle;

      document.title = title;

      const htmlLang = lang === "en" ? "en" : lang === "ru" ? "ru" : "uz";
      document.documentElement.setAttribute("lang", htmlLang);

      setOrCreateMeta("name", "keywords", SITE_KEYWORDS);
      setOrCreateMeta("name", "description", SITE_DESCRIPTION);

      setOrCreateMeta("property", "og:title", title);
      setOrCreateMeta("property", "og:description", SITE_DESCRIPTION);
      setOrCreateMeta(
        "property",
        "og:locale",
        htmlLang === "en" ? "en_US" : htmlLang === "ru" ? "ru_RU" : "uz_UZ",
      );
    };

    applyMeta();
    i18n.on("languageChanged", applyMeta);
    return () => {
      i18n.off("languageChanged", applyMeta);
    };
  }, [i18n, company]);

  return null;
}
