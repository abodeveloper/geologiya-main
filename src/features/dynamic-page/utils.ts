import { getApiUrl } from "@/lib/env";

export const getAbsoluteUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = getApiUrl();
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};
