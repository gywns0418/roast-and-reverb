import test from "node:test";
import assert from "node:assert/strict";
import { parseCoffeeMarkdown } from "../src/utils/coffeeMarkdown.js";
import { parsePours, brewSummary } from "../src/utils/brewDetails.js";

const text = `## 추출 기록
### 날짜
- 2026-10-07 20시
### 원두
- 이름: 테스트 워시드
- 로스터리: 테스트 로스터리
### 추출 조건
- 그라인더: Timemore C3 ESP
- 분쇄도: 0점 기준 51클릭
- 원두량: 16g
- 물: 245g (45 + 100 + 100, 개별 푸어량)
- 물 온도: 92℃
### 레시피
- 개별 푸어량: 45g + 100g + 100g
- 실제 서버로 내려온 양: 204g
- 총 추출 시간:
### 마셨을 때
- 전체 인상: 부드러운 맛
- 단맛: 부드러움
- 식으면서 달라진 점: 과일 느낌
`;

test("import preserves measured water, output and unknown values without inventing music", () => {
  const { coffee, errors } = parseCoffeeMarkdown(text, "2026-10-07.md");
  assert.deepEqual(errors, []);
  assert.equal(coffee.brewDetails.recordedHour, 20);
  assert.equal(coffee.brewDetails.waterGrams, 245);
  assert.equal(coffee.brewDetails.beverageGrams, 204);
  assert.equal(coffee.brewDetails.doseGrams, 16);
  assert.equal(coffee.brewDetails.dripper, "");
  assert.equal(coffee.brewTime, null);
  assert.equal(coffee.sweetness, null);
  assert.equal(coffee.music, undefined);
  assert.equal(brewSummary(coffee.brewDetails).ratio, "1:15.3");
});

test("individual pours and cumulative pours yield the same water total", () => {
  const individual = parsePours("45 + 100 + 100", "individual");
  const cumulative = parsePours("45 → 145 → 245", "cumulative");
  assert.deepEqual(individual, cumulative);
  assert.equal(individual.total, 245);
  assert.equal(parsePours("145 → 45", "cumulative"), null);
  assert.equal(parsePours("6888", "individual"), null);
});

test("unknown and impossible dates need review instead of defaulting to today", () => {
  assert.ok(
    parseCoffeeMarkdown(text.replace("2026-10-07 20시", ""), "unknown.md")
      .errors.length,
  );
  assert.ok(
    parseCoffeeMarkdown(text.replace("2026-10-07", "2026-02-30"), "unknown.md")
      .errors.length,
  );
});

test("filename supplies an explicitly recorded date, but never an hour", () => {
  const result = parseCoffeeMarkdown(
    text.replace("2026-10-07 20시", ""),
    "2026-09-20-2.md",
  );
  assert.equal(result.coffee.drinkDate, "2026-09-20");
  assert.equal(result.coffee.brewDetails.recordedHour, null);
});
