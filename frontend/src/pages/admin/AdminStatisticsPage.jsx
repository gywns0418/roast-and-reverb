import PageShell from "../../components/common/PageShell.jsx";

export default function AdminStatisticsPage() {
  return (
    <PageShell title="로그 통계" eyebrow="Admin statistics" subtitle="커피, 음악, 페어링 누적 흐름을 운영 관점에서 봅니다.">
      <div className="panel-grid">
        <section className="panel">
          <h3>인기 커피 키워드</h3>
          <p>예가체프, 케냐 AA, 라이트 로스팅, 핸드드립</p>
        </section>
        <section className="panel">
          <h3>인기 음악 키워드</h3>
          <p>포스트록, 앰비언트, 재즈, 몽환적</p>
        </section>
      </div>
    </PageShell>
  );
}
