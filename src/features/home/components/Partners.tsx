"use client";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { localized } from "@/i18n";
import { ExternalLink } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";

// Types
export interface Partner {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  image: string;
  link: string;
}

interface Props {
  data: Partner[];
}

// === HAMKOR KARTASI (ALOHIDA KOMPONENT) ===
// Qayta ishlatish oson bo'lishi uchun ajratib oldik
const PartnerCard = ({ item }: { item: Partner }) => {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block outline-none mx-4" // mx-4 oradagi masofa uchun
    >
      <Card
        className="
          w-[280px] h-[200px] flex flex-col justify-between
          bg-card border-border 
          hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5
          transition-all duration-300 ease-in-out
          cursor-pointer overflow-hidden
        "
      >
        {/* LOGO CONTAINER */}
        <div
          className="
            w-full h-32 relative
            flex items-center justify-center p-6
            bg-muted/30 group-hover:bg-muted/50
            transition-colors duration-300
          "
        >
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink className="w-4 h-4 text-primary/60" />
          </div>

          <img
            src={`${import.meta.env.VITE_API_URL}${item.image}`}
            alt={localized(item, "title")}
            className="
              w-auto h-full max-h-16 max-w-full
              object-contain
              filter grayscale opacity-70
              group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110
              transition-all duration-500 ease-out
              mix-blend-multiply dark:mix-blend-normal
            "
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="w-full p-3 border-t border-border/50 bg-card flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-10 w-full flex items-center justify-center">
                  <h3
                    className="
                    font-medium text-sm text-foreground text-center
                    group-hover:text-primary transition-colors 
                    line-clamp-2 leading-tight
                  "
                  >
                    {localized(item, "title")}
                  </h3>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{localized(item, "title")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* URL */}
          <p className="text-[10px] text-muted-foreground mt-1 truncate opacity-60 group-hover:opacity-100 transition-opacity max-w-full">
            {item.link ? new URL(item.link).hostname.replace("www.", "") : ""}
          </p>
        </div>
      </Card>
    </a>
  );
};

export const Partners = ({ data }: Props) => {
  const { i18n } = useTranslation();

  // Animatsiya ishlashi uchun ma'lumotni 2 barobar ko'paytiramiz (loop uchun)
  const doubleData = [...data, ...data];

  return (
    <section className="bg-background py-16 md:py-24 border-t border-border overflow-hidden">
      {/* CSS Animatsiya uslubi (Agar tailwind configga qo'shmagan bo'lsangiz) */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        /* Hover bo'lganda to'xtash */
        .pause-on-hover:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container max-w-5xl mx-auto px-4 md:px-0 mb-12 text-center space-y-4">
        <div className="space-y-6">
          <Fade
            delay={300}
            duration={1000}
            triggerOnce
            fraction={0.5}
            direction="up"
            cascade
            damping={0.3}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              {i18n.language === "uz" ? (
                <>
                  Bizning{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    hamkorlar
                  </span>
                </>
              ) : i18n.language === "ru" ? (
                <>
                  Наши{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    партнеры
                  </span>
                </>
              ) : (
                <>
                  Our{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    partners
                  </span>
                </>
              )}
            </h2>
          </Fade>
        </div>
      </div>

      {/* === MARQUEE SECTION === */}
      <div className="relative w-full pause-on-hover">
        {/* Chap va O'ng tomonlarda "Fade" effekti (chiroyli ko'rinish uchun) */}
        <div className="absolute left-0 top-0 bottom-0 w-10 md:w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 md:w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        {/* ROW 1: Chapga yuradi */}
        <div className="flex w-max animate-scroll">
          {doubleData.map((item, index) => (
            <PartnerCard key={`${item.id}-row1-${index}`} item={item} />
          ))}
        </div>

        {/* ROW 2: O'ngga yuradi (Ixtiyoriy - agar hamkorlar ko'p bo'lsa yoqing) */}
        {/* <div className="flex w-max animate-scroll mt-8" style={{ animationDirection: 'reverse' }}>
          {doubleData.map((item, index) => (
             <PartnerCard key={`${item.id}-row2-${index}`} item={item} />
          ))}
        </div> 
        */}
      </div>
    </section>
  );
};
