import test from "node:test";
import assert from "node:assert/strict";
const disk = new Map();
globalThis.localStorage = {
  getItem: (k) => disk.get(k) || null,
  setItem: (k, v) => disk.set(k, v),
};
const { mockRequest } = await import("../src/api/mockApi.js");
test("diary edits and deletion survive a new module load", async () => {
  const created = await mockRequest("/coffee", {
    method: "POST",
    body: JSON.stringify({
      beanName: "Persistence test",
      drinkDate: "2026-10-13",
    }),
  });
  await mockRequest(`/coffee/${created.coffeeLogId}`, {
    method: "PUT",
    body: JSON.stringify({ beanName: "Updated bean" }),
  });
  const reloaded = await import("../src/api/mockApi.js?reload=1");
  assert.equal(
    (await reloaded.mockRequest("/coffee")).find(
      (x) => x.coffeeLogId === created.coffeeLogId,
    ).beanName,
    "Updated bean",
  );
  await reloaded.mockRequest(`/coffee/${created.coffeeLogId}`, {
    method: "DELETE",
  });
  const again = await import("../src/api/mockApi.js?reload=2");
  assert.equal(
    (await again.mockRequest("/coffee")).some(
      (x) => x.coffeeLogId === created.coffeeLogId,
    ),
    false,
  );
});
test("local accounts never claim administrator access", async () => {
  const user = await mockRequest("/auth/login", { method: "POST", body: "{}" });
  assert.equal(user.role, "USER");
  assert.equal(user.demo, true);
});

test("imported unknown brew method and ratings stay unknown on save", async () => {
  const created = await mockRequest("/coffee", {
    method: "POST",
    body: JSON.stringify({
      beanName: "Unrated imported coffee",
      drinkDate: "2026-10-07",
      brewMethod: "",
      roastLevel: "",
      brewDetails: { doseGrams: 16, waterGrams: 245 },
    }),
  });
  assert.equal(created.acidity, null);
  assert.equal(created.brewMethod, "");
  assert.equal(created.roastLevel, "");
  assert.equal(created.brewDetails.waterGrams, 245);
});
