"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NewsCard } from "./components/NewsCard";
import type { PostItem } from "@/features/dynamic-page/types";
import { localized } from "@/i18n";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { get } from "lodash";
import { ArrowLeft, CalendarDays, ChevronRight, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getNewsById } from "./api/news";

const NewsDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Carousel State
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const itemId = parseInt(id || "0", 10);

  const dateLocales: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = dateLocales[i18n.language] || "uz-UZ";

  const plugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
  });

  // --- API CALLS ---
  // const { data: lastNews } = useQuery({
  //   queryKey: ["last-news"],
  //   queryFn: () => getLastNews(),
  // });

  const {
    data: news,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["news", itemId],
    queryFn: () => getNewsById(itemId),
    enabled: !!itemId && itemId > 0,
  });

  const lastNews = useMemo(() => get(news, "last_posts", []), [news]);

  // Carousel Pagination Logic
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Scroll to top when ID changes (Sidebardagi yangilik bosilganda tepaga otish uchun)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !news) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <ErrorMessage
          title={t("Sahifa yuklanmadi")}
          message={t("Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.")}
        />
      </div>
    );
  }

  const images =
    news.images && news.images.length > 0
      ? news.images
      : news.image
        ? [news.image]
        : [];

  // Hozir o'qilayotgan yangilikni sidebar ro'yxatidan olib tashlash
  const filteredLastNews = lastNews?.filter((item: any) => item.id !== itemId);

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container max-w-5xl mx-auto px-4 md:px-0">
        {/* Navigation Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            className="group"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t("Orqaga qaytish")}
          </Button>
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <Fade
              triggerOnce
              direction="up"
              cascade
              damping={0.2}
              duration={800}
            >
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-md">
                    {news.type === "news" ? t("Yangilik") : t("E'lon")}
                  </Badge>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(news.published_date).toLocaleDateString(
                      currentLocale,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(news.published_date).toLocaleTimeString(
                      currentLocale,
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                  {localized(news, "title")}
                </h1>
              </div>

              {/* Carousel */}
              {images.length > 0 && (
                <div className="relative w-full overflow-hidden rounded-xl border border-border/50 shadow-sm bg-muted/30">
                  <Carousel
                    setApi={setApi}
                    plugins={[plugin]}
                    opts={{ loop: true }}
                    onMouseEnter={() => plugin.stop()}
                    onMouseLeave={() => plugin.reset()}
                    className="w-full"
                  >
                    <CarouselContent>
                      {images.map((imgUrl, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video w-full overflow-hidden">
                            <img
                              src={`${imgUrl.image}`}
                              alt={`${localized(news, "title")}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-4 bg-background/50 hover:bg-background border-none backdrop-blur-sm" />
                        <CarouselNext className="absolute right-4 bg-background/50 hover:bg-background border-none backdrop-blur-sm" />
                      </>
                    )}
                  </Carousel>
                  {/* Dots */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => api?.scrollTo(index)}
                          className={`transition-all duration-300 rounded-full h-1.5 ${
                            current === index
                              ? "w-6 bg-white"
                              : "w-1.5 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content HTML */}
              <div
                className="
                  prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-img:rounded-xl prose-img:shadow-sm
                  prose-a:text-primary prose-a:font-medium
                "
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: localized(news, "description"),
                  }}
                />
              </div>
            </Fade>
          </div>

          {/* RIGHT COLUMN: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full inline-block"></span>
                {news.type === "news"
                  ? t("So'nggi yangiliklar")
                  : t("So'nggi e'lonlar")}
              </h3>

              <div className="flex flex-col gap-4">
                {filteredLastNews?.slice(0, 5).map((item: PostItem) => (
                  <Fade
                    key={item.id}
                    triggerOnce
                    direction="right"
                    duration={500}
                  >
                    <NewsCard
                      item={item}
                      navigate={navigate}
                      locale={currentLocale}
                      size="sm"
                    />
                  </Fade>
                ))}

                <Button
                  variant="link"
                  className="w-full justify-end mt-2"
                  onClick={() =>
                    navigate(
                      news.type === "news"
                        ? "/news?type=news"
                        : "/news?type=announcement",
                    )
                  }
                >
                  {news.type === "news"
                    ? t("Barcha yangiliklar")
                    : t("Barcha e'lonlar")}{" "}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
