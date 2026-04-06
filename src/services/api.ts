import api from "@/lib/axios";

export type CompanyInfo = {
    test_status?: boolean;
};

export const fetchCompanyInfo = async (): Promise<CompanyInfo> => {
    const response = await api.get<CompanyInfo>("/main/company");
    return response.data;
};

export const fetchMenus = async () => {
    const response = await api.get("/menu/menus"); // endpoint manzili
    return response.data;
};

export const fetchHomeData = async () => {
    const response = await api.get("/main/home"); // endpoint manzili
    return response.data;
};