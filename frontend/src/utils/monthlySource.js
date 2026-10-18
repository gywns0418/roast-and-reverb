import { safeColor } from "./monthlyColors.js";
export function sourceUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !["unspecialty.com", "www.unspecialty.com"].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== "/product/detail.html" ||
    !/^\d+$/.test(url.searchParams.get("product_no") || "")
  )
    throw new Error("언스페셜티 상품 상세 링크를 입력해 주세요.");
  return `https://unspecialty.com/product/detail.html?product_no=${url.searchParams.get("product_no")}`;
}

export function dataUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !["unspecialty-community-bucket.s3.ap-northeast-2.amazonaws.com", "d22c6ea6lqg2pi.cloudfront.net"].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.port ||
    !/\.json$/i.test(url.pathname)
  )
    throw new Error("지원하지 않는 월픽 자료 주소입니다.");
  return url.href;
}

const unescapeHtml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
export function monthlyEdition(title, now = new Date()) {
  const edition = /글로벌\s*(?:커피\s*)?월픽/.test(title) ? 'global' : /커피\s*스몰\s*월픽/.test(title) ? 'small' : /커피\s*월픽/.test(title) ? 'regular' : null;
  const period = title.match(/\((\d{1,2})\/(\d{1,2})\s*~\s*(\d{1,2})\/(\d{1,2})\)/);
  const month = Number(title.match(/(\d{1,2})월\s*커피/)?.[1] || (edition === 'global' ? period?.[1] : 0));
  if (!edition || month < 1 || month > 12) throw new Error('지원하는 커피 월픽 제목이 아닙니다.');
  const year = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric'}).format(now);
  const date = (m,d) => {const value=`${year}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;if(new Date(value+'T00:00:00Z').toISOString().slice(0,10)!==value)throw new Error('판매 날짜를 확인해 주세요.');return value;};
  return {edition, month:`${year}-${String(month).padStart(2,'0')}`, ...(period?{saleStart:date(period[1],period[2]),saleEnd:date(period[3],period[4])}:{})};
}
export function discoverMonthlyUrls(html, now = new Date()) {
 const expected=monthlyEdition(`[${Number(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',month:'numeric'}).format(now))}월 커피 월픽]`,now).month;
 return [...new Set([...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].flatMap(([,href,content])=>{
  const title=unescapeHtml(content.replace(/<[^>]+>/g,' ').replace(/\s+/g,' '));
  try {if(/판매\s*종료/.test(title)||monthlyEdition(title,now).month!==expected)return [];return [sourceUrl(new URL(unescapeHtml(href),'https://unspecialty.com').href)];}catch{return [];}
 }))];
}
export function parseSourceHtml(html, url, now = new Date()) {
  const title = unescapeHtml(
    html.match(
      /<meta\s+property=["']og:title["']\s+content=["']([^"']+)/i,
    )?.[1] || "",
  ).replace(/\s*-\s*언스페셜티.*$/, "");
  const edition = monthlyEdition(title, now);
  const detail = html.match(
    /<usf-general-price-list\b[^>]*\brel=["']([^"']+)/i,
  )?.[1];
  if (!detail)
    throw new Error(
      "월픽 제목 또는 공개 원두 자료를 찾지 못했습니다. 이전 자료는 유지합니다.",
    );
  const year =
    html.match(/(20\d{2})년\s*\d{1,2}\//)?.[1] || String(now.getFullYear());
  let stock = {};
  const encoded = html.match(
    /var\s+option_stock_data\s*=\s*'((?:\\.|[^'\\])*)'/,
  )?.[1];
  if (encoded) {
    try {
      stock = JSON.parse(encoded.replace(/\\(.)/gs, (_, char) => char));
    } catch {
      /* Unknown availability stays unknown. */
    }
  }
  return {
    title,
    ...edition,
    month: `${year}-${edition.month.slice(5)}`,
    roastery: title.replace(/^.*?월픽\]\s*/, "").replace(/\s*\(.*$/, ""),
    sourceUrl: sourceUrl(url),
    detailSourceUrl: dataUrl(unescapeHtml(detail)),
    stock,
  };
}

const cleanName = (name) => name.replace(/^\[[^\]]*오픈\]\s*/, "").trim();
export function normalizeMonthlySource(metadata, data, now = new Date()) {
  if (!Array.isArray(data.items))
    throw new Error("공개 원두 자료 형식이 바뀌었습니다.");
  const opening = { 0: metadata.saleStart || `${metadata.month}-01` };
  const categoryOpenings = {};
  let lastOpening = opening[0];
  for (const row of data.order || []) {
    const match =
      row.type === "date-divider" && row.src?.match(/(\d{1,2})\/(\d{1,2})/);
    if (match)
      lastOpening = `${metadata.month.slice(0, 4)}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
    if (row.type === "coffee" && row.openAt != null && row.openAt !== 0) {
      opening[row.openAt] = lastOpening;
      categoryOpenings[`${row.src}:${row.openAt}`] = lastOpening;
    }
  }
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const items = data.items
    .filter((item) =>
      [
        "single origin",
        "special single",
        "blend",
        "unspecialty blend",
        "easy",
      ].includes(item.type),
    )
    .map((item, index) => {
      const specs = (item.details?.specs || [])
        .filter((spec) => spec.label && (spec.value || spec.entries))
        .map((spec) => ({
          label: spec.label,
          value:
            spec.value ||
            spec.entries
              .map((row) => `${row.text} ${row.ratio ?? ""}%`)
              .join(" / "),
        }));
      const spec = (label) =>
        specs.find((row) => row.label === label)?.value || "";
      const name = cleanName(item.name);
      const variants = Object.values(metadata.stock || {}).filter(
        (row) => cleanName(row.option_value_orginal?.[0] || "") === name,
      );
      const explicitOpen = item.name.match(/^\[(\d{1,2})\.(\d{1,2})\s*오픈\]/);
      const openDate = explicitOpen
        ? `${metadata.month.slice(0, 4)}-${explicitOpen[1].padStart(2, "0")}-${explicitOpen[2].padStart(2, "0")}`
        : item.openAt === 0
          ? opening[0]
          : categoryOpenings[`${item.type}:${item.openAt}`] ||
            opening[item.openAt] ||
            null;
      const available = variants.some(
        (row) =>
          row.is_display === "T" &&
          row.is_selling === "T" &&
          !(
            row.use_soldout === "T" &&
            row.use_stock &&
            Number(row.stock_number) <= 0
          ),
      );
      const availability =
        metadata.saleEnd && metadata.saleEnd < today
          ? "ended"
          : openDate && openDate > today
          ? "upcoming"
          : variants.length
            ? available
              ? "available"
              : "sold-out"
            : "unknown";
      const stableKey =
        name.match(/^#(\d+)\s/)?.[1] ||
        `b${[...name].reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 0).toString(16)}`;
      return {
        id: `${metadata.sourceUrl.split("=")[1]}-${stableKey}`,
        name,
        originalName: item.name,
        nameEnglish: (item.nameEnglish || "").replaceAll("\n", " "),
        category: item.type,
        origin: spec("국가"),
        region: spec("지역"),
        variety: spec("품종"),
        process: spec("가공 방식"),
        roast: spec("로스팅 포인트"),
        flavors: spec("컵 노트")
          .split(/[,，]/)
          .map((note) => note.trim())
          .filter(Boolean),
        flavorColors: (item.flavors || []).map(flavor => safeColor(flavor.color)).filter(Boolean),
        specs,
        gauges: (item.details?.gauges || [])
          .filter((gauge) => gauge.value != null)
          .map((gauge) => ({ label: gauge.label, value: Number(gauge.value) })),
        prices: (
          item.heading?.prices ||
          item.options?.map((option) => ({
            label: `${option.weight}g`,
            price: option.price,
          })) ||
          []
        )
          .filter((option) => Number.isFinite(Number(option.price)))
          .map((option) => ({
            label: option.label,
            price: Number(option.price),
          })),
        openDate,
        availability,
        sourceUpdatedAt: item.details?.updatedAt || null,
        decaf: /decaf|디카페인/i.test(name + spec("가공 방식")),
        darkRoast: /\bdark\b|다크/i.test(spec("로스팅 포인트")),
        // Vendor gauges and cup notes are product facts, never a personal tasting score.
        summary: [spec("국가"), spec("품종"), spec("가공 방식")]
          .filter(Boolean)
          .join(" · "),
      };
    });
  if (!items.length)
    throw new Error("원두 항목이 없는 자료입니다. 기존 월픽을 유지합니다.");
  const { stock, ...publicMetadata } = metadata;
  return {
    schemaVersion: 1,
    ...publicMetadata,
    sourceCheckedAt: now.toISOString(),
    items,
  };
}
