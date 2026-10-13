import BrewDetails from "./BrewDetails.jsx";
import Tag from "../common/Tag.jsx";
import RecordArtwork from "../common/RecordArtwork.jsx";

export default function CoffeeLogCard({ item }) {
  const meters = [
    ["산미", item.acidity],
    ["단맛", item.sweetness],
    ["쓴맛", item.bitterness],
    ["바디", item.body],
    ["향", item.aroma],
  ];

  return (
    <article className="log-card">
      <RecordArtwork kind="coffee" seed={item.bean} label={item.bean} />
      <div className="card-head">
        <span className="oldnum">{item.date}</span>
        {item.roast && <Tag variant="warm">{item.roast}</Tag>}
      </div>
      <h3>{item.bean}</h3>
      <p>{[item.roastery, item.brew].filter(Boolean).join(" · ")}</p>
      <p className="muted">
        {item.origin} · {item.process}
      </p>
      <div className="groove-meter-list">
        {meters.map(([label, value]) => (
          <div className="groove-meter-row" key={label}>
            <span>{label}</span>
            <span className="fig">
              {item.brewDetails?.sensoryNotes?.[
                {
                  산미: "acidity",
                  단맛: "sweetness",
                  바디: "body",
                  향: "aroma",
                }[label]
              ] || (value === null ? "미기록" : `${value} / 5`)}
            </span>
          </div>
        ))}
      </div>
      <BrewDetails
        details={item.brewDetails || {}}
        waterTemp={item.waterTemp}
        grindSize={item.grindSize}
        brewTime={item.brewTime}
      />
      <p className="log-card-note">{item.memo}</p>
    </article>
  );
}
