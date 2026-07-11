import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";

export default function AdminAiLogPage() {
  return (
    <PageShell title="AI 호출 로그" eyebrow="Claude API" subtitle="자연어 파싱, 무드 추론, 페어링 생성 요청을 추적합니다.">
      <section className="panel">
        <div className="table-row table-head"><span>요청</span><span>모델</span><span>상태</span></div>
        <div className="table-row"><span>PAIRING_ANALYSIS</span><span>Claude</span><Tag>SUCCESS</Tag></div>
        <div className="table-row"><span>NATURAL_LOG_PARSE</span><span>Claude</span><Tag>SUCCESS</Tag></div>
      </section>
    </PageShell>
  );
}
