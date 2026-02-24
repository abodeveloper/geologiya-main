import { localized } from "@/i18n";
import { ArrowUpRight, Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Employee } from "../types";
import { getAbsoluteUrl } from "../utils";

interface EmployeeSidebarItemProps {
  emp: Employee;
  onNavigate: (path: string) => void;
}

function getEmployeeImage(e: Employee): string | null {
  if (!e.image) return null;
  if (typeof e.image === "string") return getAbsoluteUrl(e.image);
  if (Array.isArray(e.image) && e.image[0]?.image)
    return getAbsoluteUrl((e.image[0] as { image?: string }).image ?? "");
  return null;
}

export function EmployeeSidebarItem({ emp, onNavigate }: EmployeeSidebarItemProps) {
  const { t } = useTranslation();
  const imgUrl = getEmployeeImage(emp);
  const name = localized(emp, "full_name");
  const position = localized(emp, "position");

  return (
    <div className="group flex flex-col gap-3 py-5 border-b border-border/40 last:border-0 last:pb-0 first:pt-0">
      {/* Avatar */}
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted ring-1 ring-border/30 group-hover:ring-primary/30 transition-all duration-300">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <User className="w-12 h-12 text-primary/20" />
          </div>
        )}
      </div>

      {/* Ism + lavozim */}
      <div className="min-w-0">
        <p className="font-semibold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {name}
        </p>
        {position && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-snug">
            {position}
          </p>
        )}
      </div>

      {/* Telefon va email */}
      {(emp.phone || emp.email) && (
        <div className="flex flex-col gap-1.5 pl-1">
          {emp.phone && (
            <a
              href={`tel:${emp.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <Phone className="w-2.5 h-2.5" />
              </div>
              <span className="truncate">{emp.phone}</span>
            </a>
          )}
          {emp.email && (
            <a
              href={`mailto:${emp.email}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <Mail className="w-2.5 h-2.5" />
              </div>
              <span className="truncate">{emp.email}</span>
            </a>
          )}
        </div>
      )}

      {/* Batafsil tugma */}
      <button
        type="button"
        onClick={() => onNavigate(`/employees/${emp.id}`)}
        className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-primary/80 hover:text-primary transition-colors duration-200 group/btn"
      >
        {t("Batafsil")}
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      </button>
    </div>
  );
}
