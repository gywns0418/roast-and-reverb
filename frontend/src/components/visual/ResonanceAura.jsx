import { useId } from "react";
import { auraModel } from "../../utils/resonanceAura.js";

// Generative aura. Empty input draws an outline only, so an empty journal is
// never dressed up as data.
export default function ResonanceAura({ colors, energy, depth, rings, seedKey, label, className = "" }) {
  const id = useId().replace(/:/g, "");
  const m = auraModel({ colors, energy, depth, rings, key: seedKey });
  const decorative = !label;
  return (
    <svg
      className={"resonance-aura " + className}
      viewBox="0 0 200 200"
      role={decorative ? undefined : "img"}
      aria-label={label || undefined}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <defs>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={m.blur} />
        </filter>
        <filter id={`${id}n`}>
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed={m.seed % 997} />
          <feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .2 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id={`${id}c`}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
        {m.empty && (
          <>
            <radialGradient id={`${id}g1`} cx="34%" cy="38%" r="60%">
              <stop offset="0" style={{ stopColor: "var(--rs-coffee)", stopOpacity: 0.3 }} />
              <stop offset="1" style={{ stopColor: "var(--rs-coffee)", stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id={`${id}g2`} cx="68%" cy="66%" r="60%">
              <stop offset="0" style={{ stopColor: "var(--rs-sound)", stopOpacity: 0.26 }} />
              <stop offset="1" style={{ stopColor: "var(--rs-sound)", stopOpacity: 0 }} />
            </radialGradient>
          </>
        )}
      </defs>
      {/* Empty journal: a faint brand wash (not data) so the outline still feels alive. */}
      {m.empty && (
        <g clipPath={`url(#${id}c)`} className="aura-base">
          <circle cx="100" cy="100" r="96" fill={`url(#${id}g1)`} />
          <circle cx="100" cy="100" r="96" fill={`url(#${id}g2)`} />
        </g>
      )}
      <g clipPath={`url(#${id}c)`}>
        <g filter={`url(#${id}b)`}>
          {m.blobs.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.color} opacity={b.opacity} />
          ))}
        </g>
        {!m.empty && <circle cx="100" cy="100" r="96" fill="#fff" filter={`url(#${id}n)`} />}
      </g>
      {m.rings.map((r, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={m.empty ? (i % 2 ? "var(--rs-sound)" : "var(--rs-coffee)") : "var(--rs-aura-line)"}
          strokeOpacity={m.empty ? 0.42 : undefined}
          strokeWidth={i % 3 === 0 ? 1.2 : 0.7}
          strokeDasharray={m.empty && i % 2 ? "2 5" : undefined}
        />
      ))}
      <circle cx="100" cy="100" r="96" fill="none" stroke={m.empty ? "url(#" + id + "g1)" : "var(--rs-aura-line)"} />
      {m.empty && <circle cx="100" cy="100" r="96" fill="none" stroke="var(--rs-coffee)" strokeOpacity="0.35" />}
    </svg>
  );
}
