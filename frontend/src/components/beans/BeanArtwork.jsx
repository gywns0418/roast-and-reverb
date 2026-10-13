export default function BeanArtwork({ item, compact=false }) {
  const colors=(item.flavorColors || []).filter(color=>/^#[0-9a-f]{6}$/i.test(color));
  return <div className={`bean-still ${compact?"compact":""}`} aria-hidden="true">
    <span className="bean-origin-type">{item.origin || "COFFEE BEANS"}</span>
    <svg viewBox="0 0 240 150" className="bean-symbol"><g fill="currentColor" stroke="#fff9eb" strokeWidth="2"><ellipse cx="115" cy="75" rx="39" ry="56" transform="rotate(32 115 75)"/><path d="M141 30C132 57 102 78 89 120" fill="none" strokeWidth="5"/><ellipse cx="175" cy="100" rx="24" ry="34" transform="rotate(-28 175 100)"/><path d="M161 72C162 91 181 113 191 126" fill="none" strokeWidth="3"/></g></svg>
    <b className="bean-number">{item.name.match(/^#\d+/)?.[0] || "BEANS"}</b><small>{item.variety || item.process || "ORIGIN & FLAVOR"}</small>
    <div className="bean-palette-band">{colors.length?colors.map((color,index)=><i key={index} style={{backgroundColor:color}}/>):<i style={{backgroundColor:"var(--group-color, #7d6950)"}}/>}</div>
  </div>;
}
