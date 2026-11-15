import test from "node:test";
import assert from "node:assert/strict";
import { cleanSenses, hasSenses, sensesOf } from "../src/utils/senses.js";
import { firstCupPayload } from "../src/utils/firstCup.js";
import { analyzePairing, decodePairingEvidence } from "../src/utils/pairingEngine.js";

test("only senses the drinker set are kept; out-of-range values are dropped", () => {
  assert.deepEqual(cleanSenses({ acidity: 4, body: 0, sweetness: 6, aroma: 2.5, extra: 3 }), { acidity: 4, body: 0 });
  assert.deepEqual(cleanSenses(null), {});
  assert.equal(hasSenses({}), false);
  assert.deepEqual(sensesOf({ acidity: null, sweetness: 3, raw: { body: "2" } }), { sweetness: 3, body: 2 });
});

test("a first cup saves sensory scores only when touched", () => {
  const plain = firstCupPayload({ note: "고소했어" }, "2026-11-15");
  for (const key of ["acidity", "sweetness", "body", "aroma"]) assert.equal(key in plain, false, key);
  const scored = firstCupPayload({ note: "산뜻했어", senses: { acidity: 4, aroma: 3, body: 9 } }, "2026-11-15");
  assert.equal(scored.acidity, 4);
  assert.equal(scored.aroma, 3);
  assert.equal("body" in scored, false);
  assert.equal(scored.memo, "산뜻했어");
});

test("new pairings keep both sensory vectors so the chart can overlay them", () => {
  const out = analyzePairing({ coffee: { memo: "레몬처럼 산미가 밝고 꽃향", acidity: 4 }, music: { genre: "jazz piano", memo: "잔향이 길다" } });
  const ev = decodePairingEvidence(out.aiReason);
  assert.ok(ev.vectors);
  assert.equal(ev.vectors.coffee.length, 4);
  assert.equal(ev.vectors.music.length, 4);
  assert.ok(ev.vectors.coffee.every((v) => v === null || (v >= 0 && v <= 1)));
  assert.equal(ev.vectors.coffee[0], 0.8);
});
