"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { localized } from "@/i18n";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface Slide {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  image: string;
  link: string;
}

interface HeroCarouselProps {
  data: Slide[];
}

export const HeroCarousel = ({ data }: HeroCarouselProps) => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const API_URL = import.meta.env?.VITE_API_URL || "";

  const plugin = Autoplay({
    delay: 6000,
    stopOnInteraction: true,
  });

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full h-[calc(100vh-60px)] overflow-hidden select-none">
      <Carousel
        setApi={setApi}
        plugins={[plugin]}
        opts={{ loop: true }}
        onMouseEnter={() => plugin.stop()}
        onMouseLeave={() => plugin.reset()}
        className="w-full h-full"
      >
        <CarouselContent className="h-full ml-0">
          {data.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="h-[calc(100vh-60px)] p-0 relative pl-0"
            >
              <div className="relative w-full h-full">
                <img
                  src={`${API_URL}${slide.image}`}
                  alt={localized(slide, "title")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="text-white max-w-4xl space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      {localized(slide, "title")}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
                      {localized(slide, "description")}
                    </p>
                    <div className="pt-2">
                      <Button
                        size="lg"
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                        asChild
                      >
                        <a
                          href={slide?.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          {t("Batafsil")}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute left-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md z-10 transition-colors" />
        <CarouselNext className="hidden md:flex absolute right-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md z-10 transition-colors" />
      </Carousel>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`transition-all duration-300 rounded-full h-2 ${
              current === index
                ? "w-8 bg-primary"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
