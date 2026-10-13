import { request, toQuery } from "./http.js";

export const reportApi = {
  monthly: (params) => request(`/report/monthly${toQuery(params)}`),
  list: (params) => request(`/report${toQuery(params)}`)
};
