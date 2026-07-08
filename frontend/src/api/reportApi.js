import { request } from "./http.js";

export const reportApi = { list: () => request("/report") };
