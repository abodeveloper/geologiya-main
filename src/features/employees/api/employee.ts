import api from "@/lib/axios";

export const getEmployeeById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/employees/${id}/`);
  return response.data;
};


