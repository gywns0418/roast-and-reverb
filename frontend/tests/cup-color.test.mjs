import test from "node:test";
import assert from "node:assert/strict";
import { buildPaletteIndex, cupPalette, nameColor, normalizeBean, spectrumOf } from "../src/utils/cupColor.js";

const catalog = [{ items: [{ name: "피치 베리 블룸 (언스페셜티 블렌드)", flavorColors: ["#FFB199", "#F7708E", "bad"] }] }];
const beans = [{ name: "에티오피아 예가체프", flavors: ["꽃향", "베리"] }];
const index = buildPaletteIndex({ catalog, beans });

test("same bean always gets the same colours; vendor HEX is kept exactly", () => {
  const a = cupPalette({ bean: "피치 베리 블룸", memo: "고소" }, index);
  const b = cupPalette({ bean: "피치베리블룸", memo: "전혀 다른 감상" }, index);
  assert.deepEqual(a, ["#FFB199", "#F7708E"]);
  assert.deepEqual(a, b);
  assert.equal(normalizeBean("피치 베리 블룸 (언스페셜티 블렌드)"), normalizeBean("피치베리블룸"));
});

test("inventory notes, then a stable name colour, then the cup's own words", () => {
  const inv = cupPalette({ bean: "에티오피아 예가체프" }, index);
  assert.ok(inv.length >= 2);
  assert.deepEqual(inv, cupPalette({ bean: "에티오피아 예가체프", memo: "초콜릿" }, index));
  const unknownBean = cupPalette({ bean: "어느 동네 블렌드" }, index);
  assert.deepEqual(unknownBean, [nameColor("어느 동네 블렌드")]);
  assert.match(unknownBean[0], /^#[0-9A-F]{6}$/);
  assert.deepEqual(cupPalette({ bean: "원두 미기록", memo: "그냥 마셨다" }, index), []);
  assert.ok(cupPalette({ bean: "원두 미기록", memo: "고소한 견과" }, index).length >= 1);
});

test("spectrum weights colours by how often they were drunk", () => {
  const rows = [{ bean: "피치 베리 블룸" }, { bean: "피치 베리 블룸" }, { bean: "어느 동네 블렌드" }];
  const s = spectrumOf(rows, index);
  const top = s[0];
  assert.equal(top.color, nameColor("어느 동네 블렌드"));
  assert.equal(top.weight, 1);
  assert.equal(s.find((x) => x.color === "#FFB199").weight, 1);
  assert.equal(s.length, 3);
});
