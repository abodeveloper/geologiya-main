import api from "@/lib/axios";

export const getLastNews = async () => {
  const response = await api.get(`/api/posts/`);
  return response.data.results;
};

export const getNewsById = async (id: string | number | undefined) => {
  const response = await api.get(`/api/posts/${id}/`);
  return response.data;
};


// --- TYPE DEFINITIONS ---
export interface NewsItem {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  image?: string;
  pages: number[];
  published_date: string;
  status: boolean;
  type: "news" | "announcement";
}

export interface NewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsItem[];
}

// YANGILANDI: limit/offset o'rniga page/page_size
interface GetNewsParams {
  page?: number;      // Hozirgi sahifa raqami
  page_size?: number; // Sahifada nechta ko'rsatish
  type?: string;      // Filter turi
}

export const getNews = async (params?: GetNewsParams): Promise<NewsResponse> => {
  // Default qiymatlar: 1-sahifa, har sahifada 9 tadan
  const { page = 1, page_size = 9, type = "all" } = params || {};

  const queryParams = new URLSearchParams();

  // Parametrlarni qo'shamiz
  queryParams.append("page", page.toString());
  queryParams.append("page_size", page_size.toString());

  if (type && type !== "all") {
    queryParams.append("type", type);
  }

  const response = await api.get(`/api/posts/?${queryParams.toString()}`);
  return response.data;
};