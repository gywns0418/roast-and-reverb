import test from "node:test";
import assert from "node:assert/strict";
import { journalStartDestination } from "../src/utils/journalStart.js";
test("mobile writing entry points share one journal without discarding an intentional recipe or music draft", () => {
  assert.equal(journalStartDestination(true, "/dashboard"), "/coffee?write=1");
  assert.equal(
    journalStartDestination(true, "/coffee/write", {}),
    "/coffee?write=1",
  );
  assert.equal(journalStartDestination(false, "/dashboard"), null);
  for (const key of [
    "coffeeDraft",
    "coffeeCandidate",
    "repeatCoffee",
    "selectedSoundtrack",
  ])
    assert.equal(
      journalStartDestination(true, "/coffee/write", {
        [key]: { id: "retained" },
      }),
      null,
    );
});
