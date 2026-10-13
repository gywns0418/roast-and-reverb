import { request, jsonOptions } from "./http.js";
import { sourceUrl, normalizeMonthlySource } from "../utils/monthlySource.js";

export async function monthlyCatalog() {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/monthly-picks.json`,
    { cache: "no-cache" },
  );
  if (!response.ok) throw new Error("월픽 자료를 불러오지 못했습니다.");
  const catalog = await response.json();
  return catalog.products || [];
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
      "이 링크는 아직 체험 자료에 없습니다. 실제 서버 모드에서는 링크를 바로 수집할 수 있습니다. 이 대화에 링크를 주시면 공개 자료에도 추가할 수 있어요.",
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
