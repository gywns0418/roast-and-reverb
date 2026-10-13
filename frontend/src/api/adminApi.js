import { request, toQuery } from "./http.js";

export const adminApi = {
  dashboard: () => request("/admin/dashboard"),
  members: (params) => request(`/admin/members${toQuery(params)}`),
  apiLogs: (params) => request(`/admin/api-logs${toQuery(params)}`),
  dailyStatistics: (params) => request(`/admin/statistics/daily${toQuery(params)}`)
};
