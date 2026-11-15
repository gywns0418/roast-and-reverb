// Sensory scores use the record fields the journal already has (0–5).
// A score exists only when the drinker set it; untouched axes stay unrecorded.
export const senseAxes = [
  { key: "acidity", label: "산미", music: "밝기" },
  { key: "sweetness", label: "단맛", music: "부드러움" },
  { key: "body", label: "바디", music: "깊이" },
  { key: "aroma", label: "향", music: "공간감" },
];
const valid = (v) => Number.isInteger(v) && v >= 0 && v <= 5;
export function cleanSenses(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(senseAxes.filter(({ key }) => valid(value[key])).map(({ key }) => [key, value[key]]));
}
export function sensesOf(record) {
  const out = {};
  for (const { key } of senseAxes) {
    const v = record?.[key] ?? record?.raw?.[key];
    if (v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 5) out[key] = Number(v);
  }
  return out;
}
export const hasSenses = (s) => Object.keys(s || {}).length > 0;
