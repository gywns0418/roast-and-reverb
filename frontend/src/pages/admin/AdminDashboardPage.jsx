import PageShell from "../../components/common/PageShell.jsx";

const stats = [
  ["회원", "128"],
  ["커피 로그", "1,842"],
  ["음악 로그", "1,536"],
  ["AI 분석", "923"]
];

export default function AdminDashboardPage() {
  return (
    <PageShell title="관리자 대시보드" eyebrow="Admin" subtitle="서비스 사용량과 AI 분석 상태를 확인합니다.">
      <div className="stat-grid admin-stat-grid">
        {stats.map(([label, value]) => (
          <div className="stat-tile" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
