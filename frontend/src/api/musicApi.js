import { jsonOptions, request, toQuery } from "./http.js";

export const musicApi = {
  list: (params) => request(`/music${toQuery(params)}`),
  detail: (id, params) => request(`/music/${id}${toQuery(params)}`),
  create: (payload) => request("/music", jsonOptions("POST", payload)),
  update: (id, payload) => request(`/music/${id}`, jsonOptions("PUT", payload)),
  remove: (id) => request(`/music/${id}`, { method: "DELETE" }),
  recentTags: (params) => request(`/music/tags/recent${toQuery(params)}`),
  searchLastfm: (keyword) => request(`/music/search/lastfm${toQuery({ keyword })}`),
  searchDiscogs: (keyword) => request(`/music/search/discogs${toQuery({ keyword })}`)
};
