import { FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

type TestModeBannerProps = {
  className?: string;
};

export function TestModeBanner({ className }: TestModeBannerProps) {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-center text-sm text-foreground/90",
        className,
      )}
    >
      <FlaskConical
        className="h-4 w-4 shrink-0 text-primary"
        strokeWidth={2}
        aria-hidden
      />
      <span>{t("Sayt test rejimida ishlamoqda")}</span>
    </div>
  );
}
