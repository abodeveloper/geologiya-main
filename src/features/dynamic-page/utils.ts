import { getImageUrl } from "@/lib/utils";

export const getAbsoluteUrl = (path: string): string => {
  return getImageUrl(path, "");
};
