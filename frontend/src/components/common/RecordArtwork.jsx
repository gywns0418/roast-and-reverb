import BeanArtwork from "../beans/BeanArtwork.jsx";
import ResonanceAura from "../visual/ResonanceAura.jsx";
// Coffee keeps the shared bean artwork. Music and pairings get a generative
// aura in the brand's coffee/sound colours: decorative, never an album cover.
const tones = { music: ["#3446C9", "#9AAAFF"], blend: ["#B23E22", "#3446C9"], pairing: ["#B23E22", "#3446C9"] };
export default function RecordArtwork({ kind = "music", label = "", seed = "", small = false }) {
  if (kind === "coffee") return <div className={`record-art bean-record-art ${small ? "art-small" : ""}`}><BeanArtwork decorative item={{name:label,origin:"BREW NOTES"}}/></div>;
  return <div className={`record-art aura-art art-${kind} ${small ? "art-small" : ""}`} aria-hidden="true">
    <ResonanceAura colors={tones[kind] || tones.blend} seedKey={`${kind}:${seed || label}`} rings={5} />
    {label && <span className="editorial-title">{label}</span>}
  </div>;
}
