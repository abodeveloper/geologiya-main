import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localized } from "@/i18n";
import { getAbsoluteUrl } from "@/features/dynamic-page/utils";
import type { PostItem } from "@/features/dynamic-page/types";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface NewsCardProps {
  item: PostItem;
  navigate: (path: string) => void;
  locale: string;
  size?: "default" | "sm";
}

export function NewsCard({ item, navigate, locale, size = "default" }: NewsCardProps) {
  const { t } = useTranslation();
  const imageHeightClass = size === "sm" ? "h-36" : "h-52";

  return (
    <Card
      onClick={() => navigate(`/news/${item.id}`)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/60 to-background border border-border/60 backdrop-blur-sm transition-all duration-500 ease-out hover:shadow-lg hover:border-primary/40 group flex flex-col cursor-pointer"
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
              {item.type === "news" ? t("Yangilik") : t("E'lon")}
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>

      <div className="flex flex-col flex-1">
        <CardHeader className="text-left px-6 pt-4 pb-2">
          <CardTitle
            className="text-lg font-semibold line-clamp-2"
            title={localized(item, "title")}
          >
            {localized(item, "title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-left px-6 pb-6 mt-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3 justify-between w-full">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 opacity-80" />
                <span>
                  {item.published_date
                    ? new Date(item.published_date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
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
