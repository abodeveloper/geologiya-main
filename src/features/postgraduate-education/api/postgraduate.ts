import api from "@/lib/axios";

export const getPostgraduateById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/postgraduate-education/${id}/`);
  return response.data;
};


