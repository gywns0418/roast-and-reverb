// Sensory scores from the record session, 0–100 in steps of 1.
// They live in brewDetails.senses exactly as the drinker set them; untouched
// axes stay unrecorded. Older records may carry the 0–5 top-level fields,
// which are read as they are (never rescaled into fake precision).
export const SENSE_MAX = 100;
export const senseAxes = [
  { key: "acidity", label: "산미", music: "밝기" },
  { key: "sweetness", label: "단맛", music: "부드러움" },
  { key: "body", label: "바디", music: "깊이" },
  { key: "aroma", label: "향", music: "공간감" },
];
const valid = (v) => Number.isInteger(v) && v >= 0 && v <= SENSE_MAX;
export function cleanSenses(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(senseAxes.filter(({ key }) => valid(value[key])).map(({ key }) => [key, value[key]]));
}
// Session scores of a saved record (0–100) — only those stored by the session.
export function sensesOf(record) {
  const details = record?.brewDetails ?? record?.raw?.brewDetails;
  return cleanSenses(details?.senses);
}
export const hasSenses = (s) => Object.keys(s || {}).length > 0;
