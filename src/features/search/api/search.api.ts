import api from "@/lib/axios";

export const getSearchData = async (q: string | undefined) => {
    const response = await api.get(`/main/search/?q=${q}`);
    return response.data;
};