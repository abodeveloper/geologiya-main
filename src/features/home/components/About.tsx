import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { get } from "lodash";
import { Award, FileText, Medal, Users } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";

export const About = () => {
  const { i18n, t } = useTranslation();
  const { data } = useCompanyInfo();

  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const stats = [
    {
      quantity: get(data, "stat_1", 0),
      suffix: "+",
      description: t("Ilmiy xodimlar"),
      icon: Award,
      key: "Award",
    },
    {
      quantity: get(data, "stat_2", 0),
      description: t("Loyiha va grantlar"),
      icon: FileText,
      key: "FileText",
    },
    {
      quantity: get(data, "stat_3", 0),
      description: t("Ilmiy nashrlar (yiliga)"),
      icon: Medal,
      key: "Medal",
    },
    {
      quantity: get(data, "stat_4", 0),
      suffix: "+",
      description: t("Talabalar soni"),
      icon: Users,
      key: "Users",
    },
  ];

  const headline =
    i18n.language === "uz"
      ? { label: "Biz haqimizda", title: "Raqamlarda", highlight: "bizning ta'sirimiz" }
      : i18n.language === "ru"
        ? { label: "О нас", title: "В цифрах", highlight: "наше влияние" }
        : { label: "About us", title: "In numbers", highlight: "our impact" };

  const description =
    i18n.language === "uz"
      ? "GGI – zamonaviy geologiya fanining oldingi qatorida: ilmiy izlanish, innovatsion yechimlar va amaliy natijalar. Har bir aʼzomiz – o‘z sohasida tajribali mutaxassis va tabiatning chuqur sirlarini ochishga qodir geolog."
      : i18n.language === "ru"
        ? "GGI – сильная команда в авангарде современной геологии, ориентированная на научные исследования, инновационные решения и практические результаты. Каждый из наших членов – опытный специалист и геолог, способный раскрывать глубокие тайны природы."
        : "GGI is a strong team at the forefront of modern geological science, focused on research, innovation and practical results. Each of our members is an experienced specialist and geologist capable of revealing the deep secrets of nature.";

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 overflow-hidden"
      ref={ref}
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="space-y-16 md:space-y-20">
          {/* Header */}
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

          {/* Stats — modern bento-style grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Fade
                  key={stat.key}
                  triggerOnce
                  delay={index * 100}
                  duration={500}
                  direction="up"
                >
                  <div
                    className="group relative rounded-2xl border border-border/60 bg-card/90 backdrop-blur-sm
                      p-5 md:p-6 transition-all duration-300 ease-out
                      hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                  >
                    {/* Accent corner */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-2xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden
                    />

                    <div className="relative flex flex-col gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums tracking-tight">
                        {inView ? (
                          <CountUp
                            start={0}
                            end={stat.quantity}
                            duration={2}
                            suffix={stat.suffix || ""}
                            separator=","
                            useEasing
                          />
                        ) : (
                          "0"
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground font-medium leading-snug">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
