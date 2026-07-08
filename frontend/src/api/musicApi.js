import { request } from "./http.js";

export const musicApi = { list: () => request("/music") };
