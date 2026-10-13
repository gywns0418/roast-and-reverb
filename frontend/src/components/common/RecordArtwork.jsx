// Original graphic artwork, not an official album cover.
export default function RecordArtwork({ kind = "music", seed = "", label = "", small = false }) {
  const tone = [...String(seed)].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5;
  return <div className={`record-art art-${kind} tone-${tone} ${small ? "art-small" : ""}`} aria-hidden="true">
    <span className="art-caption">ROAST & REVERB / {kind === "coffee" ? "BREW NOTES" : kind === "blend" ? "DAILY SESSION" : "LISTENING NOTES"}</span>
    <div className="art-disc"><i>r&amp;r</i></div>
    {kind !== "music" && <div className="art-cup"><i /></div>}
    <span className="art-wave">∿</span>
    <span className="art-title">{label || (kind === "coffee" ? "A cup.\nA moment." : kind === "blend" ? "Brew.\nListen.\nFeel." : "On\nrepeat.")}</span>
    <span className="art-bottom">GOOD COFFEE. GOOD MUSIC.</span>
  </div>;
}
