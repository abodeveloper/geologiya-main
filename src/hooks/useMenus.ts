import { fetchMenus } from "@/services/api"; // API chaqiruvi
import { useQuery } from "@tanstack/react-query";

export const useMenus = () => {
    return useQuery({
        queryKey: ["site-menus"],
        queryFn: fetchMenus,
        staleTime: Infinity, // Menyu ham tez-tez o'zgarmaydi
        refetchOnWindowFocus: false,
    });
};