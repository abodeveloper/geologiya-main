import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAbsoluteUrl } from "@/features/dynamic-page/utils";
import { localized } from "@/i18n";
import { formatDateLocalized } from "@/lib/utils";
import type { PostItem } from "@/features/dynamic-page/types";
import { CalendarDays } from "lucide-react";
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
  const imageHeightClass = size === "sm" ? "h-36" : "h-52";
  const lang = localeToLang(locale);

  return (
    <Card
      onClick={() => navigate(`/news/${item.id}`)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/60 to-background border border-border/60 backdrop-blur-sm transition-all duration-500 ease-out hover:shadow-lg hover:border-primary/40 group flex h-full flex-col cursor-pointer"
    >
      <div className={`relative ${imageHeightClass} overflow-hidden rounded-t-2xl shrink-0`}>
        <img
          src={getAbsoluteUrl(item.image ?? "")}
          alt={localized(item, "title")}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {item.type != null && item.type !== "" && (
          <div className="absolute left-4 bottom-4 z-10">
            <Badge variant={item.type === "news" ? "default" : "secondary"}>
              {item.type === "news"
                ? t("Yangilik")
                : item.type === "desertion"
                  ? t("Desertatsiya e'loni")
                  : t("E'lon")}
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="shrink-0 text-left px-6 pt-4 pb-2">
          <CardTitle
            className="text-lg font-semibold line-clamp-2"
            title={localized(item, "title")}
          >
            {localized(item, "title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto shrink-0 text-left px-6 pb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-3 justify-between w-full">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 opacity-80" />
                <span>
                  {item.published_date
                    ? formatDateLocalized(item.published_date, lang)
                    : ""}
                </span>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/news/${item.id}`);
                }}
              >
                {t("Batafsil o'qish")}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
