import Tag from "../common/Tag.jsx";

export default function MusicCard({ item }) {
  return (
    <article className="log-card">
      <div className="card-head">
        <span>{item.date}</span>
        <Tag>{item.source}</Tag>
      </div>
      <h3>{item.track}</h3>
      <p>{item.artist} · {item.album}</p>
      <p className="muted">{item.genre}</p>
      <div className="tag-row">
        {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </div>
      <p>{item.memo}</p>
    </article>
  );
}
