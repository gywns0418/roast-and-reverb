import PageShell from "../../components/common/PageShell.jsx";
import { coffeeLogs } from "../../data/sampleData.js";

export default function CoffeeLogPage() {
  return (
    <PageShell title="커피 로그" eyebrow="Coffee" subtitle="원두, 추출 방식, 맛 평가를 기록합니다.">
      <div className="card-grid">
        {coffeeLogs.map((item) => (
          <article className="log-card" key={item.id}>
            <h3>{item.bean}</h3>
            <p>{item.roastery} · {item.brew}</p>
            <div className="metric-row"><span>산미 {item.acidity}</span><span>바디 {item.body}</span></div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
