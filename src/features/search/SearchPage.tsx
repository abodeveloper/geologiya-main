import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  FileText,
  Layout,
  Newspaper,
  Search,
  Users
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/features/dynamic-page/components/DocumentCard";
import { EmployeeCard } from "@/features/dynamic-page/components/EmployeeCard";
import type { Employee, PageFile, PostItem } from "@/features/dynamic-page/types";
import { NewsCard } from "@/features/news/components/NewsCard";
import { localized } from "@/i18n";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { getSearchData } from "./api/search.api";

interface SearchPageItem {
  slug: string;
  [key: string]: unknown;
}

// --- SUB-COMPONENTS ---

// 1. Page Card (Sahifalar)
const SearchPageCard = ({ item, navigate }: { item: SearchPageItem; navigate: (path: string) => void }) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={() => navigate(`/dynamic-page/${item.slug}`)}
      className="group relative flex flex-col bg-card rounded-2xl border border-border/50 p-5 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden h-full"
    >
      <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
        <Layout className="w-32 h-32 -rotate-12" />
      </div>
      <div className="relative z-10 flex flex-col gap-3 mb-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <Layout className="w-5 h-5" />
        </div>
        <h3
          className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2"
          title={localized(item, "title")}
        >
          {localized(item, "title")}
        </h3>
      </div>
      <div className="relative z-10 mt-auto flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors pt-2">
        <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
          {t("O'tish")}
        </span>
        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
      </div>
    </div>
  );
};

// --- MAIN SEARCH PAGE ---

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const dateLocales: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = dateLocales[i18n.language] || "uz-UZ";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query],
    queryFn: () => getSearchData(query),
    enabled: !!query,
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-red-500">{t("Xatolik yuz berdi")}</p>
      </div>
    );
  }

  // --- FILTERING & PREPARATION ---
  const results = data?.results || {};

  // 1. "Menus" ni olib tashlaymiz (User talabi)
  // 2. "Carousels" va "Collaborations" ham odatda qidiruvda kerak emas, ularni ham o'chiramiz (ixtiyoriy, lekin toza bo'lishi uchun)
  const forbiddenKeys = ["menus", "carousels", "collaborations"];

  const activeSections = Object.entries(results).filter(
    ([key, value]) =>
      !forbiddenKeys.includes(key) && Array.isArray(value) && value.length > 0,
  );

  const totalCount = activeSections.reduce(
    (acc, [, val]) => acc + (Array.isArray(val) ? val.length : 0),
    0,
  );

  // Helper helpers for Section headers
  const getSectionIcon = (key: string) => {
    switch (key) {
      case "posts":
        return <Newspaper className="h-5 w-5" />;
      case "employees":
        return <Users className="h-5 w-5" />;
      case "page_files":
        return <FileText className="h-5 w-5" />;
      case "pages":
        return <Layout className="h-5 w-5" />;
      default:
        return <Search className="h-5 w-5" />;
    }
  };

  const getSectionTitle = (key: string) => {
    const titles: Record<string, string> = {
      posts: t("Yangiliklar va E'lonlar"),
      employees: t("Xodimlar"),
      page_files: t("Hujjatlar"),
      pages: t("Sahifalar"),
    };
    return titles[key] || key;
  };

  return (
    <div className="min-h-screen bg-muted/5 pb-10 pt-10">
      <div className="container max-w-6xl mx-auto px-4 md:px-0">
        {/* HEADER */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            {t("Qidiruv natijalari")}
          </h1>
          <p className="text-muted-foreground text-lg">
            <span className="font-semibold text-primary">"{query}"</span> —{" "}
            {totalCount} {t("ta natija topildi")}
          </p>
        </div>

        {/* EMPTY STATE */}
        {activeSections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border/60">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium text-lg">
              {t("Hech narsa topilmadi")}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/")}
            >
              {t("Bosh sahifaga qaytish")}
            </Button>
          </div>
        )}

        {/* RESULTS GRID */}
        <div className="space-y-12">
          {activeSections.map(([key, items]: [string, any]) => (
            <section
              key={key}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6 border-b border-border/40 pb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getSectionIcon(key)}
                </div>
                <h2 className="text-2xl font-bold capitalize">
                  {getSectionTitle(key)}
                </h2>
                <Badge variant="secondary" className="ml-auto text-sm px-2.5">
                  {items.length}
                </Badge>
              </div>

              {/* Section Content Grid */}
              <div
                className={cn(
                  "grid gap-6",
                  key === "employees"
                    ? "grid-cols-1 lg:grid-cols-2"
                    : key === "page_files"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {items.map((item: unknown, i: number) => {
                  const it = item as PostItem & Employee & PageFile & SearchPageItem & { id?: number };
                  const keyId = it.id ?? i;
                  switch (key) {
                    case "posts":
                      return (
                        <NewsCard
                          key={keyId}
                          item={it as PostItem}
                          navigate={navigate}
                          locale={currentLocale}
                        />
                      );
                    case "employees":
                      return (
                        <EmployeeCard
                          key={keyId}
                          emp={it as Employee}
                          navigate={navigate}
                        />
                      );
                    case "page_files":
                      return <DocumentCard key={keyId} file={it as PageFile} />;
                    case "pages":
                      return (
                        <SearchPageCard
                          key={keyId}
                          item={it as SearchPageItem}
                          navigate={navigate}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
