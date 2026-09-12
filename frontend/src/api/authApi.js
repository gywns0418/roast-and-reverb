import { jsonOptions, request } from "./http.js";

export const authApi = {
  login: (payload) => request("/auth/login", jsonOptions("POST", payload)),
  join: (payload) => request("/auth/join", jsonOptions("POST", payload)),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/members/me"),
  updateMe: (payload) => request("/members/me", jsonOptions("PUT", payload))
};
