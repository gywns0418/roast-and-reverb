import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
export default function HelpPage() {
  return (
    <PageShell title="처음이라면" subtitle="세 가지만 기억하면 충분해요.">
      <ol className="quiet-guide">
        <li>
          <h2>커피의 느낌을 한 줄 적어요.</h2>
          <p>
            원두 이름이나 추출 방법을 몰라도 괜찮아요. '고소해서 좋았어'처럼
            기억나는 말을 적어주세요.
          </p>
          <Link to="/dashboard">한 줄 남기기 →</Link>
        </li>
        <li>
          <h2>원하면 음악을 함께 골라요.</h2>
          <p>
            기록 확인 화면의 '음악도 함께 남길까요?'를 펼쳐보세요. 음악은 직접
            눌러야 재생되고, 듣기만 해서는 기록되지 않아요.
          </p>
        </li>
        <li>
          <h2>저장하고, 내 기록에서 다시 봐요.</h2>
          <p>
            저장 전에는 초안이에요. 저장 버튼을 누른 뒤 내 기록에서 확인할 수
            있어요.
          </p>
          <Link to="/coffee">내 기록 열기 →</Link>
        </li>
      </ol>
      <section className="quiet-section">
        <h2>기록을 안전하게 보관하려면</h2>
        <p>
          체험 모드는 이 브라우저에 저장합니다. 다른 기기로 옮기거나 브라우저
          저장소를 지우기 전 백업을 내려받아주세요. 서버 모드의 계정 기록과 기기
          백업은 저장 위치가 달라요.
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
