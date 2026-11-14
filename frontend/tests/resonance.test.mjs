import test from "node:test";
import assert from "node:assert/strict";
import { auraModel, familyColors, hashString } from "../src/utils/resonanceAura.js";
import { applyTheme, saveTheme, storedTheme, THEME_KEY } from "../src/utils/theme.js";

test("aura is deterministic: same data, same picture; different data, different picture", () => {
  const a = auraModel({ colors: ["#FFB199", "#E86A92"], energy: 7, depth: 4, rings: 5, key: "cup-1" });
  const b = auraModel({ colors: ["#FFB199", "#E86A92"], energy: 7, depth: 4, rings: 5, key: "cup-1" });
  const c = auraModel({ colors: ["#FFB199", "#E86A92"], energy: 8, depth: 4, rings: 5, key: "cup-1" });
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.equal(hashString("x"), hashString("x"));
});

test("aura keeps vendor HEX exactly and never invents colours for an empty journal", () => {
  const m = auraModel({ colors: ["#E0304E", "not-a-colour", "#7a12b8"] });
  assert.deepEqual(m.blobs.map((b) => b.color), ["#E0304E", "#7a12b8"]);
  const empty = auraModel({});
  assert.equal(empty.empty, true);
  assert.equal(empty.blobs.length, 0);
  assert.ok(empty.rings.length >= 3);
  assert.ok(Object.values(familyColors).every((c) => /^#[0-9A-F]{6}$/i.test(c)));
});

test("theme choice is validated, stored per browser and survives blocked storage", () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(storedTheme(storage), null);
  saveTheme("dark", storage);
  assert.equal(store.get(THEME_KEY), "dark");
  assert.equal(storedTheme(storage), "dark");
  store.set(THEME_KEY, "neon");
  assert.equal(storedTheme(storage), null);
  assert.equal(storedTheme({ getItem() { throw new Error("blocked"); } }), null);
  const root = { dataset: {}, style: {} };
  assert.equal(applyTheme("dark", root), "dark");
  assert.equal(root.dataset.theme, "dark");
  assert.equal(applyTheme("weird", root), "light");
});
