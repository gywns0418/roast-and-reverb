import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
const groups = [
  [
    "음악과 기억",
    [
      ["/music", "음악 기록"],
      ["/pairing", "연결한 페어링"],
      ["/memories", "감각의 기억"],
      ["/collection", "소장 음반"],
      ["/archive/monthly", "직접 만든 월픽 노트"],
    ],
  ],
  [
    "발견과 기록 도구",
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
      title="기록과 도구"
      subtitle="음악과 원두, 취향을 이어가는 기능을 한곳에서 찾아보세요."
    >
      <Link className="quiet-back" to="/mypage">
        ← 설정
      </Link>
      <div className="tool-directory">
      {groups.map(([title, links]) => (
        <details className="quiet-details" key={title} open>
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
      </div>
      <p className="quiet-muted">
        보조 도구에서 만든 자료도 백업에 포함됩니다. 페이지를 열었다고 시음·청취
        이력을 추가하지 않아요.
      </p>
    </PageShell>
  );
}
