// One colour identity per coffee, so the same bean always shows the same colour.
// Priority: the vendor's published flavour HEX (unchanged) → the drinker's own
// bean inventory notes → the drinker's own words for that cup → a stable colour
// derived from the bean name. Nothing here claims to be measured taste data.
import { familiesInText } from "./tasteQuery.js";
import { familyColors, hashString } from "./resonanceAura.js";

const HEX = /^#[0-9a-f]{6}$/i;
const unknown = (name) => !name || name === "원두 미기록" || name === "오늘의 커피";
export const normalizeBean = (name) =>
  String(name || "")
    .replace(/\((?:언스페셜티 블렌드|하우스 블렌드)\)/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");

export function nameColor(name) {
  const h = hashString(normalizeBean(name)) % 360;
  const s = 0.68, l = 0.58;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255);
  return "#" + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function buildPaletteIndex({ catalog = [], beans = [] } = {}) {
  const index = new Map();
  const put = (name, colors, source) => {
    const key = normalizeBean(name);
    if (key.length < 2 || !colors.length || index.has(key)) return;
    index.set(key, { colors: colors.slice(0, 6), source });
  };
  for (const product of catalog) for (const item of product.items || []) put(item.name, (item.flavorColors || []).filter((c) => HEX.test(c)), "vendor");
  for (const bean of beans) {
    const vendor = (bean.flavorColors || []).filter((c) => HEX.test(c));
    if (vendor.length) put(bean.name, vendor, "vendor");
    else put(bean.name, familiesInText((bean.flavors || []).join(" ")).map((k) => familyColors[k]), "notes");
  }
  return index;
}

function lookup(index, name) {
  const key = normalizeBean(name);
  if (index.has(key)) return index.get(key);
  if (key.length < 3) return null;
  for (const [k, v] of index) if (k.length >= 3 && (k.includes(key) || key.includes(k))) return v;
  return null;
}

const cupText = (r) => [r.memo, r.raw?.tasteNote, r.brewDetails?.momentNote].filter(Boolean).join(" ");

// Colours for one cup. Same bean name → same colours, wherever it appears.
export function cupPalette(record, index = new Map()) {
  if (!unknown(record?.bean)) {
    const hit = lookup(index, record.bean);
    return hit ? hit.colors : [nameColor(record.bean)];
  }
  return [...new Set(familiesInText(cupText(record || {})).map((k) => familyColors[k]))];
}

// Every colour the drinker has had, weighted by how often (a cup with three
// colours gives each a third).
export function spectrumOf(records = [], index = new Map()) {
  const weights = new Map();
  for (const r of records) {
    const colors = cupPalette(r, index);
    for (const c of colors) weights.set(c.toUpperCase(), (weights.get(c.toUpperCase()) || 0) + 1 / colors.length);
  }
  return [...weights].map(([color, weight]) => ({ color, weight })).sort((a, b) => b.weight - a.weight || a.color.localeCompare(b.color));
}
