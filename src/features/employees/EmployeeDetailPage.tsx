"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { localized } from "@/i18n";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Briefcase, Mail, Phone, User } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById } from "./api/employee";

const EmployeeDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const itemId = parseInt(id || "0", 10);

  // API Request
  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee", itemId],
    queryFn: () => getEmployeeById(itemId),
    enabled: !!itemId && itemId > 0,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !employee) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <ErrorMessage
          title={t("Sahifa yuklanmadi")}
          message={t("Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.")}
        />
      </div>
    );
  }

  // Rasm manzilini to'g'irlash
  const imageUrl = employee.image ? `${employee.image}` : null;

  return (
    <div className="min-h-screen bg-muted/5 py-10">
      <div className="container max-w-5xl mx-auto px-4 md:px-0">
        {/* Navigation */}
        <Fade triggerOnce direction="down" duration={600}>
          <div className="flex items-center justify-start mb-8">
            <Button
              variant="outline"
              className="group"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {t("Orqaga qaytish")}
            </Button>
          </div>
        </Fade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE: Profile Card */}
          <Fade
            triggerOnce
            direction="up"
            duration={800}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden border-border/50 shadow-lg sticky top-24">
              <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
              </div>

              <div className="px-6 pb-6 -mt-24 flex flex-col items-center text-center">
                {/* Avatar Image */}
                <div className="relative w-48 h-48 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={localized(employee, "full_name")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground/30" />
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {localized(employee, "full_name")}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 text-xs font-normal"
                  >
                    {localized(employee, "position")}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="w-full mt-6 space-y-2 pt-2 border-t border-border/50">
                  {employee.phone && (
                    <a
                      href={`tel:${employee.phone}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group text-sm text-muted-foreground hover:text-foreground"
                    >
                      <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate">
                        {employee.phone}
                      </span>
                    </a>
                  )}

                  {employee.email && (
                    <a
                      href={`mailto:${employee.email}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group text-sm text-muted-foreground hover:text-foreground"
                    >
                      <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate">
                        {employee.email}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </Fade>

          {/* RIGHT SIDE: Description & Details */}
          <Fade
            triggerOnce
            direction="up"
            delay={200}
            duration={800}
            className="lg:col-span-2"
          >
            <Card className="border-border/50 shadow-sm h-full">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Briefcase className="w-5 h-5" />
                  <h3>{t("Tarjimai hol va faoliyat")}</h3>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {localized(employee, "description") ? (
                  <div
                    className="
                      prose prose-slate dark:prose-invert 
                      max-w-none 
                      prose-headings:text-foreground prose-headings:font-bold
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-li:marker:text-primary
                      prose-strong:text-foreground prose-strong:font-semibold
                    "
                    dangerouslySetInnerHTML={{
                      __html: localized(employee, "description"),
                    }}
                  />
                ) : (
                  <div className="text-center py-10 text-muted-foreground italic">
                    {t("Ma'lumotlar kiritilmagan.")}
                  </div>
                )}
              </CardContent>
            </Card>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
