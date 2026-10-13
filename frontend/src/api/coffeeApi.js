import { jsonOptions, request, toQuery } from "./http.js";

export const coffeeApi = {
  list: (params) => request(`/coffee${toQuery(params)}`),
  detail: (id, params) => request(`/coffee/${id}${toQuery(params)}`),
  create: (payload) => request("/coffee", jsonOptions("POST", payload)),
  update: (id, payload) => request(`/coffee/${id}`, jsonOptions("PUT", payload)),
  remove: (id) => request(`/coffee/${id}`, { method: "DELETE" }),
  calendar: (params) => request(`/coffee/calendar${toQuery(params)}`),
  statistics: (params) => request(`/coffee/statistics${toQuery(params)}`)
};
