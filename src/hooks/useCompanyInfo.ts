import { useQuery } from "@tanstack/react-query";
import { fetchCompanyInfo } from "@/services/api";

export const useCompanyInfo = () => {
    return useQuery({
        queryKey: ["company-info"], // Bu kalit orqali ma'lumot keshlanadi
        queryFn: fetchCompanyInfo,
        staleTime: Infinity, // Ma'lumot ilova yopilguncha "eski" hisoblanmaydi (qayta so'rov ketmaydi)
        refetchOnWindowFocus: false, // Oynaga qaytganda qayta yuklamaslik
    });
};