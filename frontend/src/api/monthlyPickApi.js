import { request } from "./http.js";

function unwrap(promise) {
  return promise.then((res) => res.data);
}

export const monthlyPickApi = {
  list: () => unwrap(request("/monthly-picks")),
  detail: (id) => unwrap(request(`/monthly-picks/${id}`)),
  create: (payload) => unwrap(request("/monthly-picks", { method: "POST", body: JSON.stringify(payload) })),
  score: (id) => unwrap(request(`/monthly-picks/${id}/score`, { method: "POST" }))
};
