import { noteFamilies } from "../../utils/tasteQuery.js";
import { familyColors } from "../../utils/resonanceAura.js";
import ResonanceAura from "../visual/ResonanceAura.jsx";

// Taste map: every family the drinker marked, on one radial coordinate system.
// Outer polygon = cups they want again, inner dashed = cups that were not theirs.
// Counts are always readable as text in the table beside it.
export default function TasteMap({ profile }) {
  const rows = noteFamilies.map((f) => {
    const hit = [...profile.likedFamilies, ...profile.dislikedFamilies].find((x) => x.key === f.key);
    return { ...f, again: hit?.again || 0, notMine: hit?.notMine || 0 };
  });
  const max = Math.max(1, ...rows.map((r) => Math.max(r.again, r.notMine)));
  const n = rows.length;
  const pt = (value, i, radius = 78) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = (value / max) * radius;
    return [100 + Math.cos(a) * r, 100 + Math.sin(a) * r];
  };
  const poly = (field) => rows.map((r, i) => pt(r[field], i).map((v) => v.toFixed(1)).join(",")).join(" ");
  const marked = rows.filter((r) => r.again || r.notMine);
  return (
    <section className="taste-map" aria-labelledby="taste-map-title">
      <div className="taste-map-head">
        <ResonanceAura
          className="taste-map-aura"
          colors={profile.likedFamilies.map((f) => familyColors[f.key])}
          energy={Math.min(10, profile.againCount)}
          depth={Math.min(10, profile.judged)}
          rings={3 + Math.min(6, profile.judged)}
          seedKey="taste-map"
          label={`다시 찾는 맛 ${profile.likedFamilies.length}가지로 만든 나의 오라`}
        />
        <div>
          <p className="taste-map-kicker">Taste map</p>
          <h2 id="taste-map-title">나의 취향 지도</h2>
          <p>바깥 선은 다시 마시고 싶었던 잔, 점선은 내 취향이 아니었던 잔이에요. 맛마다 몇 잔이었는지 옆 표에 적어 두었어요.</p>
        </div>
      </div>
      <div className="taste-map-body">
        <svg viewBox="-34 -12 268 224" role="img" aria-label="맛 분류별 잔 수를 그린 취향 지도. 수치는 옆 표에 있어요.">
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <polygon key={k} points={rows.map((_, i) => pt(max * k, i).map((v) => v.toFixed(1)).join(",")).join(" ")} fill="none" stroke="var(--rs-line)" />
          ))}
          <polygon points={poly("again")} fill="color-mix(in srgb, var(--rs-coffee) 22%, transparent)" stroke="var(--rs-coffee)" strokeWidth="2" />
          <polygon points={poly("notMine")} fill="none" stroke="var(--rs-text-3)" strokeWidth="1.5" strokeDasharray="4 3" />
          {rows.map((r, i) => {
            const [x, y] = pt(max * 1.18, i);
            return (
              <text key={r.key} x={x.toFixed(1)} y={y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill={r.again || r.notMine ? "var(--rs-text)" : "var(--rs-text-3)"}>
                {r.label}
              </text>
            );
          })}
          {rows.map((r, i) => {
            if (!r.again) return null;
            const [x, y] = pt(r.again, i);
            return <circle key={r.key} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.5" fill={familyColors[r.key]} stroke="var(--rs-surface)" strokeWidth="1.5" />;
          })}
        </svg>
        <table className="taste-map-table">
          <caption className="sr-only">맛 분류별 잔 수</caption>
          <thead>
            <tr><th scope="col">맛</th><th scope="col">다시 마실래요</th><th scope="col">내 취향 아님</th></tr>
          </thead>
          <tbody>
            {(marked.length ? marked : rows.slice(0, 4)).map((r) => (
              <tr key={r.key}>
                <th scope="row"><i aria-hidden="true" style={{ background: familyColors[r.key] }} />{r.label}</th>
                <td className="num">{r.again}잔</td>
                <td className="num">{r.notMine}잔</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
