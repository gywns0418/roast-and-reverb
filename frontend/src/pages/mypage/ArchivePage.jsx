import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
const groups = [
  [
    "음악과 기억",
    [
      ["/music", "음악 기록", "커피와 함께 들은 곡을 다시 꺼내봐요."],
      ["/pairing", "연결한 페어링", "직접 남긴 커피와 음악의 조합을 살펴봐요."],
      ["/memories", "감각의 기억", "기억에 남긴 느낌과 취향을 모아봐요."],
      ["/collection", "소장 음반", "가지고 있는 음반과 감상을 정리해요."],
      ["/archive/monthly", "직접 만든 월픽 노트", "내가 정리한 원두 후보와 메모를 관리해요."],
    ],
  ],
  [
    "발견과 기록 도구",
    [
      ["/journey", "감상 가이드", "커피와 음악의 느낌을 천천히 살펴봐요."],
      ["/ritual", "청음실", "한 잔과 함께 들을 음악을 골라봐요."],
      ["/studio", "연주 만들기", "내가 고른 분위기로 연주를 구성해요."],
      ["/recommend", "조합 추천", "지금의 기분에 어울리는 원두와 곡을 찾아요."],
      ["/report/monthly", "기록 통계", "내가 남긴 기록에서 취향의 흐름을 살펴봐요."],
      ["/connections", "자료 연결 상태", "연결한 원두 파일과 자료의 상태를 확인해요."],
      ["/coffee/import", "이전 기록 가져오기", "가지고 있던 커피 기록을 확인하고 가져와요."],
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
            {links.map(([to, label, description]) => (
              <Link key={to} to={to}>
                <div><strong>{label}</strong><small>{description}</small></div>
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
