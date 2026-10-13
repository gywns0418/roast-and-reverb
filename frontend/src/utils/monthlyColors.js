export const monthlyGroups = {
  "unspecialty blend": { label: "언스페셜티 블렌드", color: "#b35537", tint: "#f7e9df", code: "UNSPECIALTY BLEND" },
  blend: { label: "하우스 블렌드", color: "#80603f", tint: "#efe8dd", code: "HOUSE BLEND" },
  "single origin": { label: "싱글", color: "#526849", tint: "#eaf0e3", code: "SINGLE ORIGIN" },
  "special single": { label: "스페셜 싱글", color: "#725685", tint: "#eee7f4", code: "SPECIAL SINGLE" },
  easy: { label: "드립백", color: "#476976", tint: "#e5eff1", code: "DRIP BAG" }
};
export const colorFamilies = [
  ["purple", "보라", "#8056b5"], ["pink", "분홍", "#e5a1b3"], ["red", "빨강", "#b83f45"],
  ["orange", "주황", "#ee963b"], ["yellow", "노랑", "#e9c84e"], ["green", "초록", "#8ca960"],
  ["blue", "파랑", "#5b8eb3"], ["brown", "갈색", "#95704e"], ["cream", "크림", "#f4edcf"]
];
export function safeColor(value) {
  return typeof value === "string" && /^#?[0-9a-f]{6}$/i.test(value) ? `#${value.replace(/^#/, "").toLowerCase()}` : null;
}
export function colorFamily(value) {
  const hex = safeColor(value); if (!hex) return null;
  const [r,g,b] = [1,3,5].map(index => parseInt(hex.slice(index,index+2),16)/255);
  const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min,light=(max+min)/2;
  if (light>0.86 || delta<0.10) return "cream";
  let hue=delta===0 ? 0 : max===r ? ((g-b)/delta)%6 : max===g ? (b-r)/delta+2 : (r-g)/delta+4;
  hue=(hue*60+360)%360;
  if (hue>=15 && hue<70 && light<0.50) return "brown";
  if (hue>=270 && hue<345 && light>0.65) return "pink";
  if (hue<15 || hue>=345) return "red";
  if (hue<45) return light>0.70 ? "pink" : "orange";
  if (hue<70) return "yellow";
  if (hue<170) return "green";
  if (hue<245) return "blue";
  return "purple";
}
export function hasColor(item, family) {
  return family === "all" || (item.flavorColors || []).some(color => colorFamily(color) === family);
}
