"use client";

import RuLogo from "@/assets/lang-icon/ru.png";
import UkLogo from "@/assets/lang-icon/uk.png";
import UzLogo from "@/assets/lang-icon/uz.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Dialog importlari qo'shildi
import { Input } from "@/components/ui/input";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useMenus } from "@/hooks/useMenus";
import { localized } from "@/i18n";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

// --- TYPES ---
interface MenuItem {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  has_page: boolean;
  page_slug: string | null;
  children: MenuItem[];
  status: boolean;
  position: number;
  parent: number | null;
}

// --- HELPER COMPONENTS ---

const FlagIcon = ({ code }: { code: string }) => {
  const flags: Record<string, string> = { en: UkLogo, uz: UzLogo, ru: RuLogo };
  const src = flags[code];
  if (!src) return null;
  return <img src={src} alt={code} className="w-5 h-5 mr-2 rounded-sm" />;
};

const getHref = (item: MenuItem) => {
  return item.has_page && item.page_slug
    ? `/dynamic-page/${item.page_slug}`
    : "#";
};

const isItemActiveRecursive = (
  item: MenuItem,
  currentPath: string,
): boolean => {
  const itemHref = getHref(item);
  if (currentPath === itemHref) return true;

  if (item.children && item.children.length > 0) {
    return item.children.some((child) =>
      isItemActiveRecursive(child, currentPath),
    );
  }
  return false;
};

// --- 1. ODDIY INPUT (MOBILE UCHUN) ---
const SearchInputMobile = ({
  className,
  onSearch,
}: {
  className?: string;
  onSearch?: () => void;
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      if (onSearch) onSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative group", className)}>
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 pr-10 focus-visible:ring-primary w-full"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
};

// --- 2. MODAL SEARCH (DESKTOP UCHUN YANGI KOMPONENT) ---
const SearchDialogDesktop = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false); // Modalni yopish
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Faqat Ikonka ko'rinadi */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">{t("Qidirish")}</span>
        </Button>
      </DialogTrigger>

      {/* Ochiladigan oyna */}
      <DialogContent className="sm:max-w-[550px] top-[20%] translate-y-0 gap-0 p-0 overflow-hidden outline-none">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm font-medium text-muted-foreground">
            {t("Sayt bo'ylab qidiruv")}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSearch}
          className="flex items-center border-b px-3"
        >
          <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
          <input
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={t("Nima qidiryapsiz?") + "..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus // Oyna ochilganda avtomatik yozishga tayyor bo'ladi
          />
        </form>
        <div className="py-3 px-4 text-xs text-muted-foreground bg-muted/30">
          {t("Qidirish uchun")}{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">↵</span>
          </kbd>{" "}
          {t("tugmasini bosing")}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- DESKTOP MENU (Recursive) ---

const RecursiveDesktopMenuItem = ({
  item,
  level = 0,
}: {
  item: MenuItem;
  level?: number;
}) => {
  const location = useLocation();
  const href = getHref(item);
  const isActive = location.pathname === href;
  const hasChildren = item.children && item.children.length > 0;

  const activeClass = "text-primary font-bold bg-primary/5 rounded-md";
  const inactiveClass =
    "text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md";

  return (
    <div className="flex flex-col relative">
      <Link to={href} className="block w-full outline-none focus:ring-0 z-10">
        <div
          className={cn(
            "block select-none py-2 px-3 text-[14px] leading-none no-underline transition-all duration-200 outline-none",
            isActive ? activeClass : inactiveClass,
            level === 0 && hasChildren
              ? "font-bold text-foreground text-[15px] mb-2 hover:bg-transparent pl-0 cursor-default pointer-events-none"
              : "",
          )}
        >
          {localized(item, "title")}
        </div>
      </Link>

      {hasChildren && (
        <div
          className={cn(
            "flex flex-col gap-1 my-1",
            level >= 0 ? "border-l-2 border-muted ml-[2px] pl-3" : "pl-0",
          )}
        >
          {item.children
            .filter((c) => c.status)
            .map((child) => (
              <RecursiveDesktopMenuItem
                key={child.id}
                item={child}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const DesktopMenu = ({ items }: { items: MenuItem[] }) => {
  const location = useLocation();

  const activeStyle = cn(
    "bg-primary text-primary-foreground rounded-md",
    "hover:bg-primary/90 hover:text-primary-foreground",
  );

  const inactiveStyle = cn(
    "bg-transparent text-muted-foreground rounded-md",
    "hover:bg-accent/50 hover:text-foreground",
  );

  return (
    <div className="hidden md:flex flex-1 min-w-0 px-4">
      <nav className="w-full overflow-x-auto no-scrollbar flex">
        <ul className="flex items-center gap-1 w-max mx-auto p-1">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const href = getHref(item);
            const isActive = isItemActiveRecursive(item, location.pathname);

            if (hasChildren) {
              return (
                <li key={item.id}>
                  <HoverCard openDelay={0} closeDelay={150}>
                    <HoverCardTrigger asChild>
                      <button
                        className={cn(
                          "group h-9 px-4 py-2 text-[15px] font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1 cursor-pointer outline-none",
                          isActive ? activeStyle : inactiveStyle,
                        )}
                      >
                        {localized(item, "title")}
                        <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-70" />
                      </button>
                    </HoverCardTrigger>

                    <HoverCardContent
                      align="start"
                      alignOffset={0}
                      sideOffset={20}
                      className="rounded-xl border border-border shadow-lg bg-popover text-popover-foreground p-0 w-auto z-50 overflow-hidden"
                    >
                      <div className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[550px] max-h-[80vh] overflow-y-auto">
                        {item.children
                          .filter((c) => c.status)
                          .map((child) => (
                            <div key={child.id} className="break-inside-avoid">
                              <RecursiveDesktopMenuItem
                                item={child}
                                level={0}
                              />
                            </div>
                          ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <Link
                  to={href}
                  className={cn(
                    "flex items-center justify-center h-9 px-4 py-2 text-[15px] font-medium transition-all duration-200 whitespace-nowrap outline-none",
                    isActive ? activeStyle : inactiveStyle,
                  )}
                >
                  {localized(item, "title")}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// --- MOBILE COMPONENTS ---

const RecursiveMobileMenuItem = ({
  item,
  closeSheet,
  level = 0,
}: {
  item: MenuItem;
  closeSheet: () => void;
  level?: number;
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const href = getHref(item);

  if (hasChildren) {
    return (
      <AccordionItem value={`item-${item.id}`} className="border-none">
        <AccordionTrigger
          className={cn(
            "py-3 px-4 text-base font-medium rounded-md hover:bg-muted/50 hover:no-underline transition-all [&[data-state=open]]:bg-muted/50 text-left",
            level > 0 && "text-sm py-2",
          )}
          style={{ paddingLeft: level > 0 ? `${level * 12 + 16}px` : "16px" }}
        >
          {localized(item, "title")}
        </AccordionTrigger>
        <AccordionContent className="pb-2 pt-1 px-0">
          <div className="flex flex-col space-y-1">
            <Accordion type="single" collapsible className="w-full">
              {item.children
                .filter((c) => c.status)
                .map((child) => (
                  <RecursiveMobileMenuItem
                    key={child.id}
                    item={child}
                    closeSheet={closeSheet}
                    level={level + 1}
                  />
                ))}
            </Accordion>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <NavLink
      to={href}
      onClick={closeSheet}
      className={({ isActive }) =>
        cn(
          "block py-3 px-4 text-base font-medium rounded-md transition-colors w-full text-left",
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "hover:bg-muted/50 text-foreground",
          level > 0 && "text-sm py-2.5",
        )
      }
      style={{ paddingLeft: level > 0 ? `${level * 12 + 16}px` : "16px" }}
    >
      {localized(item, "title")}
    </NavLink>
  );
};

// --- MAIN NAVBAR ---

export const Navbar = () => {
  const { data: company } = useCompanyInfo();
  const { i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: menuData = [] } = useMenus();

  const rootItems = menuData
    .filter((item) => item.parent === null && item.status)
    .sort((a, b) => a.position - b.position) as MenuItem[];

  const languages = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  const currentLang = languages.find(
    (l) => l.code == (i18n.resolvedLanguage || i18n.language),
  );

  const changeLang = (value: string) => {
    i18n.changeLanguage(value);
  };

  const API_URL = import.meta.env.VITE_API_URL || "";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-0 h-20 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={`${API_URL}${get(company, "logo")}`}
            alt="GGI Logo"
            className="h-14 w-auto md:h-14 object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <p className="text-sm text-muted-foreground font-medium w-[210px] md:w-[250px]">
              {localized(company, "name")}
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <DesktopMenu items={rootItems} />

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* SEARCH (DESKTOP) - MODAL ICON */}
          <div className="hidden md:block">
            <SearchDialogDesktop />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Select
              value={i18n.resolvedLanguage || i18n.language}
              onValueChange={changeLang}
            >
              <SelectTrigger className="w-[95px] h-9">
                <SelectValue>
                  {currentLang && (
                    <div className="flex items-center">
                      <FlagIcon code={currentLang.code} />
                      <span>{currentLang.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center">
                      <FlagIcon code={lang.code} />
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ModeToggle />
          </div>

          {/* MOBILE TOGGLE */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden h-10 w-10 focus-visible:ring-0"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[300px] sm:w-[360px] p-0 flex flex-col"
            >
              <SheetHeader className="p-6 border-b text-left flex flex-row items-center gap-4 space-y-0">
                <img
                  src={`${API_URL}${get(company, "logo")}`}
                  alt="Logo"
                  className="h-14 w-auto"
                />
                <SheetTitle className="text-sm text-muted-foreground leading-tight font-light">
                  {localized(company, "name")}
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 pb-6">
                {/* SEARCH (MOBILE) - ODDIY INPUT */}
                <div className="mt-6 px-2">
                  <SearchInputMobile
                    onSearch={() => setMobileOpen(false)}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-1"
                  >
                    {rootItems.map((item) => (
                      <RecursiveMobileMenuItem
                        key={item.id}
                        item={item}
                        closeSheet={() => setMobileOpen(false)}
                        level={0}
                      />
                    ))}
                  </Accordion>
                </div>
              </div>

              <div className="p-4 border-t bg-muted/20">
                <div className="flex items-center justify-between gap-4">
                  <Select
                    value={i18n.resolvedLanguage || i18n.language}
                    onValueChange={changeLang}
                  >
                    <SelectTrigger className="flex-1 h-10 bg-background rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center">
                            <FlagIcon code={lang.code} />
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="border border-input rounded-md bg-background p-1">
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
