"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localized } from "@/i18n";
import DynamicIcon from "@/shared/components/atoms/dynamic-icon/DynamicIcon";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface PostgraduateEducation {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  sub_title_uz: string;
  sub_title_ru: string;
  sub_title_en: string;
  direction_uz: string;
  direction_ru: string;
  direction_en: string;
  duration_uz: string;
  duration_ru: string;
  duration_en: string;
  logo: string;
  status: boolean;
  slug: string;
}

interface Props {
  data: PostgraduateEducation[];
}

export const PostgraduatePrograms = ({ data }: Props) => {

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  // Animatsiya yo'nalishlari
  const directions = ["left", "up", "right", "down"];

  // Responsive Grid Logic:
  // Agar 4 ta element bo'lsa:
  // - md (planshet): 2 ta
  // - lg (noutbuk): 2 ta (2x2 chiroyli turishi uchun, 3 ta sig'may qolishi mumkin)
  // - xl (katta ekran): 4 ta
  // Agar 3 ta (yoki boshqa) bo'lsa:
  // - md: 2 ta
  // - lg: 3 ta
  const gridClassName =
    data?.length === 4
      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center";

  return (
    <section
      id="postgraduate"
      className="container max-w-5xl mx-auto px-4 md:px-0 py-12 md:py-28"
    >
      <div className="space-y-16">
        {/* Title */}
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
                  Oliy ta'limdan{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    keyingi ta'lim
                  </span>
                </>
              ) : i18n.language === "ru" ? (
                <>
                  Послевузовское{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    образование
                  </span>
                </>
              ) : (
                <>
                  Postgraduate{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    Education
                  </span>
                </>
              )}
            </h2>
            <p className="text-xl text-muted-foreground text-center font-light">
              {i18n.language === "uz"
                ? "Ilmiy faoliyatingizni yangi bosqichga olib chiqing – PhD, DSc va magistratura dasturlarimiz orqali"
                : i18n.language === "ru"
                ? "Поднимите свою научную деятельность на новый уровень с помощью наших программ PhD, DSc и магистратуры"
                : "Take your academic career to the next level with our PhD, DSc, and Master's programs"}
            </p>
          </Fade>
        </div>

        {/* Cards Grid - Dinamik klass ishlatildi */}
        <div className={`grid ${gridClassName}`}>
          {data?.map((item, index) => {
            // Animatsiya direction mantig'i:
            // 4 ta bo'lsa: left, up, right, down
            // 3 ta bo'lsa: left, up, right (down ishlatilmaydi, bu to'g'ri)
            const currentDirection = directions[index % 4] as
              | "left"
              | "up"
              | "right"
              | "down";

            return (
              <Fade
                key={item.id}
                delay={200 + index * 100}
                duration={900}
                triggerOnce
                direction={currentDirection}
                damping={0.4}
                className="h-full" // Fade konteyneri to'liq balandlikda bo'lishi uchun
              >
                <Card
                  className={`
                    relative overflow-hidden rounded-2xl 
                    bg-gradient-to-b from-muted/60 to-background 
                    border border-transparent 
                    hover:transform hover:-translate-y-3
                    group h-full text-left
                    transition-all duration-500
                    flex flex-col
                  `}
                >
                  {/* Spinning Border Effect */}
                  <div className="absolute inset-0 rounded-2xl p-[2px] bg-[conic-gradient(from_0deg,theme(colors.primary)_0%,theme(colors.primary/60)_25%,theme(colors.primary/30)_50%,theme(colors.primary/60)_75%,theme(colors.primary)_100%)] animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-1300 pointer-events-none">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-b from-muted/60 to-background" />
                  </div>

                  <CardHeader className="relative z-10">
                    <CardTitle className="flex flex-col gap-4 items-start text-lg font-semibold">
                      <div
                        className="p-3 rounded-full bg-primary/10 text-primary 
                                   group-hover:bg-primary group-hover:text-background 
                                   transition-all duration-300"
                      >
                        <DynamicIcon
                          name={item.logo}
                          className="w-8 h-8 transition-colors duration-300"
                        />
                      </div>
                      {localized(item, "title")}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10 px-6 pb-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3 mb-5">
                      <p className="text-sm text-muted-foreground">
                        <strong>{t("Yo'nalish") || "Yo'nalish"}:</strong>{" "}
                        {localized(item, "direction")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>{t("Davomiyligi") || "Davomiyligi"}:</strong>{" "}
                        {localized(item, "duration")}
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed line-clamp-3">
                        {localized(item, "sub_title")}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        navigate(`/postgraduate-educations/${item.slug}`)
                      }
                    >
                      {t("Batafsil") || "Batafsil ma'lumot"}
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PostgraduatePrograms;
