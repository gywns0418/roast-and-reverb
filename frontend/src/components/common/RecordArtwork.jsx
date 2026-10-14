import BeanArtwork from "../beans/BeanArtwork.jsx";
// Original AI-generated brand editorial art; never an official album/product photograph.
export default function RecordArtwork({ kind = "music", label = "", small = false }) {
  if (kind === "coffee") return <div className={`record-art bean-record-art ${small ? "art-small" : ""}`}><BeanArtwork item={{name:label,origin:"BREW NOTES"}}/></div>;
  const type = kind === "coffee" ? "coffee" : kind === "music" ? "music" : "pairing";
  return <div className={`record-art editorial-art art-${kind} ${small ? "art-small" : ""}`} aria-hidden="true">
    <img loading="lazy" src={`${import.meta.env.BASE_URL}images/${type}-editorial.webp`} alt="" />
    <span className="editorial-caption">{type === "coffee" ? "BREW / A LITTLE RITUAL" : type === "music" ? "LISTEN / ON REPEAT" : "COFFEE × MUSIC"}</span>
    {label && <span className="editorial-title">{label}</span>}
  </div>;
}
