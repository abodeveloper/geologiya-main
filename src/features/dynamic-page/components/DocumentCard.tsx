import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { localized } from "@/i18n";
import { cn } from "@/lib/utils";
import { Download, FileIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PageFile } from "../types";
import { getAbsoluteUrl } from "../utils";

export interface DocumentCardProps {
  file: PageFile;
}

export function DocumentCard({ file }: DocumentCardProps) {
  const { t } = useTranslation();
  const fileName = file.file.split("/").pop() || "Hujjat";
  const fileExtension = fileName.split(".").pop()?.toUpperCase() || "FILE";
  const isPdf = fileExtension === "PDF";
  const isDoc = ["DOC", "DOCX"].includes(fileExtension);
  const iconBg = isPdf
    ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
    : isDoc
      ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50"
      : "bg-primary/5 text-primary border-primary/10";

  return (
    <div className="group relative flex flex-row items-start gap-3 p-3.5 rounded-lg border border-border/40 bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-300 h-full">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors",
          iconBg
        )}
      >
        <FileIcon className="w-5 h-5" />
        <span className="sr-only">{fileExtension}</span>
      </div>
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <Badge
              variant="outline"
              className="text-[9px] h-4 px-1 py-0 font-normal opacity-70"
            >
              {fileExtension}
            </Badge>
          </div>
          <h4
            className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-0.5"
            title={localized(file, "title") || fileName}
          >
            {localized(file, "title") || fileName}
          </h4>
        </div>
        <div className="mt-2 flex items-center justify-between pt-2 border-t border-border/30">
          <span
            className="text-[11px] text-muted-foreground truncate max-w-[60%]"
            title={fileName}
          >
            {fileName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(getAbsoluteUrl(file.file), "_blank")}
          >
            <Download className="w-3 h-3" />
            {t("Yuklab olish")}
          </Button>
        </div>
      </div>
    </div>
  );
}
