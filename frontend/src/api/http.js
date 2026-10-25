import { mockRequest } from "./mockApi.js";
import { authStore } from "../store/authStore.js";
import {readApiResponse} from './response.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true";

export async function request(path, options = {}) {
  if (!USE_REAL_API) {
    return mockRequest(path, options);
  }

  const token = authStore.token;
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),45000);
  const cancel=()=>controller.abort();
  options.signal?.addEventListener('abort',cancel,{once:true});
  if(options.signal?.aborted)controller.abort();
  try {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    signal:controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if(response.status===401&&token&&!path.startsWith('/auth/'))authStore.expire();
  return await readApiResponse(response);
  } catch(error) {
    if(error.name==='AbortError')throw new Error('요청이 중단되었거나 응답 시간이 초과됐습니다. 저장 요청이었다면 목록에서 완료 여부를 확인해 주세요.');
    throw error;
  } finally {clearTimeout(timeout);options.signal?.removeEventListener('abort',cancel);}
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
