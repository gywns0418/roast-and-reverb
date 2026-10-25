import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
const groups = [
  [
    "예전 기록",
    [
      ["/music", "음악 기록"],
      ["/pairing", "연결한 페어링"],
      ["/memories", "감각의 기억"],
      ["/collection", "소장 음반"],
      ["/archive/monthly", "직접 만든 월픽 노트"],
    ],
  ],
  [
    "필요할 때 쓰는 보조 도구",
    [
      ["/journey", "감상 가이드"],
      ["/ritual", "청음실"],
      ["/studio", "연주 만들기"],
      ["/recommend", "조합 추천"],
      ["/report/monthly", "기록 통계"],
      ["/connections", "자료 연결 상태"],
      ["/coffee/import", "이전 기록 가져오기"],
    ],
  ],
];
export default function ArchivePage() {
  return (
    <PageShell
      title="기존 자료와 도구"
      subtitle="기존 자료는 보존했습니다. 필요할 때만 열어보세요."
    >
      <Link className="quiet-back" to="/mypage">
        ← 설정
      </Link>
      {groups.map(([title, links]) => (
        <details className="quiet-details" key={title}>
          <summary>{title}</summary>
          <nav className="quiet-link-list">
            {links.map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </details>
      ))}
      <p className="quiet-muted">
        보조 도구에서 만든 자료도 백업에 포함됩니다. 페이지를 열었다고 시음·청취
        이력을 추가하지 않아요.
      </p>
    </PageShell>
  );
}
