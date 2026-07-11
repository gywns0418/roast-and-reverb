import PageShell from "../../components/common/PageShell.jsx";
import { recommendations } from "../../data/sampleData.js";

export default function RecommendPage() {
  return (
    <PageShell title="추천" eyebrow="Recommendation" subtitle="서버가 후보를 고르고 AI가 추천 이유를 자연스럽게 설명합니다.">
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Recommend</span>
          <span className="vol oldnum">{recommendations.length} pairs</span>
        </div>
        <div className="xref-list">
          {recommendations.map((item) => (
            <div className="xref-row" key={item.id}>
              <span className="eyebrow">{item.title}</span>
              <div className="flow"><span className="arrow">→</span> {item.target}</div>
              <p>{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
