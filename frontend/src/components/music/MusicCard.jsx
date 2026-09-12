import Tag from "../common/Tag.jsx";

export default function MusicCard({ item }) {
  return (
    <article className="log-card">
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
