import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Clock
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { localized } from "@/i18n";
import DynamicIcon from "@/shared/components/atoms/dynamic-icon/DynamicIcon";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { getScientificById } from "./api/scientific";

const ScientificDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  // Ma'lumotni olish
  const { data, isLoading, isError } = useQuery({
    queryKey: ["scientific-detail", slug],
    queryFn: () => getScientificById(slug || ""),
    enabled: !!slug,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) {
    return (
      <ErrorMessage
        title={t("Xatolik yuz berdi")}
        message={t("Sahifani yuklashning imkoni bo'lmadi.")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted/5 pb-10 pt-10">
      <div className="container max-w-5xl mx-auto px-4 md:px-0">
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-8">
            {/* Icon & Title */}
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

            {/* Info Cards (Faqat ma'lumot bor bo'lsa chiqadi) */}
            {(localized(data, "direction") || localized(data, "duration")) && (
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
                        <p className="font-semibold text-foreground">
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
                        <p className="font-semibold text-foreground">
                          {localized(data, "duration")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Description */}
            {localized(data, "description") && (
              <div
                className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed text-left md:text-justify mt-8 pt-8 border-t border-border/40"
                dangerouslySetInnerHTML={{
                  __html: localized(data, "description"),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificDetailPage;
