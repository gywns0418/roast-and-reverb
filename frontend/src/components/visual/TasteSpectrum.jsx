import { useId } from "react";
import { hashString, seededRandom } from "../../utils/resonanceAura.js";

// All the colours the drinker has had, blended into one vivid field. The more
// often a colour appears, the larger and nearer the centre it sits. Same
// spectrum → same picture.
export default function TasteSpectrum({ spectrum = [], label, className = "" }) {
  const id = useId().replace(/:/g, "");
  const items = spectrum.slice(0, 48);
  const max = Math.max(1e-6, ...items.map((s) => s.weight));
  const rand = seededRandom(hashString(items.map((s) => s.color + s.weight.toFixed(2)).join("|")));
  const golden = Math.PI * (3 - Math.sqrt(5));
  const blobs = items.map((s, i) => {
    const t = i / Math.max(1, items.length - 1);
    const dist = 8 + t * 62 + rand() * 10;
    const angle = i * golden + rand() * 0.6;
    return {
      color: s.color,
      cx: +(100 + Math.cos(angle) * dist).toFixed(1),
      cy: +(100 + Math.sin(angle) * dist).toFixed(1),
      r: +(16 + 30 * Math.sqrt(s.weight / max) + rand() * 6).toFixed(1),
    };
  });
  return (
    <svg className={"taste-spectrum " + className} viewBox="0 0 200 200" role="img" aria-label={label}>
      <defs>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
          <feColorMatrix type="saturate" values="1.35" />
        </filter>
        <filter id={`${id}n`}>
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed={items.length} />
          <feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .18 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id={`${id}c`}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <g filter={`url(#${id}b)`} className="spectrum-swirl">
          {blobs.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.color} opacity="0.86" />
          ))}
        </g>
        <circle cx="100" cy="100" r="96" fill="#fff" filter={`url(#${id}n)`} />
      </g>
      {[30, 52, 74].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="0.8" />
      ))}
      <circle cx="100" cy="100" r="96" fill="none" stroke="var(--rs-aura-line)" />
    </svg>
  );
}
