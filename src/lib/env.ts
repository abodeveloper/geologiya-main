const VITE_API_URL = import.meta.env.VITE_API_URL as string | undefined;

export const getApiUrl = (): string => {
  const url = VITE_API_URL?.trim() || "";
  if (import.meta.env.DEV && !url) {
    console.warn("VITE_API_URL o‘rnatilmagan. .env faylida VITE_API_URL=... qo‘ying.");
  }
  return url;
};
