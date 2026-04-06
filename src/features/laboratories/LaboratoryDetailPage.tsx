"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { localized } from "@/i18n";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeCard } from "@/features/dynamic-page/components/EmployeeCard";
import { EntityDetailRelatedTabs } from "@/features/dynamic-page/components/EntityDetailRelatedTabs";
import type { Employee } from "@/features/dynamic-page/types";
import { getLaboratoryById } from "./api/laboratory";
import { getImageUrl } from "@/lib/utils";

const LaboratoryDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Carousel State
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const itemId = id;  

  // Autoplay Plugin
  const plugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
  });

  // API Request
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["laboratory", itemId],
    queryFn: () => getLaboratoryById(itemId),
    enabled: !!itemId,
  });

  // Carousel Pagination Logic (HeroCarousel dan olindi)
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !items) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <ErrorMessage
          title={t("Sahifa yuklanmadi")}
          message={t("Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.")}
        />
      </div>
    );
  }

  // Rasmlarni to'g'irlash (Array qilib olish)
  const images =
    items.images && items.images.length > 0
      ? items.images
      : items.image
      ? [items.image]
      : [];

  const hasEmployeesSidebar =
    !!items.employees && items.employees.length > 0;

  return (
    <div className="min-h-screen bg-background py-10">
      <div
        className={`container mx-auto px-4 md:px-6 ${hasEmployeesSidebar ? "" : "max-w-5xl"}`}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {hasEmployeesSidebar && (
            <aside className="order-2 lg:order-1 w-full lg:w-[450px] shrink-0 lg:sticky lg:top-24 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full inline-block" />
                {t("Xodimlar")}
              </h3>
              {(items.employees as Employee[]).map((emp) => (
                <EmployeeCard key={emp.id} emp={emp} navigate={navigate} />
              ))}
            </aside>
          )}

          <article
            className={`order-1 lg:order-2 w-full ${hasEmployeesSidebar ? "lg:flex-1 lg:min-w-0" : ""}`}
          >
            {/* Navigation */}
            <Fade triggerOnce direction="down" duration={600}>
              <div className="flex items-center justify-start mb-6">
                <Button
                  variant="outline"
                  className="group"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  {t("Orqaga qaytish")}
                </Button>
              </div>
            </Fade>

            {/* Header Section (Title & Meta) */}
            <Fade triggerOnce direction="up" cascade damping={0.2} duration={800}>
              <div className="space-y-6 mb-8">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-foreground">
                  {localized(items, "title")}
                </h1>
              </div>

              {/* --- HERO STYLE CAROUSEL SECTION --- */}
              {images?.length > 0 && (
                <div className="mb-12 relative w-full overflow-hidden rounded-2xl shadow-2xl group">
                  <Carousel
                    setApi={setApi}
                    plugins={[plugin]}
                    opts={{
                      loop: true,
                    }}
                    onMouseEnter={() => plugin.stop()}
                    onMouseLeave={() => plugin.reset()}
                    className="w-full"
                  >
                    <CarouselContent>
                      {images.map((imgUrl, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            <img
                              src={getImageUrl(typeof imgUrl === "string" ? imgUrl : imgUrl.image)}
                              alt={`${localized(items, "title")} - ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-sm z-10" />
                        <CarouselNext className="absolute right-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-sm z-10" />
                      </>
                    )}
                  </Carousel>

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => api?.scrollTo(index)}
                          className={`transition-all duration-300 rounded-full h-1.5 md:h-2 shadow-sm ${
                            current === index
                              ? "w-6 md:w-8 bg-white"
                              : "w-1.5 md:w-2 bg-white/50 hover:bg-white/80"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Fade>

            <Fade triggerOnce delay={300} duration={800}>
              <div
                className="
            prose prose-lg dark:prose-invert 
            max-w-none 
            prose-headings:font-bold prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:w-full
            prose-strong:text-foreground
            prose-ul:list-disc prose-ul:pl-6
            prose-li:marker:text-primary
          "
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: localized(items, "description"),
                  }}
                />
              </div>
            </Fade>

            <EntityDetailRelatedTabs
              employees={hasEmployeesSidebar ? undefined : items.employees}
              posts={items.posts}
              files={items.files}
              images={items.images}
            />
          </article>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryDetailPage;
