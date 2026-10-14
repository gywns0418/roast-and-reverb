import { request, jsonOptions } from "./http.js";
import { sourceUrl, normalizeMonthlySource } from "../utils/monthlySource.js";

export async function monthlyCatalog() {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/monthly-picks.json`,
    { cache: "no-cache" },
  );
  if (!response.ok) throw new Error("월픽 자료를 불러오지 못했습니다.");
  const catalog = await response.json();
  if(catalog?.schemaVersion!==1||!Array.isArray(catalog.products)||catalog.products.some(product=>!product||!Array.isArray(product.items)))throw new Error('월픽 자료 형식이 바뀌었습니다. 마지막으로 확인한 자료를 유지해 주세요.');
  return catalog.products;
}

export async function importMonthlyUrl(value, catalog) {
  const url = sourceUrl(value);
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    const response = await request(
      "/monthly-picks/source",
      jsonOptions("POST", { url }),
    );
    return normalizeMonthlySource(response.metadata, response.data);
  }
  const known = catalog.find((item) => item.sourceUrl === url);
  if (!known)
    throw new Error(
      "이 상품은 아직 연결된 월픽 목록에 없습니다. 지원 판매처의 당월 자료는 정기 갱신에서 자동으로 확인합니다. 현재 목록을 이용하거나 갱신 상태를 확인해 주세요.",
    );
  const response = await fetch(known.detailSourceUrl, {
    signal: AbortSignal.timeout(20000),
    cache: "no-cache",
  });
  if (!response.ok)
    throw new Error(
      "판매처 원두 자료를 갱신하지 못했습니다. 기존 자료는 유지됩니다.",
    );
  const fresh = normalizeMonthlySource(known, await response.json());
  fresh.items = fresh.items.map((item) => ({
    ...item,
    availability:
      known.items.find((previous) => previous.name === item.name)
        ?.availability || item.availability,
  }));
  // CORS permits the vendor JSON, but not the storefront HTML/stock. Keep stock timestamp honest.
  return {
    ...fresh,
    sourceCheckedAt: known.sourceCheckedAt,
    detailsCheckedAt: new Date().toISOString(),
  };
}
