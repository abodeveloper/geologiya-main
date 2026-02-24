import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { localized } from "@/i18n";
import { LocalizedObject } from "@/shared/types/localized";
import { RiTelegram2Line } from "@remixicon/react";
import { get } from "lodash";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { i18n, t } = useTranslation();
  const { data: company } = useCompanyInfo();

  const socials = [
    { Icon: RiTelegram2Line, href: get(company, "telegram", "https://t.me") },
    { Icon: Facebook, href: get(company, "facebook", "https://www.facebook.com") },
    { Icon: Instagram, href: get(company, "instagram", "https://www.instagram.com") },
    { Icon: Youtube, href: get(company, "youtube", "https://www.youtube.com") },
  ];

  const tagline =
    i18n.language === "uz"
      ? "Geologiya sohasida tadqiqot, ta'lim va innovatsiyalarda yetakchi institut."
      : i18n.language === "ru"
        ? "Ведущий институт в области исследований, образования и инноваций в геологии."
        : "A leading institute in research, education, and innovation in the field of geology.";

  return (
    <footer className="relative border-t border-border/50 bg-muted/20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <section className="container relative mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Logo, tagline, social */}
          <div className="lg:col-span-4 space-y-6">
            <a href="/" className="inline-flex items-center gap-3 group">
              {get(company, "logo") ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || ""}${get(company, "logo")}`}
                  alt="Logo"
                  width={52}
                  height={52}
                  className="object-contain"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  GGI
                </span>
              )}
              <div className="flex-col leading-tight min-w-0 max-w-[200px] md:max-w-[240px]">
                <span className="text-sm font-semibold text-foreground line-clamp-2 break-words">
                  {localized(company as LocalizedObject, "name")}
                </span>
              </div>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {tagline}
            </p>
            <div className="flex gap-2">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-background/80 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  aria-label="Social"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("Aloqa")}
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="leading-relaxed pt-1">
                  {localized(company, "address")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-4 h-4" />
                </span>
                <span>{get(company, "phone_number")}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-4 h-4" />
                </span>
                <span>{get(company, "email")}</span>
              </li>
            </ul>
          </div>

          {/* Map — kattaroq joy */}
          <div className="lg:col-span-5 min-h-[250px] md:min-h-0">
            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 shadow-sm h-[260px] md:h-[210px]">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2995.5407936804695!2d69.33953268800994!3d41.340597837832625!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aef565c942bdd9%3A0xdbf2df130f626a7c!2z0JPQoyAi0JjQk9CY0KDQndCY0JPQnCIg0JjQndCh0KLQmNCi0KPQoiDQk9CV0J7Qm9Ce0JPQmNCYINCYINCg0JDQl9CS0JXQlNCa0Jgg0J3QldCk0KLQr9Cd0KvQpSDQmCDQk9CQ0JfQntCS0KvQpSDQnNCV0KHQotCe0KDQntCW0JTQldCd0JjQmQ!5e0!3m2!1sru!2s!4v1767847296064!5m2!1sru!2s"
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0 block"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border/50" />
      <section className="container relative max-w-6xl mx-auto px-4 md:px-6 py-5">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">GGI</span>.{" "}
          {t("Barcha huquqlar himoyalangan.")}
        </p>
      </section>
    </footer>
  );
};
