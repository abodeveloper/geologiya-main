import api from "@/lib/axios";
import { Menu } from "../types";

export const getAllMenus = async (): Promise<Menu[]> => {
  const { data } = await api.get("/menu/menus/");
  return data;
};
