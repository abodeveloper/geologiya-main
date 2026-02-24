import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">
          {t("Sahifa topilmadi")}
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          {t("Siz so‘ragan sahifa mavjud emas yoki ko‘chirilgan.")}
        </p>
      </div>
      <Button asChild size="lg">
        <Link to="/">{t("Bosh sahifaga")}</Link>
      </Button>
    </div>
  );
}
