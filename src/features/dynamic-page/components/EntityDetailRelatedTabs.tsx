import { FileText, Image as ImageIcon, Newspaper, Users, ZoomIn } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "@/features/news/components/NewsCard";
import { cn } from "@/lib/utils";

import type { Employee, PageFile, PageImage, PostItem } from "../types";
import { getAbsoluteUrl } from "../utils";
import { DocumentCard } from "./DocumentCard";
import { EmployeeCard } from "./EmployeeCard";

export interface EntityDetailRelatedTabsProps {
  employees?: Employee[] | null;
  posts?: PostItem[] | null;
  files?: PageFile[] | null;
  /** DynamicPage bilan bir xil: `string` yoki `{ image: string }` elementlar */
  images?: (string | PageImage)[] | null;
  className?: string;
}

export function EntityDetailRelatedTabs({
  employees,
  posts,
  files,
  images,
  className,
}: EntityDetailRelatedTabsProps) {
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

  const empList = employees?.length ? employees : [];
  const postList = posts?.length ? posts : [];
  const fileList = files?.length ? files : [];

  const galleryImages = (images ?? []).map((img) => {
    const src =
      typeof img === "string" ? img : (img as PageImage).image ?? "";
    return { src: getAbsoluteUrl(src) };
  }).filter((slide) => slide.src);

  const availableTabs = [
    {
      id: "employees",
      label: t("Xodimlar"),
      icon: Users,
      show: empList.length > 0,
    },
    {
      id: "news",
      label: t("Yangiliklar"),
      icon: Newspaper,
      show: postList.length > 0,
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
      show: fileList.length > 0,
    },
  ].filter((tab) => tab.show);

  if (availableTabs.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200",
        className
      )}
    >
      <Tabs defaultValue={availableTabs[0].id} className="w-full space-y-8">
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

        {availableTabs.some((x) => x.id === "employees") && (
          <TabsContent value="employees" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {empList.map((emp) => (
                <EmployeeCard key={emp.id} emp={emp} navigate={navigate} />
              ))}
            </div>
          </TabsContent>
        )}

        {availableTabs.some((x) => x.id === "news") && (
          <TabsContent value="news" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postList.map((item) => (
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

        {availableTabs.some((x) => x.id === "gallery") && (
          <TabsContent value="gallery" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setPhotoIndex(idx);
                    setLightboxOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPhotoIndex(idx);
                      setLightboxOpen(true);
                    }
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

        {availableTabs.some((x) => x.id === "documents") && (
          <TabsContent value="documents" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fileList.map((file) => (
                <DocumentCard key={file.id} file={file} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
