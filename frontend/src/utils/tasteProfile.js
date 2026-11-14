// Builds "my taste" only from what the drinker recorded and judged themselves.
// No score is invented: every number is a count of their own records.
import { familiesInText, familiesOfBean, noteFamilies } from "./tasteQuery.js";

export const verdicts = [
  { key: "again", label: "다시 마시고 싶어요", short: "다시 마실래요" },
  { key: "okay", label: "괜찮았어요", short: "괜찮았어요" },
  { key: "not-mine", label: "내 취향은 아니었어요", short: "내 취향 아님" },
];
const verdictKeys = new Set(verdicts.map((v) => v.key));
export const verdictOf = (record) => {
  const value = record?.brewDetails?.verdict;
  return verdictKeys.has(value) ? value : "";
};
export const verdictLabel = (key) => verdicts.find((v) => v.key === key)?.label || "";

const recordText = (record) =>
  [record.memo, record.raw?.tasteNote, record.brewDetails?.momentNote, record.brewDetails?.aftertaste, record.brewDetails?.coolingNotes]
    .filter(Boolean)
    .join(" ");
const clean = (value) => String(value || "").trim();
const unknownBean = (name) => !name || name === "원두 미기록" || name === "오늘의 커피";

function tally(records, pick) {
  const counts = new Map();
  for (const record of records) {
    for (const key of new Set(pick(record))) counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

export function buildTasteProfile(records = []) {
  const judged = records.filter((r) => verdictOf(r));
  const again = judged.filter((r) => verdictOf(r) === "again");
  const notMine = judged.filter((r) => verdictOf(r) === "not-mine");
  const familiesOf = (record) => familiesInText(recordText(record));
  const liked = tally(again, familiesOf);
  const disliked = tally(notMine, familiesOf);
  const families = noteFamilies
    .map((f) => ({ ...f, again: liked.get(f.key) || 0, notMine: disliked.get(f.key) || 0 }))
    .filter((f) => f.again || f.notMine);
  const roasteryCounts = tally(records, (r) => (clean(r.roastery) ? [clean(r.roastery)] : []));
  const methodCounts = tally(again, (r) => (clean(r.brew) ? [clean(r.brew)] : []));
  return {
    total: records.length,
    judged: judged.length,
    unjudged: records.filter((r) => !verdictOf(r)),
    againCount: again.length,
    notMineCount: notMine.length,
    likedFamilies: families.filter((f) => f.again > f.notMine).sort((a, b) => b.again - a.again),
    dislikedFamilies: families.filter((f) => f.notMine > f.again).sort((a, b) => b.notMine - a.notMine),
    againCups: again.filter((r) => !unknownBean(r.bean) || clean(r.roastery)),
    roasteries: [...roasteryCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ko")),
    favoriteMethods: [...methodCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 3),
  };
}

// A monthly bean "resembles my taste" when its vendor cup notes share a family
// I liked and none I marked as not mine. The shared families are the reason shown.
export function tasteMatch(bean, profile) {
  if (!profile?.likedFamilies?.length) return null;
  const families = new Set(familiesOfBean(bean));
  if (profile.dislikedFamilies.some((f) => families.has(f.key))) return null;
  const shared = profile.likedFamilies.filter((f) => families.has(f.key));
  return shared.length ? { shared: shared.map((f) => f.label) } : null;
}

export function roasteryTried(profile, roastery) {
  const name = clean(roastery);
  if (!name) return false;
  return profile.roasteries.some((r) => r.name.includes(name) || name.includes(r.name));
}

export function tasteCardText(profile) {
  const lines = ["☕ 나의 커피 취향 · Roast & Reverb"];
  if (profile.likedFamilies.length) lines.push(`다시 찾게 되는 맛: ${profile.likedFamilies.slice(0, 4).map((f) => f.label).join(", ")}`);
  if (profile.dislikedFamilies.length) lines.push(`나와 덜 맞았던 맛: ${profile.dislikedFamilies.slice(0, 3).map((f) => f.label).join(", ")}`);
  if (profile.favoriteMethods.length) lines.push(`좋았던 잔의 추출: ${profile.favoriteMethods.map((m) => m.name).join(", ")}`);
  lines.push(`판단한 한 잔 ${profile.judged}잔 · 만나 본 로스터리 ${profile.roasteries.length}곳`);
  return lines.join("\n");
}
