import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "@/features/news/components/NewsCard";
import type { PostItem } from "@/features/dynamic-page/types";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface NewsItem {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  image?: string;
  pages: number[];
  published_date: string;
  status: boolean;
  type: string;
}

interface Props {
  data: {
    latest_news: NewsItem[];
    latest_posts: NewsItem[];
    latest_announcements: NewsItem[];
  };
}

type FilterType = "all" | "news" | "announcement";

export const NewsSection = ({ data }: Props) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>("all");

  const dateLocales: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = dateLocales[i18n.language] || "uz-UZ";

  const getDisplayData = () => {
    switch (filter) {
      case "news":
        return data?.latest_news || [];
      case "announcement":
        return data?.latest_announcements || [];
      default:
        return data?.latest_posts || [];
    }
  };

  const getButtonText = () => {
    if (filter === "news") return t("Barcha yangiliklarni ko'rish");
    if (filter === "announcement") return t("Barcha e'lonlarni ko'rish");
    return t("Barchasini ko'rish");
  };

  const headline =
    i18n.language === "uz"
      ? { label: "Yangiliklar", title: "Yangiliklar va", highlight: "e'lonlar" }
      : i18n.language === "ru"
        ? { label: "Новости", title: "Новости и", highlight: "объявления" }
        : { label: "News", title: "News and", highlight: "announcements" };

  const description =
    i18n.language === "uz"
      ? "GGI dagi so'nggi yangiliklar, ilmiy yutuqlar va tadbirlardan xabardor bo'ling."
      : i18n.language === "ru"
        ? "Будьте в курсе последних новостей, научных достижений и мероприятий GGI."
        : "Stay updated with the latest news, research and events at GGI.";

  const currentItems = getDisplayData();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="space-y-14 md:space-y-16">
          {/* Header — About ga mos */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Fade triggerOnce duration={600} direction="up" cascade damping={0.4}>
              <p className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-primary">
                {headline.label}
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                {headline.title}{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-accent text-transparent bg-clip-text">
                  {headline.highlight}
                </span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {description}
              </p>
            </Fade>
          </div>

          {/* Tabs — zamonaviy */}
          <Fade triggerOnce duration={500} direction="up">
            <div className="flex flex-wrap justify-center">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <TabsList className="h-12 p-1.5 rounded-xl bg-muted/50 border border-border/60">
                  <TabsTrigger
                    value="all"
                    className="rounded-lg px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {t("Barchasi")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="news"
                    className="rounded-lg px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {t("Yangiliklar")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="announcement"
                    className="rounded-lg px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {t("E'lonlar")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Fade>

          {/* Kartochkalar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {currentItems.map((item, idx) => (
              <Fade
                key={`${filter}-${item.id}`}
                triggerOnce
                delay={idx * 80}
                duration={500}
                direction="up"
              >
                <NewsCard
                  item={item as unknown as PostItem}
                  navigate={navigate}
                  locale={currentLocale}
                />
              </Fade>
            ))}
          </div>

          {/* Tugma */}
          <Fade triggerOnce duration={500} direction="up">
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 gap-2 group"
                onClick={() => navigate(`/news?type=${filter}`)}
              >
                {getButtonText()}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
