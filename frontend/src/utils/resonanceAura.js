// Deterministic generative "aura": the same inputs always produce the same
// picture. Inputs are recorded values only (vendor HEX, family colours of the
// drinker's own notes, counts); nothing is invented to fill the graphic.
export function hashString(text) {
  let h = 2166136261;
  for (const ch of String(text)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const HEX = /^#[0-9a-f]{6}$/i;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));

// Returns plain geometry so it can be rendered by React or tested in Node.
export function auraModel({ colors = [], energy = 5, depth = 5, rings = 0, key = "" } = {}) {
  const palette = colors.filter((c) => HEX.test(c)).slice(0, 6);
  const e = clamp(energy, 0, 10), d = clamp(depth, 0, 10);
  const seed = hashString(JSON.stringify({ palette, e, d, rings, key }));
  const rand = seededRandom(seed);
  const blobs = palette.map((color, i) => {
    const angle = rand() * Math.PI * 2, dist = 18 + rand() * (10 + e * 2.2);
    return {
      color,
      cx: +(100 + Math.cos(angle) * dist).toFixed(1),
      cy: +(100 + Math.sin(angle) * dist).toFixed(1),
      r: +(42 + d * 4 + rand() * 16).toFixed(1),
      opacity: +(0.8 - i * 0.08).toFixed(2),
    };
  });
  const ringCount = rings > 0 ? clamp(Math.round(rings), 3, 9) : 5;
  return {
    seed,
    empty: palette.length === 0,
    blur: +(14 + (10 - e)).toFixed(1),
    blobs,
    rings: Array.from({ length: ringCount }, (_, i) => +(22 + i * (74 / ringCount)).toFixed(1)),
  };
}

// Designer-chosen colours for the drinker's own taste families (not vendor
// data). Used only where no vendor HEX exists.
export const familyColors = {
  nutty: "#B98A5A", chocolate: "#7A4A32", sweet: "#E8B04B", berry: "#D9476B", citrus: "#F2C230",
  fruity: "#F08A5D", floral: "#C98BD8", tea: "#9DB36A", winey: "#8E2F4F", clean: "#7FB7C9",
};
