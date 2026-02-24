import { Button } from "@/components/ui/button";
import { localized } from "@/i18n";
import { ArrowRight, Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Employee } from "../types";
import { getAbsoluteUrl } from "../utils";

interface EmployeeCardProps {
  emp: Employee;
  navigate: (path: string) => void;
}

export function EmployeeCard({ emp, navigate }: EmployeeCardProps) {
  const { t } = useTranslation();
  const getEmployeeImage = (e: Employee) => {
    if (!e.image) return null;
    if (typeof e.image === "string") return getAbsoluteUrl(e.image);
    if (Array.isArray(e.image) && e.image[0]?.image)
      return getAbsoluteUrl((e.image[0] as { image?: string }).image ?? "");
    return null;
  };
  const imgUrl = getEmployeeImage(emp);

  return (
    <div
      className="group relative flex flex-col sm:flex-row bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full cursor-pointer"
      onClick={() => navigate(`/employees/${emp.id}`)}
    >
      <div className="w-full sm:w-40 aspect-square sm:aspect-auto shrink-0 bg-muted relative border-b sm:border-b-0 sm:border-r border-border/50">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={localized(emp, "full_name")}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/50">
            <User className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-4 justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {localized(emp, "full_name")}
          </h3>
          <p className="text-sm text-muted-foreground font-medium line-clamp-2">
            {localized(emp, "position")}
          </p>
        </div>

        {(emp.phone || emp.email) && (
          <div className="space-y-1.5 mt-1">
            {emp.phone && (
              <div
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${emp.phone}`);
                }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Phone className="w-3 h-3" />
                </div>
                <span className="truncate font-medium">{emp.phone}</span>
              </div>
            )}
            {emp.email && (
              <div
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`mailto:${emp.email}`);
                }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Mail className="w-3 h-3" />
                </div>
                <span className="truncate font-medium">{emp.email}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-border/30 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="group/btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employees/${emp.id}`);
            }}
          >
            {t("Batafsil")}
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
