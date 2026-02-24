"use client";

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

  const headline =
    i18n.language === "uz"
      ? { label: "Ta'lim", title: "Oliy ta'limdan", highlight: "keyingi ta'lim" }
      : i18n.language === "ru"
        ? { label: "Образование", title: "Послевузовское", highlight: "образование" }
        : { label: "Education", title: "Postgraduate", highlight: "education" };

  const description =
    i18n.language === "uz"
      ? "Ilmiy faoliyatingizni yangi bosqichga olib chiqing – PhD, DSc va magistratura dasturlarimiz orqali."
      : i18n.language === "ru"
        ? "Поднимите свою научную деятельность на новый уровень с помощью наших программ PhD, DSc и магистратуры."
        : "Take your academic career to the next level with our PhD, DSc, and Master's programs.";

  return (
    <section id="postgraduate" className="relative py-20 md:py-28 overflow-hidden">
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

          {/* Ro'yxat — chap accent chiziq (HowItWorks kabi), kartochka yo'q */}
          <div className="space-y-0 max-w-3xl mx-auto">
            {data?.map((item, index) => (
              <Fade
                key={item.id}
                triggerOnce
                delay={index * 60}
                duration={400}
                direction="up"
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/postgraduate-educations/${item.slug}`)
                  }
                  className="group w-full text-left flex items-start gap-4 py-5 px-4 rounded-xl border-l-4 border-l-primary/30 hover:border-l-primary hover:bg-muted/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <DynamicIcon name={item.logo} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {localized(item, "title")}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground/90">
                        {t("Yo'nalish")}:
                      </span>{" "}
                      {localized(item, "direction")}
                      {" · "}
                      <span className="font-medium text-foreground/90">
                        {t("Davomiyligi")}:
                      </span>{" "}
                      {localized(item, "duration")}
                    </p>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed mt-1.5 line-clamp-2">
                      {localized(item, "sub_title")}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors mt-1.5"
                    aria-hidden
                  >
                    →
                  </span>
                </button>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostgraduatePrograms;
