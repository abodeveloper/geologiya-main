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

const SITE_META: Record<
  string,
  { title: string; keywords: string; description: string }
> = {
  uz: {
    title: "Neft va gaz konlari geologiyasi hamda qidiruvi instituti",
    keywords: buildKeywords([
      "neft",
      "gaz",
      "geologiya",
      "qidiruv",
      "institut",
      "NGGQI",
      "O'zbekiston",
      "neft va gaz",
      "ilmiy tadqiqot",
      "neft-gaz konlari",
      "geologik qidiruv",
      "uglevodorod",
      "quduq",
      "seysmika",
      "geofizika",
    ]),
    description:
      "Neft va gaz konlari geologiyasi hamda qidiruvi instituti — O'zbekistonda neft-gaz sohasidagi ilmiy va amaliy tadqiqotlar.",
  },
  ru: {
    title: "Институт геологии и разведки нефтяных и газовых месторождений",
    keywords: buildKeywords([
      "нефть",
      "газ",
      "геология",
      "разведка",
      "институт",
      "НГГКИ",
      "Узбекистан",
      "нефть и газ",
      "научные исследования",
      "нефтегазовые месторождения",
      "углеводороды",
      "скважина",
      "сейсмика",
      "геофизика",
    ]),
    description:
      "Институт геологии и разведки нефтяных и газовых месторождений — научные и прикладные исследования в сфере нефти и газа в Узбекистане.",
  },
  en: {
    title: "Institute of Geology and Exploration of Oil and Gas Fields",
    keywords: buildKeywords([
      "oil",
      "gas",
      "geology",
      "exploration",
      "institute",
      "NGGQI",
      "Uzbekistan",
      "oil and gas",
      "research",
      "hydrocarbon exploration",
      "hydrocarbon",
      "well",
      "seismic",
      "geophysics",
    ]),
    description:
      "Institute of Geology and Exploration of Oil and Gas Fields — scientific and applied research in oil and gas in Uzbekistan.",
  },
};

export function DocumentHead() {
  const { i18n } = useTranslation();
  const { data: company } = useCompanyInfo();
  const lang = i18n.language?.split("-")[0] || "uz";

  useEffect(() => {
    const m = SITE_META[lang] ?? SITE_META.uz;
    document.title = company ? localized(company, "name") : m.title;

    const html = document.documentElement;
    html.setAttribute("lang", lang === "en" ? "en" : lang === "ru" ? "ru" : "uz");

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", m.keywords);

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", m.description);
  }, [lang, company]);

  return null;
}
