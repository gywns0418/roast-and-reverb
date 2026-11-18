import test from "node:test";
import assert from "node:assert/strict";

const values = new Map();
globalThis.localStorage = { getItem: (k) => values.get(k) ?? null, setItem: (k, v) => values.set(k, String(v)), removeItem: (k) => values.delete(k) };
globalThis.window = globalThis.window || { addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; } };
const { readQuickDraft, writeQuickDraft, hasContent, blankCup } = await import("../src/utils/ripple.js");
const { quickDraftKey } = await import("../src/utils/firstCup.js");

test("the phone session keeps its draft in the same slot as the desktop form", () => {
  writeQuickDraft({ ...blankCup(), note: "고소하고 달았어", beanName: "예시 원두", verdict: "again" });
  assert.ok(values.has(quickDraftKey("trial")));
  const { value, error } = readQuickDraft();
  assert.equal(error, undefined);
  assert.equal(value.note, "고소하고 달았어");
  assert.equal(value.verdict, "again");
});

test("an empty draft is removed instead of stored", () => {
  writeQuickDraft(blankCup());
  assert.equal(values.has(quickDraftKey("trial")), false);
  assert.equal(hasContent(readQuickDraft().value), false);
});

test("a damaged draft is reported and never treated as content", () => {
  values.set(quickDraftKey("trial"), "{broken");
  const { value, error } = readQuickDraft();
  assert.match(error, /읽지 못했어요/);
  assert.equal(hasContent(value), false);
  assert.equal(values.get(quickDraftKey("trial")), "{broken");
});
