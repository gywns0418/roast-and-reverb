import { useId } from "react";
import { soften, spectrumLayout } from "../../utils/spectrumLayout.js";

// All the colours the drinker has had, gathered into a few soft washes by colour
// family and laid out like a colour wheel (see utils/spectrumLayout.js).
export default function TasteSpectrum({ spectrum = [], label, className = "" }) {
  const id = useId().replace(/:/g, "");
  const blobs = spectrumLayout(spectrum);
  // A soft ground in the drinker's most frequent colour ties the field together.
  const ground = blobs[0] ? soften(blobs[0].color, 0.78) : "#EFE7DC";
  return (
    <svg className={"taste-spectrum " + className} viewBox="0 0 200 200" role="img" aria-label={label}>
      <defs>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
          <feColorMatrix type="saturate" values="0.82" />
        </filter>
        <filter id={`${id}n`}>
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed={blobs.length} />
          <feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .18 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id={`${id}c`}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <circle cx="100" cy="100" r="96" fill={ground} />
        <g filter={`url(#${id}b)`} className="spectrum-swirl">
          {blobs.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity="0.85" />
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
