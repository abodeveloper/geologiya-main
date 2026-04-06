import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useColorPalette } from "@/hooks/use-color-palette";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PaletteToggle() {
  const { t } = useTranslation();
  const { palette, setPalette } = useColorPalette();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl border-border/60 hover:bg-primary"
          title={t("Rang sxemasi")}
        >
          <Palette className="h-[1.15rem] w-[1.15rem]" />
          <span className="sr-only">{t("Rang sxemasi")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[200px] rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-lg p-1.5"
      >
        <DropdownMenuItem
          onClick={() => setPalette("brand")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer",
            palette === "brand" && "bg-primary/10 text-primary",
          )}
        >
          <span className="size-2.5 shrink-0 rounded-full bg-[hsl(232_35%_52%)] ring-1 ring-border" />
          <span>{t("Brend (logotip)")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setPalette("mineral")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer",
            palette === "mineral" && "bg-primary/10 text-primary",
          )}
        >
          <span className="size-2.5 shrink-0 rounded-full bg-[hsl(168_55%_44%)] ring-1 ring-border" />
          <span>{t("Mineral (sovuq)")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setPalette("terra")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer",
            palette === "terra" && "bg-primary/10 text-primary",
          )}
        >
          <span className="size-2.5 shrink-0 rounded-full bg-[hsl(28_48%_52%)] ring-1 ring-border" />
          <span>{t("Tuproq (iliq)")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
