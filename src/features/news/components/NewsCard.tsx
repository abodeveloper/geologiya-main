import { Badge } from "@/components/ui/badge";
import { getAbsoluteUrl } from "@/features/dynamic-page/utils";
import { localized } from "@/i18n";
import { formatDateLocalized } from "@/lib/utils";
import type { PostItem } from "@/features/dynamic-page/types";
import { CalendarDays, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface NewsCardProps {
  item: PostItem;
  navigate: (path: string) => void;
  locale: string;
  size?: "default" | "sm";
}

const localeToLang = (locale: string) =>
  locale.startsWith("uz") ? "uz" : locale.startsWith("ru") ? "ru" : "en";

export function NewsCard({ item, navigate, locale, size = "default" }: NewsCardProps) {
  const { t } = useTranslation();
  const imageHeightClass = size === "sm" ? "h-40" : "h-56";
  const lang = localeToLang(locale);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/news/${item.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/news/${item.id}`);
        }
      }}
      className="group flex h-full flex-col cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      {/* Rasm */}
      <div className={`relative ${imageHeightClass} shrink-0 overflow-hidden`}>
        <img
          src={getAbsoluteUrl(item.image ?? "")}
          alt={localized(item, "title")}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        {item.type != null && item.type !== "" && (
          <span className="absolute left-3 top-3 z-10">
            <Badge
              variant={item.type === "news" ? "default" : "secondary"}
              className="text-xs font-medium shadow-sm"
            >
              {item.type === "news"
                ? t("Yangilik")
                : item.type === "desertion"
                  ? t("Desertatsiya e'loni")
                  : t("E'lon")}
            </Badge>
          </span>
        )}
      </div>

      {/* Matn qismi — pastki qator har doim bir xil joyda */}
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <h3
          className="line-clamp-2 min-h-[2.5rem] shrink-0 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
          title={localized(item, "title")}
        >
          {localized(item, "title")}
        </h3>

        <div className="mt-auto flex shrink-0 flex-wrap items-center justify-between gap-3 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 opacity-70" />
            {item.published_date
              ? formatDateLocalized(item.published_date, lang)
              : ""}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary">
            {t("Batafsil o'qish")}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
