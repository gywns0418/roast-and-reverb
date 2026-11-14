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
      </defs>
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
          stroke="var(--rs-aura-line)"
          strokeWidth={i % 3 === 0 ? 1.2 : 0.7}
          strokeDasharray={m.empty && i % 2 ? "2 5" : undefined}
        />
      ))}
      <circle cx="100" cy="100" r="96" fill="none" stroke="var(--rs-aura-line)" />
    </svg>
  );
}
