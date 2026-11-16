// Staged illustration for non-coffee special picks (e.g. pepper). Drawn shapes only:
// never a product photo, never a claim about what is inside the package.
export const goodsGroups = {
  "블렌드": { label: "블렌드", color: "#b35537", tint: "#f7e9df", code: "PEPPER BLEND", tone: ["#c4553a", "#8f3b2a", "#e0a15a"] },
  "통후추·싱글 오리진": { label: "통후추·싱글 오리진", color: "#4b4a42", tint: "#ecebe4", code: "WHOLE PEPPER", tone: ["#3a3832", "#5e5a4c", "#2a2925"] },
  "뿌추": { label: "뿌추", color: "#8a6d3b", tint: "#f3ecdd", code: "BBUCHU", tone: ["#a7843f", "#6f5630", "#c9a85c"] },
  "도구": { label: "도구", color: "#55656d", tint: "#e7ecee", code: "TOOLS", tone: ["#55656d", "#33424a", "#8796a0"] },
};
export const goodsGroup = (kind) => goodsGroups[kind] || { label: kind || "기타 상품", color: "#7d6950", tint: "#f1ece4", code: "GOODS", tone: ["#7d6950", "#5b4c39", "#a8937a"] };

// Deterministic scatter so each item keeps its own arrangement between visits.
function seeded(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 1000) / 1000;
}

function Corns({ item, group }) {
  const rand = seeded(item.id || item.name || "");
  // A loose heap: a wide bottom row, a middle row, one on top, plus two strays.
  const slots = [[30, 112], [54, 116], [78, 113], [98, 118], [42, 92], [66, 94], [88, 96], [56, 72], [20, 136], [104, 140]];
  const corns = slots.map(([x, y], i) => ({ x: x + (rand() - 0.5) * 6, y: y + (rand() - 0.5) * 6, r: (i > 7 ? 7 : 12) + rand() * 3, c: group.tone[Math.floor(rand() * group.tone.length)] }));
  return corns.map((corn, i) => (
    <g key={i}>
      <circle cx={corn.x} cy={corn.y} r={corn.r} fill={corn.c} />
      <path d={`M${corn.x - corn.r * 0.55} ${corn.y - corn.r * 0.1} q${corn.r * 0.5} ${corn.r * 0.35} ${corn.r * 1.1} -${corn.r * 0.05}`} stroke="rgba(0,0,0,.22)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx={corn.x - corn.r * 0.35} cy={corn.y - corn.r * 0.4} r={corn.r * 0.22} fill="rgba(255,255,255,.35)" />
    </g>
  ));
}

function Mill({ group }) {
  const [main, dark, light] = group.tone;
  return <g>
    <rect x="44" y="26" width="32" height="18" rx="6" fill={dark} />
    <rect x="50" y="18" width="20" height="10" rx="4" fill={light} />
    <path d="M40 46 h40 l-4 70 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 z" fill={main} />
    <rect x="46" y="58" width="6" height="48" rx="3" fill="rgba(255,255,255,.28)" />
    <circle cx="48" cy="134" r="3" fill={dark} /><circle cx="60" cy="138" r="2.5" fill={dark} /><circle cx="71" cy="134" r="3" fill={dark} />
  </g>;
}

export default function GoodsArtwork({ item = {} }) {
  const group = goodsGroup(item.kind);
  return <div className="bean-still goods-still" role="img" aria-label={`${item.name || "상품"}. ${group.label} 상품을 표현한 연출 그림이며 실제 상품 사진이 아닙니다.`}>
    <span className="bean-origin-type">SPECIAL PICK</span>
    <svg className="goods-illustration" viewBox={item.kind === "도구" ? "18 8 84 140" : "6 50 112 104"} aria-hidden="true" focusable="false">
      <ellipse cx="60" cy={item.kind === "도구" ? 142 : 148} rx="46" ry="5" fill="rgba(60,40,20,.12)" />
      {item.kind === "도구" ? <Mill group={group} /> : <Corns item={item} group={group} />}
    </svg>
    <b className="bean-number">{group.code}</b>
    <div className="bean-palette-band">{group.tone.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</div>
  </div>;
}
