import Tag from "../common/Tag.jsx";

export default function CoffeeLogCard({ item }) {
  const meters = [
    ["산미", item.acidity],
    ["단맛", item.sweetness],
    ["쓴맛", item.bitterness],
    ["바디", item.body],
    ["향", item.aroma]
  ];

  return (
    <article className="log-card">
      <div className="card-head">
        <span>{item.date}</span>
        <Tag>{item.roast}</Tag>
      </div>
      <h3>{item.bean}</h3>
      <p>{item.roastery} · {item.brew}</p>
      <p className="muted">{item.origin} · {item.process}</p>
      <div className="groove-meter-list">
        {meters.map(([label, value]) => (
          <div className="groove-meter-row" key={label}>
            <span>{label}</span>
            <span className="fig">{value} / 5</span>
          </div>
        ))}
      </div>
      <p>{item.memo}</p>
    </article>
  );
}
