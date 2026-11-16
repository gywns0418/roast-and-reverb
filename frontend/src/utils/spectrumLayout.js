// Turns the drinker's colours into a few calm washes on a colour wheel.
// Colours of the same family (hue within one 30° slice, or muted browns/creams/
// greys) merge into one wash whose size follows how often they were drunk.
// The angle is the family's hue, so related families sit side by side; the
// most frequent family settles nearest the middle. Fills are softened towards a
// warm cream so the field reads as one picture. Same spectrum → same picture.

const CREAM = [239, 231, 220];
const rgbOf = (hex = "") => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();

export function soften(hex = "", amount = 0.3) {
  const rgb = rgbOf(hex);
  if (!rgb) return toHex(CREAM);
  return toHex(rgb.map((v, i) => v + (CREAM[i] - v) * amount));
}

export function hexToHsl(hex = "") {
  const rgb = rgbOf(hex);
  if (!rgb) return { h: 0, s: 0, l: 0.5 };
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s: Math.min(1, s), l };
}

const isMuted = ({ s, l }) => s < 0.18 || l > 0.9 || l < 0.12;
export const colorFamily = (hex) => {
  const hsl = hexToHsl(hex);
  return isMuted(hsl) ? "muted" : "h" + (Math.round(hsl.h / 30) % 12);
};

export function spectrumFamilies(spectrum = []) {
  const groups = new Map();
  for (const row of spectrum) {
    const rgb = rgbOf(row.color);
    const weight = Number(row.weight) || 0;
    if (!rgb || weight <= 0) continue;
    const key = colorFamily(row.color);
    const g = groups.get(key) || { key, weight: 0, rgb: [0, 0, 0], members: 0 };
    g.weight += weight;
    g.rgb = g.rgb.map((v, i) => v + rgb[i] * weight);
    g.members += 1;
    groups.set(key, g);
  }
  return [...groups.values()]
    .map((g) => ({ key: g.key, color: toHex(g.rgb.map((v) => v / g.weight)), weight: g.weight, members: g.members }))
    .sort((a, b) => b.weight - a.weight || a.key.localeCompare(b.key));
}

export function spectrumLayout(spectrum = [], { center = 100 } = {}) {
  const families = spectrumFamilies(spectrum);
  const max = Math.max(1e-6, ...families.map((f) => f.weight));
  return families.map((f) => {
    const hsl = hexToHsl(f.color);
    const share = f.weight / max;
    const muted = f.key === "muted";
    const vivid = hsl.s * (1 - Math.abs(2 * hsl.l - 1) * 0.6);
    const angle = ((hsl.h - 90) * Math.PI) / 180;
    const dist = muted ? 6 : 16 + 46 * (0.5 * vivid + 0.5 * (1 - share));
    return {
      key: f.key,
      color: f.color,
      fill: soften(f.color),
      members: f.members,
      cx: +(center + Math.cos(angle) * dist).toFixed(1),
      cy: +(center + Math.sin(angle) * dist).toFixed(1),
      r: +(14 + 30 * share ** 0.8).toFixed(1),
    };
  });
}
