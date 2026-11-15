import test from "node:test";
import assert from "node:assert/strict";
import { cleanSenses, hasSenses, sensesOf } from "../src/utils/senses.js";
import { firstCupPayload } from "../src/utils/firstCup.js";
import { analyzePairing, decodePairingEvidence } from "../src/utils/pairingEngine.js";

test("only 0-100 integer senses the drinker set are kept", () => {
  assert.deepEqual(cleanSenses({ acidity: 72, body: 0, sweetness: 101, aroma: 2.5, extra: 3 }), { acidity: 72, body: 0 });
  assert.deepEqual(cleanSenses(null), {});
  assert.equal(hasSenses({}), false);
  assert.deepEqual(sensesOf({ brewDetails: { senses: { sweetness: 64, body: "40" } } }), { sweetness: 64 });
  assert.deepEqual(sensesOf({ acidity: 4 }), {}, "legacy 0-5 fields are not rescaled into session scores");
});

test("a first cup saves 0-100 sensory scores only when touched, exactly as set", () => {
  const plain = firstCupPayload({ note: "고소했어" }, "2026-11-15");
  assert.equal("senses" in plain.brewDetails, false);
  for (const key of ["acidity", "sweetness", "body", "aroma"]) assert.equal(key in plain, false, key);
  const scored = firstCupPayload({ note: "산뜻했어", senses: { acidity: 72, aroma: 35, body: 140 } }, "2026-11-15");
  assert.deepEqual(scored.brewDetails.senses, { acidity: 72, aroma: 35 });
  assert.equal("acidity" in scored, false, "legacy 0-5 field is not written");
  assert.equal(scored.memo, "산뜻했어");
});

test("new pairings keep both sensory vectors so the chart can overlay them", () => {
  const out = analyzePairing({ coffee: { memo: "레몬처럼 산미가 밝고 꽃향", acidity: 2, brewDetails: { senses: { acidity: 80 } } }, music: { genre: "jazz piano", memo: "잔향이 길다" } });
  const ev = decodePairingEvidence(out.aiReason);
  assert.ok(ev.vectors);
  assert.equal(ev.vectors.coffee.length, 4);
  assert.equal(ev.vectors.music.length, 4);
  assert.ok(ev.vectors.coffee.every((v) => v === null || (v >= 0 && v <= 1)));
  assert.equal(ev.vectors.coffee[0], 0.8, "session 0-100 score wins over the legacy 0-5 field");
  assert.ok(ev.coffee.includes("산미 80/100"));
  const legacy = decodePairingEvidence(analyzePairing({ coffee: { memo: "고소", body: 4 }, music: { genre: "blues" } }).aiReason);
  assert.equal(legacy.vectors.coffee[1], 0.8, "older 0-5 records still count");
});
