import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Tag from "../../components/common/Tag.jsx";
import { authStore } from "../../store/authStore.js";
import { monthlyReport } from "../../data/sampleData.js";
import { reportApi } from "../../api/reportApi.js";
import { adaptMonthlyReport } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MyPage() {
  const navigate = useNavigate();
  const user = authStore.user || { nickname: "slow brew", email: "brewer@example.com" };
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

  function handleLogout() {
    authStore.clear();
    navigate("/auth/login");
  }

  return (
    <PageShell title="마이페이지" eyebrow="Profile" subtitle="나의 기록 수와 자주 등장한 취향 키워드를 확인합니다.">
      <section className="panel profile-panel">
        <div className="profile-avatar">RR</div>
        <div>
          <h3>{user.nickname || user.email || "slow brew"}</h3>
          <p>{user.email || "brewer@example.com"}</p>
          <div className="tag-row">
            <Tag variant="warm">밝은 산미</Tag>
            <Tag variant="cool">포스트록</Tag>
            <Tag variant="cool">몽환적</Tag>
          </div>
          <div className="action-row">
            <Link to="/admin" className="ghost-button">관리자 화면</Link>
            <Button onClick={handleLogout}>로그아웃</Button>
          </div>
        </div>
      </section>
      <div className="stat-grid">
        {report.stats.map((stat) => (
          <div className="stat-tile" key={stat.label}>
            <span>{stat.label}</span>
            <strong className="oldnum">{stat.value}</strong>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
