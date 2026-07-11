import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import { coffeeLogs } from "../../data/sampleData.js";

export default function CoffeeLogPage() {
  return (
    <PageShell title="커피 로그" eyebrow="Side A" subtitle="원두, 추출 방식, 맛 평가와 그날의 감각을 기록합니다.">
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Coffee Log</span>
          <span className="vol oldnum">{coffeeLogs.length} entries</span>
        </div>
        {coffeeLogs.map((item, i) => (
          <Link to={`/coffee/${item.id}`} className="ledger-line fresh" key={item.id}>
            <time className="oldnum">{item.date.slice(5)}.</time>
            <span className="entry">
              <span className="type-dot coffee" />
              <strong>{item.bean}</strong> — {item.roastery} · {item.brew} · {item.origin}
            </span>
            <span className="no oldnum">no. {String(coffeeLogs.length - i).padStart(3, "0")}</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
