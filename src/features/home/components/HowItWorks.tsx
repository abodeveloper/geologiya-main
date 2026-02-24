import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  logo: string; // DynamicIcon uchun nom (masalan: "Globe", "Cloud")
  position: number;
  sub_title_uz: string;
  sub_title_ru: string;
  sub_title_en: string;
}

interface Props {
  data: ScientificDirection[];
}

// 1. Har bir kartochka uchun index bo'yicha maxsus stillar va yo'nalishlar
const cardStyles = [
  {
    // 1-element (Index 0)
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    direction: "left",
  },
  {
    // 2-element (Index 1)
    colorClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-100 dark:bg-sky-900/20",
    direction: "down", // Yuqoridan pastga tushadi
  },
  {
    // 3-element (Index 2)
    colorClass: "text-indigo-500 dark:text-indigo-400",
    bgClass: "bg-indigo-100 dark:bg-indigo-900/20",
    direction: "right",
  },
  {
    // 4-element (Index 3)
    colorClass: "text-amber-500 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900/20",
    direction: "left",
  },
  {
    // 5-element (Index 4)
    colorClass: "text-blue-500 dark:text-blue-300",
    bgClass: "bg-blue-100 dark:bg-blue-900/20",
    direction: "up", // Pastdan yuqoriga
  },
  {
    // 6-element (Index 5)
    colorClass: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-100 dark:bg-green-900/20",
    direction: "right",
  },
];

export const HowItWorks = ({ data }: Props) => {
  // 2. HOOK CHAQRILDI
  // Bu hook til o'zgarganda komponentni re-render bo'lishga majburlaydi
  const { i18n } = useTranslation();

  const navigate = useNavigate();

  return (
    <section id="howItWorks" className="bg-muted text-center py-12 md:py-28">
      <div className="container max-w-5xl mx-auto px-4 md:px-0">
        <div className="space-y-16">
          {/* Title Section */}
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
                    Ilmiy{" "}
                    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                      yo'nalishlar
                    </span>
                  </>
                ) : i18n.language === "ru" ? (
                  <>
                    Научные{" "}
                    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                      направления
                    </span>
                  </>
                ) : (
                  <>
                    Scientific{" "}
                    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                      directions
                    </span>
                  </>
                )}
              </h2>
              <p className="text-xl text-muted-foreground text-center font-light">
                {i18n.language === "uz"
                  ? "Yer fanlari sohasidagi turli fanlararo tadqiqot yo'nalishlarimiz"
                  : i18n.language === "ru"
                  ? "Научные направления в области земных наук"
                  : "Scientific directions in the field of earth sciences"}
              </p>
            </Fade>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.map((item: ScientificDirection, index: number) => {
              // Index orqali kerakli stilni olamiz.
              // Agar data 6 tadan ko'p bo'lsa ham xato bermasligi uchun % (qoldiq) ishlatildi.
              const style = cardStyles[index % cardStyles.length];

              return (
                <Fade
                  key={item.id}
                  delay={200 + index * 100} // Har biriga ozgina kechikish qo'shish
                  duration={1000}
                  triggerOnce
                  direction={style.direction as "left" | "right" | "up" | "down"}
                >
                  <Card
                    className={`
                      relative overflow-hidden rounded-2xl 
                      bg-background/95 border border-border/40 backdrop-blur-sm
                      transition-all duration-500 ease-out
                      hover:scale-[1.02] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)]
                      hover:border-primary/40
                      group h-full
                      cursor-pointer
                    `}
                    onClick={() =>
                      navigate("/scientific-directions/" + item.slug)
                    }
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <CardHeader>
                      <CardTitle className="grid gap-4 place-items-center text-lg font-semibold">
                        {/* Dynamic Stylar shu yerda qo'llaniladi */}
                        <div
                          className={`
                            p-4 rounded-xl 
                            ${style.bgClass} ${style.colorClass}
                            transition-all duration-500 
                            group-hover:rotate-6 group-hover:scale-110
                          `}
                        >
                          <DynamicIcon name={item.logo} className="w-8 h-8" />
                        </div>
                        {localized(item, "title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center px-6 pb-6">
                      <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed line-clamp-3">
                        {localized(item, "sub_title")}
                      </p>
                    </CardContent>
                  </Card>
                </Fade>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
