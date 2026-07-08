import { request } from "./http.js";

export const adminApi = { list: () => request("/admin") };
