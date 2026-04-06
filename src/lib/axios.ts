import axios, { type AxiosResponse } from "axios";
import { getApiUrl } from "@/lib/env";

const VISITOR_STORAGE_KEY = "visitor_id";
const VISITOR_HEADER = "x-visitor-id";

function readVisitorIdFromResponseHeaders(
  headers: AxiosResponse["headers"],
): string | undefined {
  const raw = headers[VISITOR_HEADER] ?? headers["X-Visitor-Id"];
  if (raw == null) return undefined;
  return Array.isArray(raw) ? raw[0] : String(raw);
}

const api = axios.create({
  baseURL: getApiUrl(),
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const visitorId = localStorage.getItem(VISITOR_STORAGE_KEY);
  if (visitorId) {
    config.headers.set(VISITOR_HEADER, visitorId);
  }
  return config;
});

api.interceptors.response.use((response) => {
  if (typeof window === "undefined") return response;

  const newId = readVisitorIdFromResponseHeaders(response.headers);
  if (newId) {
    localStorage.setItem(VISITOR_STORAGE_KEY, newId);
  }
  return response;
});

export default api;
