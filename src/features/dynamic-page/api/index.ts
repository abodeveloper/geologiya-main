import api from "@/lib/axios";
import type { DynamicPageData } from "../types";

export const getPageData = async (slug: string | undefined): Promise<DynamicPageData | null> => {
  const visitorId = localStorage.getItem("visitor_id");
  const headers: Record<string, string> = {};
  if (visitorId) {
    headers["x-visitor-id"] = visitorId;
  }

  const response = await api.get<DynamicPageData | null>(`/menu/pages-users/${slug}/`, { headers });

  const newVisitorId = response.headers["x-visitor-id"];
  if (newVisitorId) {
    localStorage.setItem("visitor_id", newVisitorId);
  }

  return response.data;
};