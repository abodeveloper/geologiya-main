import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook,
  Instagram,
  Loader2,
  Send,
  Youtube
} from "lucide-react";
import { Fade } from "react-awesome-reveal";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiTelegram2Line } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { get } from "lodash";
import { useMemo } from "react"; // <--- useMemo import qilamiz
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

export const Contact = () => {
  const { t, i18n } = useTranslation();
  const { data: company } = useCompanyInfo();

  const headline =
    i18n.language === "uz"
      ? { label: "Aloqa", title: "Biz bilan", highlight: "bog'laning" }
      : i18n.language === "ru"
        ? { label: "Контакты", title: "Свяжитесь", highlight: "с нами" }
        : { label: "Contact", title: "Get in", highlight: "touch" };

  const description =
    i18n.language === "uz"
      ? "Savolingiz yoki taklifingiz bo'lsa — xabar qoldiring, tez orada javob beramiz."
      : i18n.language === "ru"
        ? "Оставьте сообщение — мы ответим в ближайшее время."
        : "Leave a message and we'll get back to you soon.";

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(2, { message: t("Ism kamida 2 ta harfdan iborat bo'lishi kerak.") }),
        phone: z.string().min(9, {
          message: t("Telefon raqami kamida 9 ta raqamdan iborat bo'lishi kerak."),
        }),
        message: z.string().min(5, {
          message: t("Xabar kamida 5 ta harfdan iborat bo'lishi kerak."),
        }),
      }),
    [t],
  ); // "t" o'zgarsa schema yangilanadi (til o'zgarganda)

  // Turni shu yerni o'zida olish
  type ContactFormValues = z.infer<typeof contactSchema>;

  // --- Form Setup ---
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema), // Ichkaridagi schemani ulaymiz
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  // --- API Request ---
  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await api.post(`/parts/applications/`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz."));
      reset();
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error("Yuborishda xatolik:", error);
      toast.error(t("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."));
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  const socials = [
    { Icon: RiTelegram2Line, href: get(company, "telegram", "https://t.me") },
    { Icon: Facebook, href: get(company, "facebook", "https://www.facebook.com") },
    { Icon: Instagram, href: get(company, "instagram", "https://www.instagram.com") },
    { Icon: Youtube, href: get(company, "youtube", "https://www.youtube.com") },
  ];

  return (
    <section id="contact" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:32px_32px] bg-repeat" />

      <div className="container relative max-w-5xl mx-auto px-4 md:px-6">
        <div className="space-y-14 md:space-y-16">
          {/* Header — About / HowItWorks ga mos */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Fade triggerOnce duration={600} direction="up" cascade damping={0.4}>
              <p className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-primary">
                {headline.label}
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                {headline.title}{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-accent text-transparent bg-clip-text">
                  {headline.highlight}
                </span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {description}
              </p>
            </Fade>
          </div>

          {/* Kartochka — ustki qator (logo + sarlavha + matn), pastda forma | ijtimoiy */}
          <Fade triggerOnce delay={200} duration={500} direction="up">
            <div className="relative rounded-2xl border border-border/50 bg-card/70 dark:bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-accent" />

              {/* Ustki qator: logo, sarlavha, tavsif — bitta gorizontal blok */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 p-6 md:px-10 md:pt-10 pb-4 border-b border-border/40">
                <img
                  src={`${import.meta.env.VITE_API_URL || ""}${get(company, "logo")}`}
                  alt="Logo"
                  width={56}
                  height={56}
                  className="object-contain shrink-0"
                />
                <div className="h-10 w-px bg-border/60 hidden sm:block rounded-full" />
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground">
                    {i18n.language === "uz" ? "Xabar yuboring" : i18n.language === "ru" ? "Напишите нам" : "Send a message"}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
                    {t("Sizdan xabar olishdan xursand bo'lamiz. Savolingiz yoki fikringiz bo'lsa yozing.")}
                  </p>
                </div>
              </div>

              {/* Pastki qism: forma (chap) | ijtimoiy (o'ng) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-10 lg:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t("Ismingiz")}
                    </Label>
                    <Input
                      id="name"
                      placeholder={t("Ismingizni kiriting")}
                      className={`h-11 rounded-xl bg-muted/30 border-border/50 placeholder:text-muted-foreground/60 ${
                        errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t("Telefon raqamingiz")}
                    </Label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          defaultCountry="UZ"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("Telefon raqamni kiriting")}
                          className={`phone-input-custom rounded-xl bg-muted/30 border-border/50 pl-4 ${errors.phone ? "border-red-500" : ""}`}
                          id="phone"
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      {t("Xabaringiz")}
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder={t("Xabaringizni shu yerga yozing")}
                      className={`rounded-xl bg-muted/30 border-border/50 resize-none placeholder:text-muted-foreground/60 ${
                        errors.message ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-12 rounded-xl font-medium"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("Yuborilmoqda...")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("Yuborish")}
                      </>
                    )}
                  </Button>
                </form>

                {/* O'ng ustun: xarita + ijtimoiy tarmoqlar */}
                <div className="flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border/40 pt-8 lg:pt-0 lg:pl-8">
                  <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 shadow-sm h-[220px] sm:h-[260px] min-h-[200px]">
                    <iframe
                      title="Yandex Map"
                      src="https://yandex.ru/map-widget/v1/?ll=69.339532%2C41.340597&z=16&l=map"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      className="border-0 block w-full h-full min-h-[200px]"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                      {i18n.language === "uz" ? "Ijtimoiy tarmoqlar" : i18n.language === "ru" ? "Соцсети" : "Follow us"}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {socials.map(({ Icon, href }, i) => (
                        <a
                          key={i}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-muted/60 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300"
                          aria-label="Social link"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};

export default Contact;
