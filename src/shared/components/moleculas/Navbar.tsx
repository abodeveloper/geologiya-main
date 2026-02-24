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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
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
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useMenus } from "@/hooks/useMenus";
import { localized } from "@/i18n";
import { cn } from "@/lib/utils";
import type { LocalizedObject } from "@/shared/types/localized";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { get } from "lodash";
import { ChevronDown, ChevronRight, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
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

// --- HELPERS ---
const FlagIcon = ({ code }: { code: string }) => {
  const flags: Record<string, string> = { en: UkLogo, uz: UzLogo, ru: RuLogo };
  const src = flags[code];
  if (!src) return null;
  return <img src={src} alt={code} className="w-5 h-5 rounded-sm object-cover" />;
};

const getHref = (item: MenuItem) =>
  item.has_page && item.page_slug ? `/dynamic-page/${item.page_slug}` : "#";

const isItemActiveRecursive = (item: MenuItem, currentPath: string): boolean => {
  if (currentPath === getHref(item)) return true;
  if (item.children?.length)
    return item.children.some((c) => isItemActiveRecursive(c, currentPath));
  return false;
};

// --- SEARCH: MOBILE ---
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
      onSearch?.();
    }
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-11 pl-10 pr-4 rounded-xl border-border/60 bg-muted/30 focus-visible:ring-primary"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
};

// --- SEARCH: DESKTOP MODAL ---
const SearchDialogDesktop = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">{t("Qidirish")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl bg-card">
        <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-t-2xl" />
        <div className="p-6 pb-5">
          <DialogHeader className="p-0 mb-4">
            <DialogTitle className="text-base font-semibold text-foreground">
              {t("Sayt bo'ylab qidiruv")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex items-center rounded-xl border border-border/60 bg-muted/20 focus-within:bg-muted/30 focus-within:border-primary/40 transition-colors pl-4 pr-3 h-14">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground mr-3" />
              <input
                className="flex h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                placeholder={t("Nima qidiryapsiz?") + "..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <kbd className="inline-flex h-6 items-center rounded-md border border-border/60 bg-muted/50 px-2 font-mono text-[10px]">
                ↵
              </kbd>
              {t("tugmasini bosing")}
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- DESKTOP: bir qator — link yoki hover da o‘ngda submenyu ---
const DesktopSubmenuRow = ({
  item,
  onNavigate,
}: {
  item: MenuItem;
  onNavigate?: () => void;
}) => {
  const location = useLocation();
  const [nestedOpen, setNestedOpen] = useState(false);
  const href = getHref(item);
  const isActive = location.pathname === href;
  const hasChildren = item.children && item.children.length > 0;

  const rowClass = cn(
    "flex items-center justify-between gap-2 w-full py-2.5 px-3 text-sm rounded-lg transition-colors text-left select-none",
    isActive ? "text-primary font-semibold bg-primary/10" : "text-foreground/90 hover:text-primary hover:bg-muted/50",
  );

  if (!hasChildren) {
    return (
      <Link to={href} className={rowClass} onClick={onNavigate}>
        {localized(item as unknown as LocalizedObject, "title")}
      </Link>
    );
  }

  // Bolalari bor: hover yoki click da o‘ngda ochiladigan submenyu (click qayta ochish uchun boshqariladi)
  return (
    <HoverCard
      openDelay={150}
      closeDelay={120}
      open={nestedOpen}
      onOpenChange={setNestedOpen}
    >
      <HoverCardTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn("group cursor-pointer", rowClass)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setNestedOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setNestedOpen((prev) => !prev);
            }
          }}
        >
          <span>{localized(item as unknown as LocalizedObject, "title")}</span>
          <ChevronRight className="h-3.5 w-3.5 opacity-70 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
        </div>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent
          side="right"
          align="start"
          alignOffset={0}
          sideOffset={8}
          className="w-[240px] rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl p-2 z-[100] select-none"
        >
          <div className="flex flex-col gap-0.5 max-h-[70vh] overflow-y-auto">
            {item.children
              .filter((c) => c.status)
              .map((child) => (
                <DesktopSubmenuRow key={child.id} item={child} onNavigate={onNavigate} />
              ))}
          </div>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
};

// --- DESKTOP NAV ---
const DesktopMenu = ({ items }: { items: MenuItem[] }) => {
  const location = useLocation();
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  useEffect(() => {
    setOpenCardId(null);
  }, [location.pathname]);

  const linkBase =
    "flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none";
  const activeStyle = "text-primary bg-primary/10 hover:bg-primary/15";
  const inactiveStyle = "text-muted-foreground hover:text-foreground hover:bg-muted/50";

  return (
    <div className="hidden md:flex flex-1 min-w-0 justify-center px-6">
      <nav className="w-full max-w-3xl overflow-x-auto overflow-y-hidden no-scrollbar min-w-0 flex justify-start">
        <ul className="flex items-center justify-start gap-0.5 p-1 w-max">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const href = getHref(item);
            const isActive = isItemActiveRecursive(item, location.pathname);

            if (hasChildren) {
              const isOpen = openCardId === item.id;
              return (
                <li key={item.id}>
                  <HoverCard
                    openDelay={150}
                    closeDelay={120}
                    open={isOpen}
                    onOpenChange={(open) => setOpenCardId(open ? item.id : null)}
                  >
                    <HoverCardTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          linkBase,
                          "group gap-1.5 cursor-pointer",
                          isActive ? activeStyle : inactiveStyle,
                        )}
                        onClick={() => setOpenCardId((prev) => (prev === item.id ? null : item.id))}
                      >
                        {localized(item as unknown as LocalizedObject, "title")}
                        <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardPortal>
                      <HoverCardContent
                        side="bottom"
                        align="center"
                        alignOffset={0}
                        sideOffset={2}
                        avoidCollisions
                        collisionPadding={16}
                        className="w-[280px] max-w-[90vw] max-h-[70vh] overflow-y-auto overflow-x-visible rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl pt-1.5 pb-2 px-2 z-50 select-none"
                      >
                        <div className="flex flex-col gap-0.5">
                          {item.children
                            .filter((c) => c.status)
                            .map((child) => (
                              <DesktopSubmenuRow
                                key={child.id}
                                item={child}
                                onNavigate={() => setOpenCardId(null)}
                              />
                            ))}
                        </div>
                      </HoverCardContent>
                    </HoverCardPortal>
                  </HoverCard>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <Link
                  to={href}
                  className={cn(linkBase, isActive ? activeStyle : inactiveStyle)}
                >
                  {localized(item as unknown as LocalizedObject, "title")}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// --- MOBILE MENU (recursive) ---
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
            "py-3.5 px-4 text-[15px] font-medium rounded-xl hover:bg-muted/50 hover:no-underline transition-colors text-left [&[data-state=open]]:bg-muted/50",
            level > 0 && "text-sm py-2.5",
          )}
          style={{ paddingLeft: level > 0 ? 16 + level * 14 : 16 }}
        >
          {localized(item as unknown as LocalizedObject, "title")}
        </AccordionTrigger>
        <AccordionContent className="pb-2 pt-0 px-0">
          <div className="flex flex-col gap-0.5">
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
          "block py-3.5 px-4 text-[15px] font-medium rounded-xl transition-colors w-full text-left",
          isActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted/50 text-foreground",
          level > 0 && "text-sm py-2.5",
        )
      }
      style={{ paddingLeft: level > 0 ? 16 + level * 14 : 16 }}
    >
      {localized(item as unknown as LocalizedObject, "title")}
    </NavLink>
  );
};

// --- MAIN NAVBAR ---
export const Navbar = () => {
  const { data: company } = useCompanyInfo();
  const { i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: menuData = [] } = useMenus();

  const rootItems = (menuData as MenuItem[])
    .filter((item) => item.parent === null && item.status)
    .sort((a, b) => a.position - b.position);

  const languages = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];
  const currentLang = languages.find(
    (l) => l.code === (i18n.resolvedLanguage || i18n.language),
  );

  const API_URL = import.meta.env.VITE_API_URL || "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 overflow-visible select-none">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4 overflow-visible">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group min-w-0">
          <img
            src={`${API_URL}${get(company, "logo")}`}
            alt="GGI Logo"
            className="h-11 w-auto md:h-12 object-contain transition-transform duration-200 group-hover:scale-[1.02] shrink-0"
          />
          <div className="hidden sm:flex flex-col leading-tight min-w-0 max-w-[200px] md:max-w-[240px]">
            <span className="text-sm font-semibold text-foreground line-clamp-2 break-words">
              {localized(company as LocalizedObject, "name")}
            </span>
          </div>
        </Link>

        <DesktopMenu items={rootItems} />

        {/* Right: search, lang, theme, mobile toggle */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <div className="hidden md:block">
            <SearchDialogDesktop />
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Select
              value={i18n.resolvedLanguage || i18n.language}
              onValueChange={(v) => i18n.changeLanguage(v)}
            >
              <SelectTrigger className="h-9 w-[70px] rounded-lg border-border/60 bg-transparent hover:bg-muted/50">
                <SelectValue>
                  {currentLang && (
                    <div className="flex items-center gap-2">
                      {/* <FlagIcon code={currentLang.code} /> */}
                      <span className="text-sm font-medium">{currentLang.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/60">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <FlagIcon code={lang.code} />
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ModeToggle />
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10 rounded-xl text-foreground hover:bg-muted/60"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[340px] p-0 flex flex-col rounded-r-2xl border-l border-border/60 select-none"
            >
              <SheetHeader className="p-5 pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <img
                    src={`${API_URL}${get(company, "logo")}`}
                    alt="Logo"
                    className="h-11 w-auto shrink-0"
                  />
                  <SheetTitle className="text-sm font-semibold text-foreground leading-tight">
                    {localized(company as LocalizedObject, "name")}
                  </SheetTitle>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="mb-5">
                  <SearchInputMobile onSearch={() => setMobileOpen(false)} />
                </div>
                <Accordion type="single" collapsible className="w-full space-y-0.5">
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

              <div className="p-4 border-t border-border/40 bg-muted/20 rounded-br-2xl">
                <div className="flex items-center gap-3">
                  <Select
                    value={i18n.resolvedLanguage || i18n.language}
                    onValueChange={(v) => i18n.changeLanguage(v)}
                  >
                    <SelectTrigger className="flex-1 h-10 rounded-xl bg-background border-border/60">
                      <SelectValue>
                        {currentLang && (
                          <div className="flex items-center gap-2">
                            <FlagIcon code={currentLang.code} />
                            <span>{currentLang.label}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <FlagIcon code={lang.code} />
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="rounded-xl border border-border/60 bg-background p-1">
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
