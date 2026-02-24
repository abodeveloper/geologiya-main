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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// TypeScript interfeyslari
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

  const {t} = useTranslation();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // API URL ni aniqlash (Next.js yoki Vite ga moslashuvchan)
  const API_URL =
     import.meta.env?.VITE_API_URL || "";

  // Autoplay sozlamalari
  const plugin = Autoplay({
    delay: 6000,
    stopOnInteraction: true,
  });

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

  // Agar ma'lumot kelmasa yoki bo'sh bo'lsa, hech narsa qaytarmaslik
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[calc(100vh-70px)] overflow-hidden group">
      <Carousel
        setApi={setApi}
        plugins={[plugin]}
        opts={{
          loop: true,
        }}
        onMouseEnter={() => plugin.stop()}
        onMouseLeave={() => plugin.reset()}
        className="w-full h-full"
      >
        <CarouselContent className="h-full ml-0">
          {data.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="h-[calc(100vh-70px)] p-0 relative pl-0"
            >
              <div className="relative w-full h-full">
                <img
                  src={`${API_URL}${slide.image}`}
                  alt={localized(slide, "title")} // Alt textni ham mahalliylashtirdik
                  className="w-full h-full object-cover"
                  loading="lazy" // Rasm yuklanishini optimizatsiya qilish
                />
                {/* Qoramtir fon (Overlay) */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="text-white max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                      {localized(slide, "title")}
                    </h1>
                    <p className="text-base sm:text-lg md:text-2xl opacity-90 font-light max-w-2xl mx-auto">
                      {localized(slide, "description")}
                    </p>

                    {/* Tugma kerak bo'lsa kommentdan ochib qo'yishingiz mumkin */}
                    <Button
                      size="lg"
                      className="mt-4"
                    >
                      <a
                        href={slide?.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        {t("Batafsil")}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons - Mobilkada yashirin (hidden), planshet va desktopda ko'rinadi (md:flex) */}
        <CarouselPrevious className="hidden md:flex absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-sm z-10" />
        <CarouselNext className="hidden md:flex absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/30 text-white border-none backdrop-blur-sm z-10" />
      </Carousel>

      {/* Dots (Pagination) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`transition-all duration-300 rounded-full h-2 ${
              current === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
