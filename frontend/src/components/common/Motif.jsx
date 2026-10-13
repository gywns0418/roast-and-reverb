const PATHS = {
  branch: ["M24 44 C24 30 20 20 10 10", "M24 34 C24 26 27 20 34 15", "M14 16 C14 12 17 9 22 8"],
  wave: ["M6 34 Q14 10 22 34 T38 18"],
  blend: ["M10 40 Q10 20 24 20 Q24 8 38 8", "M24 20 Q28 30 38 28"],
  flow: ["M8 24h10M28 24h12M18 24l6-8M18 24l6 8"]
};

export default function Motif({ variant = "blend", className = "motif" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      {PATHS[variant].map((d) => <path d={d} key={d} />)}
    </svg>
  );
}
