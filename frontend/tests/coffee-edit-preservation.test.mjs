import test from "node:test";
import assert from "node:assert/strict";
import { coffeeEditForm, changeCoffeeNote } from "../src/utils/coffeeEdit.js";
import { coffeePayload } from "../src/utils/brewDetails.js";
test("editing the short note retains original ratings including zero, recipe and selected music", () => {
  const cup = {
    bean: "QA",
    date: "2026.10.25",
    memo: "before",
    acidity: 0,
    sweetness: 4,
    bitterness: null,
    body: 3,
    aroma: 5,
    waterTemp: 92,
    raw: { tasteNote: "actual recorded observation" },
    brewDetails: {
      doseGrams: 15,
      waterGrams: 240,
      momentNote: "before",
      soundtrack: {
        version: 1,
        kind: "matched",
        track: "QA song",
        artist: "QA",
        url: "https://www.youtube.com/watch?v=BzYnNdJhZQw",
        listened: false,
      },
    },
  };
  const form = coffeeEditForm(cup);
  const saved = coffeePayload(changeCoffeeNote(form, "after"));
  for (const key of [
    "acidity",
    "sweetness",
    "bitterness",
    "body",
    "aroma",
    "waterTemp",
  ])
    assert.equal(saved[key], cup[key]);
  assert.equal(saved.drinkDate, "2026-10-25");
  assert.equal(saved.memo, "after");
  assert.equal(saved.brewDetails.momentNote, "after");
  assert.equal(saved.brewDetails.doseGrams, 15);
  assert.equal(saved.brewDetails.waterGrams, 240);
  assert.deepEqual(saved.brewDetails.soundtrack, cup.brewDetails.soundtrack);
  assert.equal(cup.brewDetails.momentNote, "before");
  assert.equal(saved.tasteNote, cup.raw.tasteNote);
});
