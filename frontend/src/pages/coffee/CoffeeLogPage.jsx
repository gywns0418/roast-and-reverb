import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { coffeeLogs } from "../../data/sampleData.js";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function CoffeeLogPage() {
  const fallback = coffeeLogs.map(adaptCoffeeLog);
  const { data: logs } = useApiResource(
    () => coffeeApi.list().then((items) => items.map(adaptCoffeeLog)),
    fallback,
    []
  );

  return (
    <PageShell title="커피 로그" eyebrow="Side A" subtitle="원두, 추출 방식, 맛 평가와 그날의 감각을 기록합니다.">
      <div className="action-row">
        <Link to="/coffee/write" className="primary-button">커피 로그 작성</Link>
      </div>
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Coffee Log</span>
          <span className="vol oldnum">{logs.length} entries</span>
        </div>
        {logs.length === 0
          ? <EmptyState icon="branch">아직 채워지지 않은 첫 장이에요.</EmptyState>
          : logs.map((item, i) => (
            <Link to={`/coffee/${item.id}`} className="ledger-line fresh" key={item.id}>
              <time className="oldnum">{item.date.slice(5)}.</time>
              <span className="entry">
                <span className="type-dot coffee" />
                <strong>{item.bean}</strong> — {item.roastery} · {item.brew} · {item.origin}
              </span>
              <span className="no oldnum">no. {String(logs.length - i).padStart(3, "0")}</span>
            </Link>
          ))}
      </div>
    </PageShell>
  );
}
