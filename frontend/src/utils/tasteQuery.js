// Understands short taste phrases such as "산미 적고 고소한" for monthly-pick search.
// Everything is matched against vendor data only: cup notes (flavors), the vendor's
// 1-5 gauges (산미·바디감·발효도), roast labels and the decaf flag. Nothing here
// measures or predicts how a coffee tastes to the drinker.

const gaugeOf = (bean, label) => {
  const gauge = bean.gauges?.find((item) => item.label === label);
  const value = Number(gauge?.value);
  return Number.isFinite(value) ? value : null;
};
const atMost = (label, limit) => (bean) => {
  const value = gaugeOf(bean, label);
  return value !== null && value <= limit;
};
const atLeast = (label, limit) => (bean) => {
  const value = gaugeOf(bean, label);
  return value !== null && value >= limit;
};
const noteHas = (words) => (bean) =>
  (bean.flavors || []).some((note) => words.some((word) => String(note).toLocaleLowerCase().includes(word)));
const roastIs = (pattern) => (bean) => pattern.test(String(bean.roast || "").trim());

const after = "(?:이|가|는|은|도)?\\s*";
// Gauge, roast and decaf rules run first so "산미 적고" is not read as a plain word.
const traitRules = [
  { key: "acid-low", label: "산미 낮음", basis: "gauge", pattern: new RegExp(`(?:산미|신맛)\\s*${after}(?:적|낮|없|약|덜|별로)\\S*|(?:안|덜)\\s*신\\S*`, "g"), match: atMost("산미", 2) },
  { key: "acid-high", label: "산미 또렷함", basis: "gauge", pattern: new RegExp(`(?:산미|신맛)\\s*${after}(?:있|높|강|많|좋|밝|풍부)\\S*|상큼\\S*|새콤\\S*|산뜻\\S*|쨍\\S*`, "g"), match: atLeast("산미", 4) },
  { key: "body-high", label: "바디감 묵직함", basis: "gauge", pattern: new RegExp(`바디감?\\s*${after}(?:있|높|강|무거|묵직|좋)\\S*|묵직\\S*|진한|진하고|무거운|헤비\\S*`, "g"), match: atLeast("바디감", 4) },
  { key: "body-low", label: "바디감 가벼움", basis: "gauge", pattern: new RegExp(`바디감?\\s*${after}(?:낮|약|가벼|적)\\S*|가벼운|가볍\\S*`, "g"), match: atMost("바디감", 2) },
  { key: "ferment-low", label: "발효감 적음", basis: "gauge", pattern: new RegExp(`발효(?:감|향|도)?\\s*${after}(?:적|낮|없|약|덜)\\S*`, "g"), match: atMost("발효도", 2) },
  { key: "ferment-high", label: "발효감 있음", basis: "gauge", pattern: /발효(?:감|향|도)?\S*/g, match: atLeast("발효도", 4) },
  { key: "decaf", label: "디카페인", basis: "flag", pattern: new RegExp(`디카페인\\S*|카페인\\s*${after}(?:없|적|낮)\\S*|decaf\\S*`, "gi"), match: (bean) => bean.decaf === true },
  { key: "roast-dark", label: "다크 쪽 로스팅", basis: "roast", pattern: /다크\s*로스(?:팅|트)\S*|강배전\S*/g, match: (bean) => bean.darkRoast === true || roastIs(/^(?:medium\s*)?dark/i)(bean) },
  { key: "roast-light", label: "라이트 로스팅", basis: "roast", pattern: /라이트\s*로스(?:팅|트)\S*|약배전\S*/g, match: roastIs(/^light/i) },
];

const noteRules = [
  { key: "nutty", label: "고소한 노트", pattern: /고소\S*|견과\S*|너티\S*|nutty/gi, words: ["아몬드", "헤이즐넛", "땅콩", "피스타치오", "마카다미아", "견과", "토피넛", "누룽지", "강냉이", "코코넛", "피칸", "호두"] },
  { key: "chocolate", label: "초콜릿 노트", pattern: /초콜?릿\S*|초코\S*|코코아\S*|카카오\S*|모카\S*|쌉쌀\S*/g, words: ["초콜릿", "코코아", "카카오", "모카"] },
  { key: "sweet", label: "달콤한 노트", pattern: /달콤\S*|달달\S*|단맛\S*|달큰\S*|스윗\S*|sweet/gi, words: ["꿀", "캐러멜", "바닐라", "슈거", "설탕", "시럽", "마시멜로", "캔디", "사탕", "연유", "버터스카치", "브륄레", "토피", "메이플", "단맛", "스윗", "달콤", "달게", "달았"] },
  { key: "berry", label: "베리 노트", pattern: /베리\S*|berry/gi, words: ["베리", "딸기", "커런트", "체리"] },
  { key: "citrus", label: "시트러스 노트", pattern: /시트러스\S*|감귤류\S*|citrus/gi, words: ["레몬", "라임", "오렌지", "자몽", "귤", "만다린", "유자", "시트러스", "베르가못", "포멜로", "텐저린"] },
  { key: "fruity", label: "과일 노트", pattern: /과일\S*|프루티\S*|과즙\S*|fruity/gi, words: ["과일", "베리", "딸기", "복숭아", "포도", "사과", "자두", "체리", "망고", "파인애플", "오렌지", "레몬", "자몽", "라임", "귤", "만다린", "유자", "키위", "살구", "무화과", "멜론", "수박", "리치", "구아바", "파파야", "바나나", "석류", "배", "핵과", "커런트", "패션프루트", "백향과", "머스캣", "머스켓", "피치", "텐저린", "참외", "용과", "스타프루트", "칸탈로프", "포멜로"] },
  { key: "floral", label: "꽃향 노트", pattern: /꽃\S*|플로럴\S*|floral/gi, words: ["꽃", "플로럴", "장미", "자스민", "재스민", "라벤더", "블라썸", "캐모마일", "아카시아", "목련", "백합", "엘더플라워", "히비스커스", "제라늄", "제비꽃", "허니서클", "부케", "플라워"] },
  { key: "tea", label: "차 같은 노트", pattern: /(?:홍차|녹차|우롱|티|차)\s*같\S*|티라이크\S*|tea/gi, words: ["티", "다즐링", "얼그레이", "녹차", "홍차", "우롱", "캐모마일", "백차"] },
  { key: "winey", label: "와인 같은 노트", pattern: /와인\S*|와이니\S*|wine/gi, words: ["와인", "와이니", "포도주"] },
  { key: "clean", label: "깔끔한 후미", pattern: /깔끔\S*|깨끗\S*|클린\S*/g, words: ["깨끗", "클린", "깔끔", "맑"] },
];

const stopWords = new Set(["원두", "커피", "찾아줘", "찾아", "찾기", "추천", "추천해줘", "같은", "같이", "느낌", "맛", "맛이", "향", "향이", "나는", "나고", "있는", "있고", "한", "하고", "그리고", "좀", "조금", "약간", "너무", "쪽", "계열", "거", "것", "원해", "좋은", "좋아", "편한", "싶어", "싶은", "랑", "이랑", "와", "과", "고", "은", "는", "이", "가", "을", "를", "의", "도", "및"]);
const particle = /(?:으로|이랑|에서|하고|은|는|이|가|을|를|의|도|랑|와|과)$/;

export function parseTasteQuery(input = "") {
  let rest = ` ${String(input).toLocaleLowerCase()} `;
  const terms = [];
  for (const rule of [...traitRules, ...noteRules]) {
    rule.pattern.lastIndex = 0;
    if (!rule.pattern.test(rest)) continue;
    rule.pattern.lastIndex = 0;
    rest = rest.replace(rule.pattern, " ");
    if (terms.some((term) => term.key === rule.key)) continue;
    terms.push({
      key: rule.key,
      label: rule.label,
      basis: rule.basis || "notes",
      match: rule.words ? noteHas(rule.words) : rule.match,
    });
  }
  // Opposite gauge readings in one phrase cancel out rather than returning nothing.
  for (const [a, b] of [["acid-low", "acid-high"], ["body-low", "body-high"], ["ferment-low", "ferment-high"]]) {
    if (terms.some((t) => t.key === a) && terms.some((t) => t.key === b)) {
      terms.splice(terms.findIndex((t) => t.key === b), 1);
    }
  }
  const words = rest
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
    .map((word) => (stopWords.has(word) || word.length < 2 ? word : word.replace(particle, "")))
    .filter((word) => word && !stopWords.has(word));
  return { terms, words, usesGauges: terms.some((term) => term.basis === "gauge") };
}

export function matchesTasteQuery(bean, parsed, searchableText) {
  return (
    parsed.terms.every((term) => term.match(bean)) &&
    parsed.words.every((word) => searchableText.includes(word))
  );
}

// Which cup-note families a piece of text mentions. Used for the drinker's own words
// (their record) and for vendor cup notes alike, so both sides use the same vocabulary.
export const noteFamilies = noteRules.map(({ key, label }) => ({ key, label: label.replace(/ 노트$| 후미$/, "") }));
export function familiesInText(text = "") {
  const value = String(text).toLocaleLowerCase();
  if (!value.trim()) return [];
  return noteRules
    .filter((rule) => {
      rule.pattern.lastIndex = 0;
      const hit = rule.pattern.test(value) || rule.words.some((word) => value.includes(word));
      rule.pattern.lastIndex = 0;
      return hit;
    })
    .map((rule) => rule.key);
}
export const familiesOfBean = (bean) => familiesInText((bean.flavors || []).join(" "));

export const tasteExamples =["산미 적고 고소한", "꽃향 나는 가벼운", "초콜릿 같은 묵직한", "상큼한 베리", "디카페인"];

export function roastBadge(bean) {
  const roast = String(bean.roast || "").trim();
  const level = [
    [/^medium\s*dark/i, "미디엄 다크"],
    [/^medium\s*light/i, "미디엄 라이트"],
    [/^medium/i, "미디엄"],
    [/^dark/i, "다크"],
    [/^light/i, "라이트"],
  ].find(([pattern]) => pattern.test(roast));
  return level ? `${level[1]} 로스팅` : bean.darkRoast ? "다크 로스팅" : "";
}
