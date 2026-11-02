import illustrations from "../data/bean-illustrations.json" with { type: "json" };

const normalize = value => String(value || "").normalize("NFKC").trim();
const byName = new Map(Object.values(illustrations).map(entry => [normalize(entry.name), entry]));
const neutral = {file: "beans/light-roast.webp", kind: "coffee", notes: []};
const signature = notes => JSON.stringify((Array.isArray(notes) ? notes : []).map(normalize).sort());

// Only bundled assets are allowed: private/user-supplied data cannot select a URL.
export function beanIllustration(item = {}) {
  if (item.category !== "unspecialty blend") return neutral;
  const entry = illustrations[String(item.id || "").replace(/^catalog-/, "")]
    || byName.get(normalize(item.name));
  return entry && signature(entry.notes) === signature(item.flavors) ? entry : neutral;
}

export function needsBlendIllustration(item) {
  return item.category === "unspecialty blend" && beanIllustration(item).kind !== "flavor";
}
