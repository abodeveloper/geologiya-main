import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  /** sm: 10, md: 16, lg: 20 (default md) */
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-10 w-10", md: "h-16 w-16", lg: "h-20 w-20" };
const borderMap = { sm: "border-2", md: "border-[3px]", lg: "border-4" };

const LoadingSpinner = ({
  message,
  className,
  size = "md",
}: LoadingSpinnerProps) => {
  const { t } = useTranslation();
  const displayMessage = message ?? t("Yuklanmoqda...");

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background/90 backdrop-blur-sm",
        className
      )}
    >
      <div className={cn("relative", sizeMap[size])}>
        <div
          className={cn(
            "absolute inset-0 rounded-full border-muted-foreground/15",
            borderMap[size]
          )}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-full border-primary border-t-transparent animate-spin",
            borderMap[size]
          )}
        />
      </div>
      {displayMessage && (
        <p className="text-sm text-muted-foreground font-medium max-w-[200px] text-center">
          {displayMessage}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
