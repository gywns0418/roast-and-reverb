import test from "node:test";
import assert from "node:assert/strict";
import {
  MONTHLY_FAVORITES_KEY,
  readMonthlyFavorites,
  saveMonthlyFavorite,
  toggleMonthlyComparison,
} from "../src/utils/monthlyPreferences.js";
function storage(raw = null) {
  return {
    raw,
    getItem() {
      return this.raw;
    },
    setItem(key, value) {
      assert.equal(key, MONTHLY_FAVORITES_KEY);
      this.raw = value;
    },
  };
}
test("monthly favorites reuse previous ids and survive reload and removal", () => {
  const disk = storage('["901-49",945]');
  let ids = readMonthlyFavorites(disk);
  assert.deepEqual(ids, ["901-49", "945"]);
  ids = saveMonthlyFavorite(disk, ids, "945-39");
  assert.deepEqual(readMonthlyFavorites(disk), ids);
  ids = saveMonthlyFavorite(disk, ids, "901-49");
  assert.deepEqual(readMonthlyFavorites(disk), ["945", "945-39"]);
});
test("corrupted favorites and quota failure preserve the original collection", () => {
  const disk = storage("broken");
  assert.throws(() => saveMonthlyFavorite(disk, [], "901-49"));
  assert.equal(disk.raw, "broken");
  const ids = ["901-49"];
  const full = storage(JSON.stringify(ids));
  full.setItem = () => {
    throw Error("quota");
  };
  assert.throws(() => saveMonthlyFavorite(full, ids, "945-39"));
  assert.deepEqual(ids, ["901-49"]);
  assert.deepEqual(readMonthlyFavorites(full), ids);
});
test("comparison selection stays across series, is reversible and limited to three", () => {
  let ids = [];
  for (const id of ["901-49", "945-39", "930-1"])
    ids = toggleMonthlyComparison(ids, id);
  assert.throws(() => toggleMonthlyComparison(ids, "extra"));
  assert.equal(ids.length, 3);
  assert.deepEqual(toggleMonthlyComparison(ids, "945-39"), ["901-49", "930-1"]);
});
test("saving a favorite keeps updates made by another tab and honors an explicit removal", () => {
  const disk = storage('["901-49"]'),
    visible = readMonthlyFavorites(disk);
  disk.raw = '["901-49","945-39"]';
  assert.deepEqual(saveMonthlyFavorite(disk, visible, "930-1"), [
    "901-49",
    "945-39",
    "930-1",
  ]);
  disk.raw = '["945-39","930-1"]';
  assert.deepEqual(saveMonthlyFavorite(disk, visible, "901-49"), [
    "945-39",
    "930-1",
  ]);
});
