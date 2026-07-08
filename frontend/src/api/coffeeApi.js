import { request } from "./http.js";

export const coffeeApi = { list: () => request("/coffee") };
