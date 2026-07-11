import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import { monthlyReport } from "../../data/sampleData.js";

export default function MonthlyReportPage() {
  return (
    <PageShell title="취향 리포트" eyebrow="Monthly report" subtitle="쌓인 기록에서 커피 취향과 음악 취향의 반복 패턴을 찾습니다.">
      <div className="panel-grid">
        <section className="panel">
          <h3>AI 월간 코멘트</h3>
          <p>{monthlyReport.summary} 특히 밝은 산미와 포스트록/앰비언트 계열 음악의 조합이 자주 등장했습니다.</p>
          <div className="tag-row">
            <Tag variant="warm">밝은 산미</Tag>
            <Tag variant="cool">포스트록</Tag>
            <Tag variant="cool">몽환적</Tag>
          </div>
        </section>
        <section className="panel">
          <h3>취향 지표</h3>
          <div className="insight-list">
            <p><strong>자주 마신 원두</strong><span>{monthlyReport.favoriteCoffee}</span></p>
            <p><strong>자주 들은 아티스트</strong><span>{monthlyReport.favoriteArtist}</span></p>
            <p><strong>대표 무드</strong><span>{monthlyReport.frequentMood}</span></p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
