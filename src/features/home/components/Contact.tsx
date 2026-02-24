import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const { t } = useTranslation();

  const { data: company } = useCompanyInfo();

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

  return (
    <section id="contact" className="py-16 md:py-28 bg-muted/50">
      <div className="container max-w-5xl mx-auto px-4 md:px-0 space-y-16">
        <Fade delay={300} duration={1000} triggerOnce direction="up">
          <Card className="bg-background/80 backdrop-blur-xl border border-border/40 shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-12 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Chap tomon... */}
                <div className="flex flex-col justify-between space-y-8 h-full">
                  <div className="w-fit">
                    <img
                      src={`${import.meta.env.VITE_API_URL || ""}${get(company, "logo")}`}
                      alt="Logo"
                      width={70}
                    />
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      {t("Biz bilan bog'laning")}
                    </h2>
                    <p className="text-xl text-muted-foreground font-light">
                      {t(
                        "Sizdan xabar olishdan xursand bo'lamiz. Savolingiz, fikr-mulohazangiz bo'lsa biz bilan bog'laning!",
                      )}
                    </p>
                  </div>

                  {/* Iconlar... */}

                  <div className="flex gap-3 flex-wrap">
                    {[
                      {
                        Icon: RiTelegram2Line,
                        href: get(company, "telegram", "https://t.me"),
                      },
                      {
                        Icon: Facebook,
                        href: get(
                          company,
                          "facebook",
                          "https://www.facebook.com",
                        ),
                      },
                      {
                        Icon: Instagram,
                        href: get(
                          company,
                          "instagram",
                          "https://www.instagram.com",
                        ),
                      },
                      {
                        Icon: Youtube,
                        href: get(
                          company,
                          "youtube",
                          "https://www.youtube.com",
                        ),
                      },
                    ].map(({ Icon, href }, i) => (
                      <a
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-muted/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* O'ng tomon: Forma */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("Ismingiz")}</Label>
                      <Input
                        id="name"
                        placeholder={t("Ismingizni kiriting")}
                        className={`h-12 bg-muted/30 border-border/50 placeholder:text-muted-foreground/60 ${
                          errors.name
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("Telefon raqamingiz")}</Label>
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
                            className={`phone-input-custom pl-4 ${
                              errors.phone ? "border-red-500" : ""
                            }`}
                            id="phone"
                          />
                        )}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">{t("Xabaringiz")}</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder={t("Xabaringizni shu yerga yozing")}
                        className={`bg-muted/30 border-border/50 resize-none placeholder:text-muted-foreground/60 ${
                          errors.message
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full"
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
                </div>
              </div>
            </CardContent>
          </Card>
        </Fade>
      </div>
    </section>
  );
};

export default Contact;
