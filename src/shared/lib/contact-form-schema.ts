import { z } from "zod";

type TFunction = (key: string) => string;

export function getContactSchema(t: TFunction) {
  return z.object({
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
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;
