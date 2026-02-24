import api from "@/lib/axios";

export const fetchCompanyInfo = async () => {
    const response = await api.get("/main/company"); // endpoint manzili
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