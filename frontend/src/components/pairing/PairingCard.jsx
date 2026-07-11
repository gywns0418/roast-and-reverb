import { Link } from "react-router-dom";
import Tag from "../common/Tag.jsx";

function tagVariant(index) {
  if (index === 0) return "warm";
  if (index === 1) return "cool";
  return "neutral";
}

export default function PairingCard({ item, compact = false }) {
  return (
    <Link to={`/pairing/${item.id}`} className={compact ? "pairing-card pairing-card-compact" : "pairing-card"} style={{ display: "grid" }}>
      <div className="card-head">
        <span>{item.date}</span>
        <span className="specimen-no">no. <span className="oldnum">{item.score}</span></span>
      </div>
      <div className="pairing-names">
        <h3>{item.coffee}</h3>
        <h3>{item.artist}</h3>
      </div>
      <p>{item.music}</p>
      <p className="mood-line">{item.mood}</p>
      <div className="tag-row">
        {item.tags.map((tag, index) => (
          <Tag key={tag} variant={tagVariant(index)}>{tag}</Tag>
        ))}
      </div>
      <blockquote>{item.text}</blockquote>
    </Link>
  );
}
