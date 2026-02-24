import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = ({
  message,
  className,
}: LoadingSpinnerProps) => {

  const { t } = useTranslation();

  message = message || t("Yuklanmoqda...");

  return (
    <div
      className={cn(
        // O'zgarishlar shu qatorda:
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md",
        className
      )}
    >
      <div className="relative h-16 w-16">
        {/* Orqa fon halqasi (xira) */}
        <div className="absolute inset-0 rounded-full border-4 border-muted-foreground/20"></div>

        {/* Aylanuvchi asosiy halqa */}
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin duration-1000"></div>

        {/* O'rtadagi kichik nuqta */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
        </div>
      </div>

      {/* Matn */}
      {message && (
        <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse tracking-wide uppercase">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
