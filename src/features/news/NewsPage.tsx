import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "./components/NewsCard";
import { cn } from "@/lib/utils";
import { Fade } from "react-awesome-reveal";
import { getNews } from "./api/news";

export const NewsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- 1. PARAMETRLAR ---
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentFilter = searchParams.get("type") || "all";

  // O'ZGARDI: Test qilish uchun 3 ta qildik
  const pageSize = 6;

  // --- 2. REACT QUERY ---
  const {
    data,
    isLoading,
    isError,
    isFetching, // <-- Bu orqa fonda so'rov ketayotganini bildiradi
  } = useQuery({
    // queryKey tarkibidagi narsa o'zgarsa, so'rov qayta ketadi
    queryKey: ["news", currentPage, currentFilter],

    queryFn: () =>
      getNews({
        page: currentPage,
        page_size: pageSize,
        type: currentFilter,
      }),

    // Sahifa almashganda eski ma'lumot turib turadi (sakrash bo'lmasligi uchun)
    placeholderData: keepPreviousData,

    // O'ZGARDI: staleTime ni olib tashladik, har doim yangi so'rov ketadi
    staleTime: 0,
  });

  const newsItems = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // --- HANDLERS ---
  const handleFilterChange = (type: string) => {
    setSearchParams({ type, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    // Agar hozirgi sahifa bilan bir xil bo'lsa, hech narsa qilmaymiz
    if (newPage === currentPage) return;

    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ type: currentFilter, page: newPage.toString() });
      // Sahifa tepasiga chiqish (ixtiyoriy)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const dateLocales: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = dateLocales[i18n.language] || "uz-UZ";

  return (
    <div className="min-h-screen bg-muted/5 pb-20 pt-12">
      <div className="container max-w-6xl mx-auto px-4 md:px-0">
        {/* HEADER */}
        <div className="space-y-6">
          <Fade
            delay={300}
            duration={1000}
            triggerOnce
            direction="up"
            cascade
            damping={0.3}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              {i18n.language === "uz" ? (
                <>
                  Yangiliklar va{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    E'lonlar
                  </span>
                </>
              ) : i18n.language === "ru" ? (
                <>
                  Новости и{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    объявления
                  </span>
                </>
              ) : (
                <>
                  News and{" "}
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    Announcements
                  </span>
                </>
              )}
            </h2>
            <p className="text-xl text-muted-foreground text-center font-light">
              {i18n.language === "uz"
                ? "GGI dagi so'nggi yangiliklar, ilmiy yutuqlar va tadbirlardan xabardor bo'ling"
                : i18n.language === "ru"
                ? "Будьте в курсе последних новостей, научных достижений и событий GGI"
                : "Stay informed about the latest news, scientific achievements, and events at GGI"}
            </p>
          </Fade>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap justify-center mb-10 mt-10">
          <Tabs value={currentFilter} onValueChange={handleFilterChange}>
            <TabsList>
              <TabsTrigger value="all">{t("Barchasi")}</TabsTrigger>
              <TabsTrigger value="news">{t("Yangiliklar")}</TabsTrigger>
              <TabsTrigger value="announcement">{t("E'lonlar")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* CONTENT */}
        {/* isLoading faqat birinchi marta true bo'ladi. 
            Sahifa o'zgarganda isFetching true bo'ladi. */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 min-h-[400px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">
            {t("Ma'lumotlarni yuklashda xatolik yuz berdi")}
          </div>
        ) : newsItems.length > 0 ? (
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-opacity duration-300",
              isFetching ? "opacity-50" : "opacity-100" // Yangi ma'lumot kelayotganda sal xira qilamiz
            )}
          >
            {newsItems.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                navigate={navigate}
                locale={currentLocale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium">{t("Ma'lumot topilmadi")}</h3>
            <p className="text-muted-foreground">
              {t("Hozircha bu bo'limda yangiliklar mavjud emas.")}
            </p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageNum)}
                      className={currentPage === pageNum ? "pointer-events-none" : undefined}
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-1 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isFetching}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Loading indikator (agar isFetching bo'lsa) */}
        {isFetching && !isLoading && (
          <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur border rounded-full p-2 shadow-lg z-50">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
