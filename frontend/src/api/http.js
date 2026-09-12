import { mockRequest } from "./mockApi.js";
import { authStore } from "../store/authStore.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true";

export async function request(path, options = {}) {
  if (!USE_REAL_API) {
    return mockRequest(path, options);
  }

  const token = authStore.token;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || "API 요청에 실패했습니다.");
    error.status = response.status;
    throw error;
  }
  return payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
}

export function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function jsonOptions(method, body) {
  return {
    method,
    body: JSON.stringify(body)
  };
}
