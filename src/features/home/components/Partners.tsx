"use client";

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

const PartnerCard = ({ item }: { item: Partner }) => {
  let hostname = "";
  try {
    if (item.link) hostname = new URL(item.link).hostname.replace("www.", "");
  } catch {
    hostname = "";
  }

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block outline-none mx-3 md:mx-4 shrink-0"
    >
      <div className="w-[240px] md:w-[260px] h-[180px] rounded-xl p-6 flex flex-col items-center justify-center gap-4 bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-300">
        <div className="relative flex items-center justify-center h-14 w-full shrink-0">
          <img
            src={`${import.meta.env.VITE_API_URL || ""}${item.image}`}
            alt={localized(item, "title")}
            className="max-h-12 md:max-h-14 w-auto object-contain filter grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply dark:mix-blend-normal"
          />
          <span className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground group-hover:text-primary">
            <ExternalLink className="w-4 h-4" />
          </span>
        </div>
        <div className="w-full text-center min-h-0 flex-1 flex flex-col justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {localized(item, "title")}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{localized(item, "title")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {hostname ? (
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {hostname}
            </p>
          ) : null}
        </div>
      </div>
    </a>
  );
};

export const Partners = ({ data }: Props) => {
  const { i18n } = useTranslation();
  const doubleData = [...data, ...data];

  const headline =
    i18n.language === "uz"
      ? { label: "Hamkorlar", title: "Bizning", highlight: "hamkorlar" }
      : i18n.language === "ru"
        ? { label: "Партнеры", title: "Наши", highlight: "партнеры" }
        : { label: "Partners", title: "Our", highlight: "partners" };

  const description =
    i18n.language === "uz"
      ? "Xalqaro va mahalliy hamkorlarimiz bilan birga ishlaymiz."
      : i18n.language === "ru"
        ? "Мы работаем с международными и местными партнерами."
        : "We work with international and local partners.";

  return (
    <>
      <section
        id="partners"
        className="relative py-20 md:py-28 overflow-hidden border-t border-border/50"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 20s linear infinite;
            }
            .pause-on-hover:hover .animate-scroll {
              animation-play-state: paused;
            }
          `,
          }}
        />

        <div className="container relative max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Fade
              triggerOnce
              duration={600}
              direction="up"
              cascade
              damping={0.4}
            >
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
        </div>
        {/* Pastda — marquee (carousel emas, scroll animatsiya) */}
        <div className="relative w-full pause-on-hover mt-14 md:mt-16">
          <div className="absolute left-0 top-0 bottom-0 w-10 md:w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 md:w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          <div className="flex w-max animate-scroll">
            {doubleData.map((item, index) => (
              <PartnerCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
