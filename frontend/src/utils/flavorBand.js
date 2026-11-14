// Turns a bean's vendor flavor HEX colors into a striped band, exactly as the
// vendor published them. Falls back to a neutral roast tone when none exist.
export function flavorBandBackground(bean) {
  const colors = (bean?.flavorColors || []).filter((c) => /^#[0-9a-f]{6}$/i.test(c));
  if (!colors.length) return "#b9a88a";
  const step = 100 / colors.length;
  return `linear-gradient(90deg, ${colors.map((c, i) => `${c} ${(i * step).toFixed(2)}% ${((i + 1) * step).toFixed(2)}%`).join(", ")})`;
}
