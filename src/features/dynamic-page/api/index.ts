import api from "@/lib/axios";
import type { DynamicPageData } from "../types";

export const getPageData = async (slug: string | undefined): Promise<DynamicPageData | null> => {
  const response = await api.get<DynamicPageData | null>(`/menu/pages-users/${slug}/`);
  return response.data;
};