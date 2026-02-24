"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios"; // API ni import qildik
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Headset, Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { z } from "zod";

export const ContactFormModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // --- Schema Validatsiya (Contact.tsx bilan bir xil) ---
  const contactSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(2, { message: t("Ism kamida 2 ta harfdan iborat bo'lishi kerak.") }),
        phone: z.string().min(9, {
          message: t("Telefon raqami kamida 9 ta raqamdan iborat bo'lishi kerak."),
        }),
        message: z
          .string()
          .min(5, {
            message: t("Xabar kamida 5 ta harfdan iborat bo'lishi kerak."),
          }),
      }),
    [t]
  );

  type ContactFormValues = z.infer<typeof contactSchema>;

  // --- Form Setup ---
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
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
      reset(); // Formani tozalash
      setOpen(false); // Modalni yopish
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="iconLg"
          className="fixed bottom-12 right-12 z-50 shadow-lg"
        >
          <Headset className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("Xabar yuborish")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="modal-name">{t("Ismingiz")}</Label>
              <Input
                id="modal-name"
                placeholder={t("Ismingizni kiriting")}
                className={`h-12 bg-muted/30 border-border/50 placeholder:text-muted-foreground/60 ${
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="modal-phone">{t("Telefon raqamingiz")}</Label>
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
                    id="modal-phone"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="modal-message">{t("Xabaringiz")}</Label>
              <Textarea
                id="modal-message"
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
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              size="xl"
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
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;
