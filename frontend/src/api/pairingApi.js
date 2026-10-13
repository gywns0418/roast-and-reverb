import { analyzePairing, readPreferences } from "../utils/pairingEngine.js";
import { jsonOptions, request, toQuery } from "./http.js";

export const pairingApi = {
  list: (params) => request(`/pairing${toQuery(params)}`),
  detail: (id, params) => request(`/pairing/${id}${toQuery(params)}`),
  latest: (params) => request(`/pairing/latest${toQuery(params)}`),
  recentCrate: (params) => request(`/pairing/recent-crate${toQuery(params)}`),
  create: (payload) => request("/pairing", jsonOptions("POST", payload)),
  remove: (id) => request(`/pairing/${id}`, { method: "DELETE" }),
  analyze: (payload) => payload.engine === "claude" ? request("/pairing/analyze", jsonOptions("POST", payload)) : Promise.resolve().then(() => analyzePairing(payload, readPreferences())),
  parseNaturalLog: (payload) => request("/pairing/parse-natural-log", jsonOptions("POST", payload))
};
