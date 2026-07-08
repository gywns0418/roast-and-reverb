import { request } from "./http.js";

export const pairingApi = { list: () => request("/pairing") };
