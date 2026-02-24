import axios from "axios";
import { getApiUrl } from "@/lib/env";

const api = axios.create({
  baseURL: getApiUrl(),
});

export default api;
