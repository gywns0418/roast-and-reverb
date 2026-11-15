// One radial coordinate system for any number of series (coffee, music, match).
// Values are 0..1 or null (unrecorded). Every value is also printed in the table.
export default function ResonanceChart({ axes, series, caption, format = (v) => `${Math.round(v * 100)}%` }) {
  const n = axes.length;
  const pt = (v, i, r = 78) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [100 + Math.cos(a) * v * r, 100 + Math.sin(a) * v * r];
  };
  const poly = (values) => values.map((v, i) => pt(v ?? 0, i).map((x) => x.toFixed(1)).join(",")).join(" ");
  return (
    <div className="resonance-chart">
      <svg viewBox="-46 -16 292 232" role="img" aria-label={`${caption}. 수치는 옆 표에 있어요.`}>
        {[0.25, 0.5, 0.75, 1].map((k) => (
          <polygon key={k} points={poly(axes.map(() => k))} fill="none" stroke="var(--rs-line)" />
        ))}
        {axes.map((_, i) => {
          const [x, y] = pt(1, i);
          return <line key={i} x1="100" y1="100" x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="var(--rs-line)" />;
        })}
        {series.map((s) => (
          <polygon
            key={s.label}
            points={poly(s.values)}
            fill={s.fill || "none"}
            stroke={s.color}
            strokeWidth="2"
            strokeDasharray={s.dashed ? "5 3" : undefined}
          />
        ))}
        {axes.map((label, i) => {
          const [x, y] = pt(1.2, i);
          return (
            <text key={label} x={x.toFixed(1)} y={y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="var(--rs-text-2)">
              {label}
            </text>
          );
        })}
      </svg>
      <div>
        <ul className="resonance-legend" aria-hidden="true">
          {series.map((s) => (
            <li key={s.label}>
              <i style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
        <table className="resonance-table">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">축</th>
              {series.map((s) => (
                <th scope="col" key={s.label}>{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {axes.map((label, i) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {series.map((s) => (
                  <td className="num" key={s.label}>{s.values[i] == null ? "미기록" : format(s.values[i], s)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
