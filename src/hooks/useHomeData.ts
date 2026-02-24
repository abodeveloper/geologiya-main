import { fetchHomeData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useHomeData = () => {
    return useQuery({
        queryKey: ["home-data"],
        queryFn: fetchHomeData,
    });
};