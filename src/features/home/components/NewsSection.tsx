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

// Tab turlari uchun union type
type FilterType = "all" | "news" | "announcement";

export const NewsSection = ({ data }: Props) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  // 1. State: Qaysi tab tanlangani
  const [filter, setFilter] = useState<FilterType>("all");

  const dateLocales: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = dateLocales[i18n.language] || "uz-UZ";

  // 2. Tabga qarab ma'lumotni tanlash
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

  // 3. Tabga qarab tugma matnini tanlash
  const getButtonText = () => {
    if (filter === "news") return t("Barcha yangiliklarni ko'rish");
    if (filter === "announcement") return t("Barcha e'lonlarni ko'rish");
    return t("Barchasini ko'rish");
  };

  const currentItems = getDisplayData();

  return (
    <section className="container max-w-5xl mx-auto px-4 md:px-0 text-center py-12 md:py-28">
      <div className="space-y-10">
        <div className="space-y-6">
          <Fade
            delay={300}
            duration={1000}
            triggerOnce
            direction="up"
            cascade
            damping={0.3}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              {i18n.language === "uz" ? (
                <>
                  Yangiliklar va{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    E'lonlar
                  </span>
                </>
              ) : i18n.language === "ru" ? (
                <>
                  Новости и{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    объявления
                  </span>
                </>
              ) : (
                <>
                  News and{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    Announcements
                  </span>
                </>
              )}
            </h2>
            <p className="text-xl text-muted-foreground text-center font-light">
              {t(
                "GGI dagi so'nggi yangiliklar, ilmiy yutuqlar va tadbirlardan xabardor bo'ling",
              )}
            </p>
          </Fade>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap justify-center">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList>
              <TabsTrigger value="all">{t("Barchasi")}</TabsTrigger>
              <TabsTrigger value="news">{t("Yangiliklar")}</TabsTrigger>
              <TabsTrigger value="announcement">{t("E'lonlar")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item, idx) => (
            <Fade
              key={`${filter}-${item.id}`}
              delay={100 + idx * 50}
              duration={800}
              triggerOnce
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

        {/* DYNAMIC ACTION BUTTON */}
        <Fade delay={400} duration={1000} triggerOnce direction="up">
          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              className="group"
              onClick={() => navigate(`/news?type=${filter}`)}
            >
              {getButtonText()}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default NewsSection;
