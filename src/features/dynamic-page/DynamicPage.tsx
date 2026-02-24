import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Clock,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Newspaper,
  ZoomIn,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localized } from "@/i18n";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { getPageData } from "./api";
import type { DynamicPageData, Employee, LabItem, DepartmentItem, PostgraduateItem, ScientificDirectionItem, PostItem, PageFile } from "./types";

import DynamicIcon from "@/shared/components/atoms/dynamic-icon/DynamicIcon";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";

import { DocumentCard } from "./components/DocumentCard";
import { EmployeeCard } from "./components/EmployeeCard";
import { NewsCard } from "@/features/news/components/NewsCard";
import { getAbsoluteUrl } from "./utils";

// --- STYLES & HELPERS ---
const cardStyles = [
  { colorClass: "text-primary", bgClass: "bg-primary/10", direction: "left" },
  {
    colorClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-100 dark:bg-sky-900/20",
    direction: "down",
  },
  {
    colorClass: "text-indigo-500 dark:text-indigo-400",
    bgClass: "bg-indigo-100 dark:bg-indigo-900/20",
    direction: "right",
  },
  {
    colorClass: "text-amber-500 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900/20",
    direction: "left",
  },
  {
    colorClass: "text-blue-500 dark:text-blue-300",
    bgClass: "bg-blue-100 dark:bg-blue-900/20",
    direction: "up",
  },
  {
    colorClass: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-100 dark:bg-green-900/20",
    direction: "right",
  },
];

const postGraduateDirections = ["left", "up", "right", "down"];

// --- MAIN PAGE COMPONENT ---

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const dateLocales: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = dateLocales[i18n.language] || "uz-UZ";

  const { data, isLoading, isError } = useQuery<DynamicPageData | null>({
    queryKey: ["dynamic-page", slug],
    queryFn: () => getPageData(slug || ""),
    enabled: !!slug,
  });

  // 1. REDIRECT NEWS
  useEffect(() => {
    if (data?.type === "news") {
      navigate("/news", { replace: true });
    }
  }, [data, navigate]);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) {
    return (
      <ErrorMessage
        title={t("Sahifa yuklanmadi")}
        message={t("Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.")}
      />
    );
  }

  // Redirect bo'layotganda bo'sh ekran
  if (data.type === "news") return null;

  const galleryImages = (data.images || []).map((img) => {
    const src = typeof img === "string" ? img : (img as { image?: string }).image ?? "";
    return { src: getAbsoluteUrl(src) };
  });

  // Chap tomonda xodimlar (tab emas) — bor bo'lsa chiqadi, yo'q bo'lsa joy qolmaydi
  const hasEmployeesSidebar =
    !!data.employees &&
    data.employees.length > 0 &&
    data.type !== "leadership";

  // --- TABS LOGIC (Xodimlar tab olib tashlandi — chap tomonda) ---
  const availableTabs = [
    {
      id: "news",
      label: t("Yangiliklar"),
      icon: Newspaper,
      show: data.posts && data.posts.length > 0,
    },
    {
      id: "gallery",
      label: t("Galereya"),
      icon: ImageIcon,
      show: galleryImages.length > 0,
    },
    {
      id: "documents",
      label: t("Hujjatlar"),
      icon: FileText,
      show: data.files && data.files.length > 0,
    },
  ].filter((tab) => tab.show);

  const hasTabs = availableTabs.length > 0;

  // --- CONTENT RENDERERS ---

  // 1. Postgraduate Education Grid
  const renderPostgraduate = () => {
    if (
      !data.postgraduate_educations ||
      data.postgraduate_educations.length === 0
    )
      return null;
    const gridClassName =
      data.postgraduate_educations.length === 4
        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center";

    return (
      <div
        className={`grid ${gridClassName} animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200`}
      >
        {data.postgraduate_educations.map((item: PostgraduateItem, index: number) => {
          const currentDirection = postGraduateDirections[index % 4] as
            | "left"
            | "up"
            | "right"
            | "down";
          return (
            <Fade
              key={item.id}
              delay={100 + index * 100}
              duration={900}
              triggerOnce
              direction={currentDirection}
              damping={0.4}
              className="h-full"
            >
              <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/60 to-background border border-transparent hover:transform hover:-translate-y-2 group h-full text-left transition-all duration-500 flex flex-col shadow-sm hover:shadow-xl">
                <div className="absolute inset-0 rounded-2xl p-[1.5px] bg-[conic-gradient(from_0deg,theme(colors.primary)_0%,theme(colors.primary/60)_25%,theme(colors.primary/30)_50%,theme(colors.primary/60)_75%,theme(colors.primary)_100%)] animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-1200 pointer-events-none">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-b from-muted/60 to-background" />
                </div>
                <CardHeader className="relative z-10 pb-2">
                  <CardTitle className="flex flex-col gap-4 items-start text-lg font-bold">
                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 shadow-sm">
                      <DynamicIcon
                        name={item.logo || "GraduationCap"}
                        className="w-7 h-7"
                      />
                    </div>
                    <span
                      className="line-clamp-2 min-h-[3.5rem] flex items-center"
                      title={localized(item, "title")}
                    >
                      {localized(item, "title")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 px-6 pb-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3 mb-5">
                    {localized(item, "direction") && (
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">
                          {t("Yo'nalish")}:
                        </strong>{" "}
                        {localized(item, "direction")}
                      </p>
                    )}
                    {localized(item, "duration") && (
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">
                          {t("Davomiyligi")}:
                        </strong>{" "}
                        {localized(item, "duration")}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3 mt-2">
                      {localized(item, "sub_title")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-auto"
                    onClick={() =>
                      navigate(`/postgraduate-educations/${item.slug}`)
                    }
                  >
                    {t("Batafsil")}
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          );
        })}
      </div>
    );
  };

  // 2. Scientific Directions Grid
  const renderScientificDirections = () => {
    if (!data.scientific_directions || data.scientific_directions.length === 0)
      return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.scientific_directions.map((item: ScientificDirectionItem, index: number) => {
          const style = cardStyles[index % cardStyles.length];
          return (
            <Fade
              key={item.id}
              delay={100 + index * 100}
              duration={800}
              triggerOnce
              direction={style.direction as "up" | "down" | "left" | "right"}
            >
              <Card
                className="relative overflow-hidden rounded-2xl bg-background/95 border border-border/40 backdrop-blur-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 group h-full cursor-pointer"
                onClick={() => navigate(`/scientific-directions/${item.slug}`)}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader>
                  <CardTitle className="grid gap-4 place-items-center text-lg font-semibold pt-4">
                    <div
                      className={`p-4 rounded-xl ${style.bgClass} ${style.colorClass} transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                    >
                      <DynamicIcon
                        name={item.logo || "Globe"}
                        className="w-8 h-8"
                      />
                    </div>
                    <span
                      className="group-hover:text-primary transition-colors text-center line-clamp-2 min-h-[3.5rem] flex items-center justify-center"
                      title={localized(item, "title")}
                    >
                      {localized(item, "title")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed line-clamp-3">
                    {localized(item, "sub_title")}
                  </p>
                </CardContent>
              </Card>
            </Fade>
          );
        })}
      </div>
    );
  };

  // 3. Lab Grid
  const renderLabs = () => {
    if (!data.labs || data.labs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border/60">
          <div className="p-4 rounded-full bg-muted mb-4">
            <FlaskConical className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium text-lg">
            {t("Hozircha laboratoriyalar mavjud emas")}
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {data.labs.map((lab: LabItem) => {
          const labImage = lab.image
            ? getAbsoluteUrl(
                typeof lab.image === "string" ? lab.image : (lab.image?.image ?? "")
              )
            : null;
          return (
            <Card
              key={lab.id}
              className="group flex flex-col overflow-hidden border-border/60 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-card"
              onClick={() => navigate(`/laboratories/${lab.slug}`)}
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                {labImage ? (
                  <img
                    src={labImage}
                    alt={localized(lab, "title")}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-colors">
                    <FlaskConical className="w-16 h-16 text-primary/20 group-hover:text-primary/40 transition-colors" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="pt-5 pb-2 px-5 flex-1">
                <CardTitle
                  className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2"
                  title={localized(lab, "title")}
                >
                  {localized(lab, "title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-2 mt-auto">
                <div className="relative z-10 mt-auto flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
                  <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                    {t("Batafsil")}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // 4. Departments Grid
  const renderDepartments = () => {
    if (!data.departments || data.departments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border/60">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium text-lg">
            {t("Hozircha bo'limlar mavjud emas")}
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {data.departments.map((dept: DepartmentItem) => (
          <div
            key={dept.id}
            onClick={() => navigate(`/departments/${dept.slug}`)}
            className="group relative flex flex-col bg-card rounded-2xl border border-border/50 p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
              <Building2 className="w-48 h-48 -rotate-12" />
            </div>
            <div className="relative z-10 flex flex-col gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Building2 className="w-6 h-6" />
              </div>
              <h3
                className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors pr-2 line-clamp-2 min-h-[3.5rem]"
                title={localized(dept, "title")}
              >
                {localized(dept, "title")}
              </h3>
            </div>
            <div className="relative z-10 flex-1 mb-6">
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {localized(dept, "sub_title") ||
                  t("Batafsil ma'lumot olish uchun kiring.")}
              </p>
            </div>
            <div className="relative z-10 mt-auto flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
              <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                {t("Batafsil")}
              </span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 5. Leadership (Employee Grid - HORIZONTAL - 2 COLUMNS)
  const renderLeadership = () => {
    if (!data.employees || data.employees.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-10">
          {t("Ma'lumot topilmadi")}
        </div>
      );
    }
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {/* GRID: sm (telefonda) 1 ustun, lg (katta ekran) 2 ustun - chunki kartalar yotiq */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.employees.map((emp: Employee) => (
            <EmployeeCard key={emp.id} emp={emp} navigate={navigate} />
          ))}
        </div> */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 md:px-32 lg:px-40">
          {(data.employees ?? []).map((emp: Employee) => (
            <EmployeeCard key={emp.id} emp={emp} navigate={navigate} />
          ))}
        </div>
      </div>
    );
  };

  // --- RENDER MAIN CONTENT ---
  const renderMainContent = () => {
    switch (data.type) {
      case "postgraduate_education":
        return renderPostgraduate();
      case "scientific_direction":
        return renderScientificDirections();
      case "lab":
        return renderLabs();
      case "department":
        return renderDepartments();
      case "leadership":
        return renderLeadership();
      default:
        return null;
    }
  };

  const isSpecialHeader = [
    "postgraduate_education",
    "scientific_direction",
  ].includes(data.type);

  return (
    <div className="min-h-screen bg-muted/5 pb-10 pt-10">
      <div className={`container mx-auto px-4 md:px-0 ${hasEmployeesSidebar ? "" : "max-w-5xl"}`}>
        {/* Chap: Xodimlar | O'ng: title, description, kontent, tablar */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start mb-20">
          {/* Chap sidebar — faqat xodimlar bor bo'lsa */}
          {hasEmployeesSidebar && (
            <aside className="order-2 lg:order-1 w-full lg:w-[450px] shrink-0 lg:sticky lg:top-24 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full inline-block" />
                {t("Xodimlar")}
              </h3>
              {(data.employees ?? []).map((emp: Employee) => (
                <EmployeeCard key={emp.id} emp={emp} navigate={navigate} />
              ))}
            </aside>
          )}

          {/* O'ng: title, description, asosiy kontent, tablar */}
          <div className={`order-1 lg:order-2 w-full ${hasEmployeesSidebar ? "lg:flex-1 lg:min-w-0" : ""}`}>
            {/* Title + Description */}
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isSpecialHeader ? (
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 mb-2">
                      <DynamicIcon
                        name={data.logo || "layers"}
                        className="w-12 h-12 text-primary"
                      />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl text-foreground leading-tight">
                      {localized(data, "title")}
                    </h1>
                    {localized(data, "sub_title") && (
                      <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        {localized(data, "sub_title")}
                      </p>
                    )}
                  </div>
                  {(localized(data, "direction") ||
                    localized(data, "duration")) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {localized(data, "direction") && (
                        <Card className="border-border/60 shadow-sm">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {t("Yo'nalish")}
                              </p>
                              <p
                                className="font-semibold text-foreground line-clamp-1"
                                title={localized(data, "direction")}
                              >
                                {localized(data, "direction")}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {localized(data, "duration") && (
                        <Card className="border-border/60 shadow-sm">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {t("Davomiyligi")}
                              </p>
                              <p
                                className="font-semibold text-foreground line-clamp-1"
                                title={localized(data, "duration")}
                              >
                                {localized(data, "duration")}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                  {localized(data, "description") && (
                    <div
                      className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed text-left md:text-justify mt-8 pt-8 border-t border-border/40"
                      dangerouslySetInnerHTML={{
                        __html: localized(data, "description"),
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
                    {localized(data, "title")}
                  </h1>
                  {localized(data, "description") && (
                    <div
                      className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed text-left md:text-justify"
                      dangerouslySetInnerHTML={{
                        __html: localized(data, "description"),
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Asosiy kontent (bo'limlar, lab, va hokazo) */}
            <div className="mb-8">{renderMainContent()}</div>

            {/* --- TABS (Xodimlar tabi yo‘q, ular chapda) --- */}
            {hasTabs && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Tabs
              defaultValue={availableTabs[0].id}
              className="w-full space-y-8"
            >
              {/* Tab List */}
              <div className="w-full overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 md:mx-0">
                <div className="flex md:justify-center min-w-full">
                  <TabsList className="whitespace-nowrap">
                    {availableTabs.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id}>
                        <tab.icon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              {/* News, Gallery, Documents tablari (Xodimlar chap tomonda) */}
              {availableTabs.some((t) => t.id === "news") && (
                <TabsContent
                  value="news"
                  className="focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(data.posts ?? []).map((item: PostItem) => (
                      <NewsCard
                        key={item.id}
                        item={item}
                        navigate={navigate}
                        locale={currentLocale}
                      />
                    ))}
                  </div>
                </TabsContent>
              )}

              {availableTabs.some((t) => t.id === "gallery") && (
                <TabsContent
                  value="gallery"
                  className="focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setPhotoIndex(idx);
                          setLightboxOpen(true);
                        }}
                        className="group relative cursor-zoom-in overflow-hidden rounded-lg bg-muted shadow-sm hover:shadow-md transition-all duration-300 aspect-square"
                      >
                        <img
                          src={img.src}
                          alt={`Gallery item ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[1px]">
                          <ZoomIn className="text-white w-10 h-10 drop-shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={photoIndex}
                    slides={galleryImages}
                    plugins={[Thumbnails]}
                  />
                </TabsContent>
              )}

              {availableTabs.some((t) => t.id === "documents") && (
                <TabsContent
                  value="documents"
                  className="focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.files ?? []).map((file: PageFile) => (
                      <DocumentCard key={file.id} file={file} />
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
            )}

          </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default DynamicPage;
