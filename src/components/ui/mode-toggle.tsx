import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export function ModeToggle() {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl border-border/60 hover:bg-primary"
        >
          <Sun className="h-[1.15rem] w-[1.15rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.15rem] w-[1.15rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[160px] rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-lg p-1.5"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer",
            theme === "light" && "bg-primary/10 text-primary",
          )}
        >
          <Sun className="h-4 w-4" />
          <span>{t("Yorug'")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer",
            theme === "dark" && "bg-primary/10 text-primary",
          )}
        >
          <Moon className="h-4 w-4" />
          <span>{t("Qorong'u")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer",
            theme === "system" && "bg-primary/10 text-primary",
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>{t("Tizim")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
