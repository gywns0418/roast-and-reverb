import JournalGuide from "../../components/common/JournalGuide.jsx";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
export default function HelpPage() {
  return (
    <PageShell title="처음이라면" subtitle="세 가지만 기억하면 충분해요.">
      <JournalGuide />
      <section className="quiet-section">
        <h2>기록을 안전하게 보관하려면</h2>
        <p>
          기기 모드는 이 브라우저에 저장합니다. 다른 기기로 옮기거나 브라우저
          저장소를 지우기 전 백업을 내려받아주세요. GitHub 기록장은 계정 서버를 사용하지 않습니다. 이전 Railway 계정 자료는 자동으로 옮겨지지 않아요.
        </p>
        <Link to="/backup">백업 방법 보기 →</Link>
      </section>
      <details className="quiet-details">
        <summary>예전에 쓰던 기능은 어디 있나요?</summary>
        <p>
          기존 자료와 도구는 보관함에 그대로 있습니다. 새 기록의 기본 흐름에서는
          표시하지 않아요.
        </p>
        <Link to="/archive">기존 자료와 도구 열기 →</Link>
      </details>
    </PageShell>
  );
}
