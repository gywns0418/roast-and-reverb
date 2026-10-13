import { jsonOptions, request, toQuery } from "./http.js";

export const collectionApi = {
  list: (params) => request(`/collection${toQuery(params)}`),
  create: (payload) => request("/collection", jsonOptions("POST", payload))
};
