import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  sourceUrl,
  monthlyEdition,
  discoverMonthlyUrls,
  dataUrl,
  parseSourceHtml,
  normalizeMonthlySource,
} from "../src/utils/monthlySource.js";

test("only public vendor URLs are accepted, without credentials or alternate ports", () => {
  for (const url of [
    "http://127.0.0.1/product/detail.html?product_no=901",
    "https://unspecialty.com.evil.test/product/detail.html?product_no=901",
    "https://user@unspecialty.com/product/detail.html?product_no=901",
    "https://unspecialty.com:444/product/detail.html?product_no=901",
    "https://unspecialty.com/admin",
  ])
    assert.throws(() => sourceUrl(url));
  assert.throws(() => dataUrl("https://example.com/beans.json"));
});
test("source availability stays unknown without observed stock, and future openings stay upcoming", () => {
  const metadata = {
    sourceUrl: "https://unspecialty.com/product/detail.html?product_no=901",
    month: "2026-10",
    stock: {
      x: {
        option_value_orginal: ["#2 Ethiopia"],
        is_display: "T",
        is_selling: "F",
      },
    },
  };
  const data = {
    order: [
      { type: "date-divider", src: "10/19 오픈" },
      { type: "coffee", openAt: 3 },
      { type: "coffee", openAt: 0 },
    ],
    items: [
      {
        name: "#1 Brazil",
        type: "single origin",
        openAt: 0,
        details: { specs: [] },
      },
      {
        name: "#2 Ethiopia",
        type: "single origin",
        openAt: 0,
        details: { specs: [] },
      },
      {
        name: "#3 Panama",
        type: "special single",
        openAt: 3,
        details: { specs: [] },
      },
    ],
  };
  const result = normalizeMonthlySource(
    metadata,
    data,
    new Date("2026-10-13T00:00:00Z"),
  );
  assert.equal(result.items[0].availability, "unknown");
  assert.equal(result.items[0].openDate, "2026-10-01");
  assert.equal(result.items[1].availability, "sold-out");
  assert.equal(result.items[2].availability, "upcoming");
  assert.deepEqual(result.items[0].gauges, []);
});
test("verified October catalog retains cup notes, factual prices, future openings and excludes goods", () => {
  const catalog = JSON.parse(
    readFileSync(new URL("../public/data/monthly-picks.json", import.meta.url)),
  );
  const product = catalog.products.find((item) =>
    item.sourceUrl.endsWith("=901"),
  );
  assert.ok(product.items.length >= 50);
  const coldRoom = product.items.find((item) => item.name.startsWith("#49 "));
  assert.deepEqual(coldRoom.flavors, ["핑크 구아바", "장미", "목련", "키위"]);
  assert.equal(coldRoom.process, "Washed (Cold Room Dry)");
  assert.equal(coldRoom.prices[0].label, "30g");
  assert.ok(coldRoom.prices[0].price > 0);
  assert.equal(
    product.items.some((item) => item.category === "goods"),
    false,
  );
  assert.equal(
    product.items.find((item) => item.name.startsWith("#52 ")).openDate,
    "2026-10-19",
  );
  assert.equal(
    product.items.find((item) => item.name.startsWith("#12 ")).openDate,
    "2026-10-05",
  );
  assert.notEqual(
    product.items.find((item) => item.name.startsWith("#49 ")).availability,
    "upcoming",
  );
});
test("missing source structure fails rather than fabricating a new month or empty catalog", () => {
  assert.throws(() =>
    parseSourceHtml(
      "<html>captcha</html>",
      "https://unspecialty.com/product/detail.html?product_no=901",
    ),
  );
  assert.throws(() => normalizeMonthlySource({}, { items: [] }));
});

test('discover all coffee editions, exclude old months and machines, respect actual sale dates',()=>{
 const now=new Date('2026-10-18T01:00:00Z');
 const titles=['[10월 커피 월픽] UFO (10/1~10/31)','[글로벌 월픽] Loquat Coffee (10/12~10/18)','[10월 커피 스몰월픽] 언더빈 (10/18~10/31)','[10월 머신 월픽] 도구','[9월 커피 월픽] 이전 (9/1~9/30)'];
 const html=titles.map((t,i)=>`<a href="/product/detail.html?product_no=${900+i}"><span>${t}</span></a>`).join('');
 assert.equal(discoverMonthlyUrls(html,now).length,3);
 const global=monthlyEdition(titles[1],now);assert.equal(global.edition,'global');assert.equal(global.month,'2026-10');assert.equal(global.saleStart,'2026-10-12');
 assert.equal(monthlyEdition(titles[2],now).edition,'small');
 assert.throws(()=>dataUrl('https://evil.cloudfront.net/data.json'));
 assert.ok(dataUrl('https://d22c6ea6lqg2pi.cloudfront.net/UNDERBEAN/UNDERBEAN.json'));
 const fixture='<meta property="og:title" content="'+titles[1]+' - 언스페셜티 몰"><usf-general-price-list rel="https://unspecialty-community-bucket.s3.ap-northeast-2.amazonaws.com/LOQUAT/LOQUAT.json">';
 const metadata=parseSourceHtml(fixture,'https://unspecialty.com/product/detail.html?product_no=930',now);
 const product=normalizeMonthlySource(metadata,{items:[{name:'Coffee',type:'single origin',openAt:0,details:{specs:[]}}]},new Date('2026-10-19T01:00:00Z'));
 assert.equal(product.items[0].openDate,'2026-10-12');assert.equal(product.items[0].availability,'ended');
});
