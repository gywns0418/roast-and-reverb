import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import {
  sourceUrl,
  parseSourceHtml,
  normalizeMonthlySource,
} from "../frontend/src/utils/monthlySource.js";

async function readPublic(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    redirect: "error",
    headers: { "User-Agent": "RoastReverb-MonthlyCatalog/1.0" },
  });
  if (!response.ok) throw new Error(`원문 요청 실패 (${response.status})`);
  const text = await response.text();
  if (text.length > 8_000_000) throw new Error("원문 크기 제한 초과");
  return text;
}
const args = process.argv.slice(2);
let urls = args.filter((arg) => arg.startsWith("https://"));
if (!urls.length) {
  const now = new Date();
  const month = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      month: "numeric",
    }).format(now),
  );
  const html = await readPublic(
    "https://unspecialty.com/product/monthly_pick.html?cate_no=79",
  );
  const anchors = [
    ...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi),
  ];
  urls = [
    ...new Set(
      anchors
        .filter(
          ([, href, content]) =>
            href.includes("product_no=") &&
            new RegExp(`(?:^|[^0-9])${month}월\\s*커피\\s*월픽`).test(
              content.replace(/<[^>]+>/g, " "),
            ),
        )
        .map(([, href]) =>
          sourceUrl(
            new URL(href.replaceAll("&amp;", "&"), "https://unspecialty.com")
              .href,
          ),
        ),
    ),
  ];
  if (!urls.length)
    throw new Error("당월 월픽 링크가 아직 없습니다. 기존 자료는 유지합니다.");
}
const folder = resolve("frontend/public/data");
await mkdir(folder, { recursive: true });
let catalog = { schemaVersion: 1, products: [] };
try {
  catalog = JSON.parse(
    await readFile(resolve(folder, "monthly-picks.json"), "utf8"),
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const updates = [];
for (const url of urls.slice(0, 8)) {
  const metadata = parseSourceHtml(await readPublic(sourceUrl(url)), url);
  const data = JSON.parse(await readPublic(metadata.detailSourceUrl));
  updates.push({...normalizeMonthlySource(metadata, data),detailsCheckedAt:new Date().toISOString()});
}
// Write only after every requested product passed validation; preserve prior months.
const facts = (product) =>
  JSON.stringify({
    ...product,
    sourceCheckedAt: undefined,
    detailsCheckedAt: undefined,
  });
const changed = updates.filter(
  (product) =>
    facts(
      catalog.products.find((item) => item.sourceUrl === product.sourceUrl) ||
        {},
    ) !== facts(product) || !catalog.products.find(item=>item.sourceUrl===product.sourceUrl)?.detailsCheckedAt,
);
if (!changed.length) {
  console.log(JSON.stringify({ changed: false, products: updates.length }));
  process.exit(0);
}
for (const product of changed) {
  catalog.products = catalog.products.filter(
    (item) => item.sourceUrl !== product.sourceUrl,
  );
  catalog.products.push(product);
}
catalog.products.sort((a, b) => b.month.localeCompare(a.month));
const target = resolve(folder, "monthly-picks.json");
await writeFile(target + ".next", JSON.stringify(catalog, null, 2) + "\n");
await rename(target + ".next", target);
console.log(
  JSON.stringify(
    changed.map((item) => ({
      changed: true,
      month: item.month,
      roastery: item.roastery,
      beans: item.items.length,
      source: item.sourceUrl,
    })),
  ),
);
