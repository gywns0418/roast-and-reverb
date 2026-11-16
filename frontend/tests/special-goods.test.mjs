import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMonthlySource, goodsKind } from "../src/utils/monthlySource.js";
import { currentMonthlyCatalog } from "../src/utils/currentMonthlyCatalog.js";

const metadata = { title: "[스페셜 월픽 (11/12~11/25)] 오페퍼", edition: "special", month: "2026-11", saleStart: "2026-11-12", saleEnd: "2026-11-25", roastery: "오페퍼", sourceUrl: "https://unspecialty.com/product/detail.html?product_no=1005", detailSourceUrl: "https://unspecialty-community-bucket.s3.ap-northeast-2.amazonaws.com/x/x.json", stock: {} };
const data = { items: [
  { name: "레드 팝 (언스페셜티 블렌드) (15g)", nameEnglish: "Red Pop\nblend", type: "opepper-blend", openAt: 0, flavors: [] },
  { name: "페퍼 크러셔", nameEnglish: "Pepper Crusher", type: "opepper-tools", openAt: 0, flavors: [] },
] };

test("non-coffee special pick keeps goods apart from beans", () => {
  const product = normalizeMonthlySource(metadata, data, new Date("2026-11-16T00:00:00Z"));
  assert.equal(product.items.length, 0);
  assert.deepEqual(product.goods.map((g) => [g.name, g.nameEnglish, g.kind]), [
    ["레드 팝 (언스페셜티 블렌드) (15g)", "Red Pop blend", "블렌드"],
    ["페퍼 크러셔", "Pepper Crusher", "도구"],
  ]);
  assert.equal(product.stock, undefined);
  assert.deepEqual(currentMonthlyCatalog([product], "2026-11-16").length, 1);
  assert.deepEqual(currentMonthlyCatalog([product], "2026-11-26").length, 0);
});

test("non-special source without coffee is still rejected", () => {
  assert.throws(() => normalizeMonthlySource({ ...metadata, edition: "regular" }, data), /원두 항목이 없는/);
  assert.equal(goodsKind("something-else"), "기타 상품");
});
