import { request } from "./http.js";

export const authApi = { list: () => request("/auth") };
