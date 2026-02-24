import { localized } from "@/i18n";
import DynamicIcon from "@/shared/components/atoms/dynamic-icon/DynamicIcon";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface ScientificDirection {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  status: boolean;
  type: string;
  slug: string;
  menu: unknown;
  logo: string;
  position: number;
  sub_title_uz: string;
  sub_title_ru: string;
  sub_title_en: string;
}

interface Props {
  data: ScientificDirection[];
}

export const HowItWorks = ({ data }: Props) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const headline =
    i18n.language === "uz"
      ? { label: "Yo'nalishlar", title: "Ilmiy", highlight: "yo'nalishlar" }
      : i18n.language === "ru"
        ? { label: "Направления", title: "Научные", highlight: "направления" }
        : { label: "Directions", title: "Scientific", highlight: "directions" };

  const description =
    i18n.language === "uz"
      ? "Yer fanlari sohasidagi turli fanlararo tadqiqot yo'nalishlarimiz."
      : i18n.language === "ru"
        ? "Научные направления в области земных наук."
        : "Scientific directions in the field of earth sciences.";

  return (
    <section id="howItWorks" className="relative py-20 md:py-28 overflow-hidden">
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

          {/* Kartochkalar — toza, ko‘tarilgan soya, markazlashtirilgan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {data?.map((item: ScientificDirection, index: number) => (
              <Fade
                key={item.id}
                triggerOnce
                delay={index * 60}
                duration={400}
                direction="up"
              >
                <button
                  type="button"
                  onClick={() => navigate("/scientific-directions/" + item.slug)}
                  className="group w-full text-left rounded-2xl p-5 md:p-6 bg-card/70 dark:bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:bg-card transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <DynamicIcon name={item.logo} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {localized(item, "title")}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {localized(item, "sub_title")}
                      </p>
                    </div>
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted/80 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all duration-300" aria-hidden>
                      →
                    </span>
                  </div>
                </button>
              </Fade>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
