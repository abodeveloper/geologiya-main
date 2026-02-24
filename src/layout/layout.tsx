import { Button } from "@/components/ui/button";
import { Footer } from "@/features/home/components/Footer";
import { Navbar } from "@/shared/components/moleculas/Navbar";
import { AlertCircle } from "lucide-react";
import { Outlet } from "react-router-dom";

import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useMenus } from "@/hooks/useMenus";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { DocumentHead } from "@/shared/components/atoms/document-head/DocumentHead";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const { t } = useTranslation();

  const companyQuery = useCompanyInfo();
  const menusQuery = useMenus();

  const isGlobalLoading = companyQuery.isLoading || menusQuery.isLoading;
  const isError = companyQuery.isError || menusQuery.isError;
  const refetch = () => {
    void companyQuery.refetch();
    void menusQuery.refetch();
  };

  if (isGlobalLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {t("Sayt ma’lumotlarini yuklashda xatolik yuz berdi")}
          </h1>
          <p className="max-w-md text-muted-foreground">
            {t("Iltimos, internetingizni tekshiring yoki keyinroq qayta urinib ko‘ring.")}
          </p>
        </div>
        <Button onClick={refetch} size="lg">
          {t("Qayta yuklash")}
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()} size="lg">
          {t("Sahifani yangilash")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <DocumentHead />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
