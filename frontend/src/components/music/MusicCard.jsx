import Tag from "../common/Tag.jsx";
import RecordArtwork from "../common/RecordArtwork.jsx";

export default function MusicCard({ item }) {
  return (
    <article className="log-card">
      <RecordArtwork seed={item.artist} label={item.album || item.track} />
      <div className="card-head">
        <span className="oldnum">{item.date}</span>
        <Tag variant="cool">{item.source}</Tag>
      </div>
      <h3>{item.track}</h3>
      <p>{item.artist} · {item.album}</p>
      <p className="muted">{item.genre}</p>
      <div className="tag-row">
        {item.tags.map((tag) => <Tag key={tag} variant="cool">{tag}</Tag>)}
      </div>
      <p className="log-card-note">{item.memo}</p>
    </article>
  );
}
