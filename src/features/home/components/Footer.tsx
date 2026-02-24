import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { localized } from "@/i18n";
import { RiTelegram2Line } from "@remixicon/react";
import { get } from "lodash";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {

  const { i18n, t } = useTranslation();

  const { data: company } = useCompanyInfo();

  return (
    <footer className="relative bg-gradient-to-b from-background via-muted/50 to-muted border-t border-border/40">
      {/* Upper section */}
      <section className="container mx-auto px-4 md:px-0 py-16 grid grid-cols-1 sm:grid-cols-[0.8fr_0.8fr_1.4fr] gap-12">
        {/* Logo & description */}
        <div className="space-y-5">
          <a href="/" className="flex items-center gap-3">
            {get(company, "logo") ? (
              <img
                src={`${import.meta.env.VITE_API_URL || ""}${get(company, "logo")}`}
                alt="Logo"
                width={55}
              />
            ) : (
              <span className="flex h-[55px] w-[55px] items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary">
                GGI
              </span>
            )}
            <div>
              <h3 className="text-xl font-bold">GGI</h3>
              <p className="text-sm text-muted-foreground leading-tight font-light">
                {localized(company, "name")}
              </p>
            </div>
          </a>

          <p className="text-muted-foreground text-sm leading-relaxed font-light">
            {i18n.language === "uz"
              ? "Geologiya sohasida tadqiqot, ta'lim va innovatsiyalarda yetakchi institut."
              : i18n.language === "ru"
              ? "Ведущий институт в области исследований, образования и инноваций в геологии."
              : "A leading institute in research, education, and innovation in the field of geology."}
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {[
              {
                Icon: RiTelegram2Line,
                href: get(company, "telegram", "https://t.me"),
              },
              {
                Icon: Facebook,
                href: get(company, "facebook", "https://www.facebook.com"),
              },
              {
                Icon: Instagram,
                href: get(company, "instagram", "https://www.instagram.com"),
              },
              {
                Icon: Youtube,
                href: get(company, "youtube", "https://www.youtube.com"),
              },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-5">
          <h4 className="text-lg font-semibold text-foreground">
            {t("Aloqa")}
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground font-light">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                {localized(company, "address")}
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{get(company, "phone_number")}</div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{get(company, "email")}</div>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-border/40">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2995.5407936804695!2d69.33953268800994!3d41.340597837832625!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aef565c942bdd9%3A0xdbf2df130f626a7c!2z0JPQoyAi0JjQk9CY0KDQndCY0JPQnCIg0JjQndCh0KLQmNCi0KPQoiDQk9CV0J7Qm9Ce0JPQmNCYINCYINCg0JDQl9CS0JXQlNCa0Jgg0J3QldCk0KLQr9Cd0KvQpSDQmCDQk9CQ0JfQntCS0KvQpSDQnNCV0KHQotCe0KDQntCW0JTQldCd0JjQmQ!5e0!3m2!1sru!2s!4v1767847296064!5m2!1sru!2s"
            width="100%"
            height="200"
            loading="lazy"
            className="border-0"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border/90" />

      {/* Bottom copyright */}
      <section className="container mx-auto py-6 text-sm text-muted-foreground text-center">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">GGI</span>.{" "}
          {t("Barcha huquqlar himoyalangan.")}
        </p>
      </section>
    </footer>
  );
};
