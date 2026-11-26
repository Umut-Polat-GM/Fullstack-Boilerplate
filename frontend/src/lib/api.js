import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Pre-configured axios instance for the backend.
 * - baseURL: VITE_API_URL or same-origin `/api` (proxied by Vite in dev)
 * - attaches the bearer token from the auth store
 * - unwraps the `{ success, data }` envelope → resolves with `data`
 * - normalises errors → `error.message` is always human readable
 */
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    const payload = error.response?.data;
    const normalized = new Error(payload?.message || error.message || "Unexpected error");
    normalized.status = error.response?.status;
    normalized.errors = payload?.errors;

    if (normalized.status === 401) useAuthStore.getState().logout();

    return Promise.reject(normalized);
  },
);
