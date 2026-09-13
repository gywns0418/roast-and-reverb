import PageShell from "../../components/common/PageShell.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { adminApi } from "../../api/adminApi.js";
import { formatDate } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

const fallbackStats = [
  { stat_date: "2026-07-09", coffee_count: 2, music_count: 2, pairing_count: 1 },
  { stat_date: "2026-07-08", coffee_count: 1, music_count: 1, pairing_count: 1 }
];

function range() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 14);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10)
  };
}

export default function AdminStatisticsPage() {
  const { data: stats } = useApiResource(
    () => adminApi.dailyStatistics(range()),
    fallbackStats,
    []
  );
  const totals = stats.reduce((acc, item) => ({
    coffee: acc.coffee + Number(item.coffee_count || item.coffeeCount || 0),
    music: acc.music + Number(item.music_count || item.musicCount || 0),
    pairing: acc.pairing + Number(item.pairing_count || item.pairingCount || 0)
  }), { coffee: 0, music: 0, pairing: 0 });

  return (
    <PageShell title="로그 통계" eyebrow="Admin statistics" subtitle="커피, 음악, 페어링의 일별 흐름을 운영 관점에서 봅니다.">
      <div className="dashboard-layout">
        <div className="ledger">
          <div className="ledger-head">
            <span className="book smcp">Daily Stats</span>
            <span className="vol oldnum">최근 14일</span>
          </div>
          {stats.length === 0
            ? <EmptyState>이 기간에는 기록된 통계가 없어요.</EmptyState>
            : stats.map((item, i) => (
              <div className={`ledger-line ${i < 3 ? "fresh" : "aged"}`} key={item.stat_date || item.statDate}>
                <time className="oldnum">{formatDate(item.stat_date || item.statDate).slice(5)}.</time>
                <span className="entry">
                  <span className="type-dot coffee" /> 커피 {item.coffee_count || item.coffeeCount || 0}
                  <span className="type-dot music" style={{ marginLeft: 10 }} /> 음악 {item.music_count || item.musicCount || 0}
                </span>
                <span className="no oldnum">페어링 {item.pairing_count || item.pairingCount || 0}</span>
              </div>
            ))}
        </div>
        <aside className="margin-panel">
          <div>
            <h4>Period Total</h4>
            <div className="margin-stat"><span>커피</span><strong className="oldnum">{totals.coffee}</strong></div>
            <div className="margin-stat"><span>음악</span><strong className="oldnum">{totals.music}</strong></div>
            <div className="margin-stat"><span>페어링</span><strong className="oldnum">{totals.pairing}</strong></div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
