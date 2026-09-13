import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import Motif from "../../components/common/Motif.jsx";
import { monthlyReport } from "../../data/sampleData.js";
import { reportApi } from "../../api/reportApi.js";
import { adaptMonthlyReport } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MonthlyReportPage() {
  const fallback = adaptMonthlyReport({
    summary: {
      latestMoodSummary: monthlyReport.summary,
      coffeeDays: 18,
      pairingCount: 12,
      avgPairingScore: 88
    },
    favoriteCoffees: [{ beanName: monthlyReport.favoriteCoffee }],
    favoriteArtists: [{ artistName: monthlyReport.favoriteArtist }],
    moodStats: [{ moodTags: monthlyReport.frequentMood }]
  });
  const { data: report } = useApiResource(
    () => reportApi.monthly().then(adaptMonthlyReport),
    fallback,
    []
  );

  const avgScore = report.stats?.[3]?.value ?? 0;

  return (
    <PageShell title="취향 리포트" eyebrow="Monthly report" subtitle="쌓인 기록에서 커피 취향과 음악 취향의 반복 패턴을 찾습니다.">
      <div className="specimen-card">
        <Motif variant="blend" />
        <div className="names">{report.favoriteCoffee}<span>&</span>{report.favoriteArtist}</div>
        <p className="catalog smcp">이달의 베스트 페어링 · Avg <span className="oldnum">{avgScore}</span></p>
      </div>
      <div className="panel-grid">
        <section className="panel">
          <h3>AI 월간 코멘트</h3>
          <p>{report.summary}</p>
          <div className="tag-row">
            <Tag variant="warm">밝은 산미</Tag>
            <Tag variant="cool">포스트록</Tag>
            <Tag variant="cool">몽환적</Tag>
          </div>
        </section>
        <section className="panel">
          <h3>취향 지표</h3>
          <div className="insight-list">
            <p><strong>자주 마신 원두</strong><span>{report.favoriteCoffee}</span></p>
            <p><strong>자주 들은 아티스트</strong><span>{report.favoriteArtist}</span></p>
            <p><strong>대표 무드</strong><span>{report.frequentMood}</span></p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
