import api from "@/lib/axios";

export const getDepartmentById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/departments/${id}/`);
  return response.data;
};


