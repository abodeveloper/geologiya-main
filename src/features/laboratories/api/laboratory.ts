import api from "@/lib/axios";

export const getLaboratoryById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/laboratories/${id}/`);
  return response.data;
};


