"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";

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
import api from "@/lib/axios";
import {
  type ContactFormValues,
  getContactSchema,
} from "@/shared/lib/contact-form-schema";
import { Headset, Loader2, Send } from "lucide-react";

export function ContactFormModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const contactSchema = useMemo(() => getContactSchema(t), [t]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await api.post("/parts/applications/", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz."));
      reset();
      setOpen(false);
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error("Yuborishda xatolik:", error);
      toast.error(t("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."));
    },
  });

  const onSubmit = (data: ContactFormValues) => mutation.mutate(data);

  const inputErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";
  const fieldClass =
    "h-11 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="iconLg"
          className="fixed bottom-12 right-12 z-50 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-0 transition-all duration-300"
        >
          <Headset className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden p-0 gap-0 border border-border/50 bg-card/80 dark:bg-card/70 backdrop-blur-sm shadow-2xl rounded-2xl ring-1 ring-black/5 dark:ring-white/5">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-accent rounded-t-2xl shrink-0" />
        <div className="p-6 md:p-8 pr-12 overflow-y-auto max-h-[calc(90vh-4px)]">
          <DialogHeader className="text-left space-y-1 pb-5 border-b border-border/40">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("Aloqa")}
            </p>
            <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary/90 to-accent text-transparent bg-clip-text">
                {t("Xabar yuborish")}
              </span>
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="modal-name" className="text-sm font-medium text-foreground">
                {t("Ismingiz")}
              </Label>
              <Input
                id="modal-name"
                placeholder={t("Ismingizni kiriting")}
                className={`${fieldClass} ${inputErrorClass(!!errors.name)}`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-phone" className="text-sm font-medium text-foreground">
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
                    className={`phone-input-custom rounded-xl bg-background border border-border text-foreground pl-4 h-11 focus-visible:ring-2 focus-visible:ring-primary/40 ${errors.phone ? "border-red-500" : ""}`}
                    id="modal-phone"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-message" className="text-sm font-medium text-foreground">
                {t("Xabaringiz")}
              </Label>
              <Textarea
                id="modal-message"
                rows={5}
                placeholder={t("Xabaringizni shu yerga yozing")}
                className={`${fieldClass} rounded-xl resize-none ${inputErrorClass(!!errors.message)}`}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              size="xl"
              className="w-full h-12 rounded-xl font-medium bg-gradient-to-r from-primary to-primary/90 hover:opacity-95 shadow-md hover:shadow-lg transition-all duration-300 gap-2"
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
}

export default ContactFormModal;
