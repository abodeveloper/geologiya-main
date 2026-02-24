import api from "@/lib/axios";

export const getScientificById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/scientific-direction/${id}/`);
  return response.data;
};


