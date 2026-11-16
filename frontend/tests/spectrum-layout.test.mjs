import test from "node:test";
import assert from "node:assert/strict";
import { colorFamily, hexToHsl, spectrumFamilies, spectrumLayout } from "../src/utils/spectrumLayout.js";

const fromCenter = (b) => Math.hypot(b.cx - 100, b.cy - 100);

test("colours of the same family merge into one wash", () => {
  const rows = [
    { color: "#E0533A", weight: 1 }, // red
    { color: "#E86A45", weight: 2 }, // red-orange, same 30° slice
    { color: "#3A7BE0", weight: 1 }, // blue
    { color: "#4A86E8", weight: 1 }, // blue
  ];
  const families = spectrumFamilies(rows);
  assert.equal(families.length, 2);
  assert.equal(families[0].weight, 3);
  assert.equal(families[0].members, 2);
});

test("different families sit apart on the wheel, by hue", () => {
  const [red, blue] = spectrumLayout([{ color: "#E0533A", weight: 1 }, { color: "#3A7BE0", weight: 1 }]);
  assert.ok(Math.hypot(red.cx - blue.cx, red.cy - blue.cy) > 45);
  const [orange] = spectrumLayout([{ color: "#E8963A", weight: 1 }]);
  assert.ok(Math.hypot(red.cx - orange.cx, red.cy - orange.cy) < Math.hypot(red.cx - blue.cx, red.cy - blue.cy));
});

test("muted colours gather in the middle; the most frequent family is largest and nearest", () => {
  assert.equal(colorFamily("#8C877F"), "muted");
  const layout = spectrumLayout([{ color: "#8C877F", weight: 1 }, { color: "#4B5EDD", weight: 6 }, { color: "#DD964B", weight: 1 }]);
  const by = Object.fromEntries(layout.map((b) => [b.key, b]));
  assert.ok(fromCenter(by.muted) < 10);
  assert.equal(layout[0].color, "#4B5EDD");
  assert.ok(layout[0].r > by[colorFamily("#DD964B")].r);
  assert.ok(fromCenter(layout[0]) < fromCenter(by[colorFamily("#DD964B")]));
});

test("layout is deterministic, fills are softened, bad input is ignored", () => {
  const rows = [{ color: "#A0C060", weight: 4 }, { color: "bad", weight: 1 }, { color: "#6080C0", weight: 0 }];
  assert.deepEqual(spectrumLayout(rows), spectrumLayout(rows));
  assert.equal(spectrumLayout(rows).length, 1);
  assert.notEqual(spectrumLayout(rows)[0].fill, "#A0C060");
  assert.equal(Math.round(hexToHsl("#ff0000").h), 0);
});
