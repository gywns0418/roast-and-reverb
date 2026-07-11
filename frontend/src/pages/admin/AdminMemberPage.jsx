import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";

export default function AdminMemberPage() {
  return (
    <PageShell title="회원 관리" eyebrow="Admin" subtitle="회원 상태와 기록 활동을 확인합니다.">
      <section className="panel">
        <div className="table-row table-head"><span>닉네임</span><span>상태</span><span>최근 기록</span></div>
        <div className="table-row"><span>slow brew</span><Tag>ACTIVE</Tag><span>2026.07.09</span></div>
        <div className="table-row"><span>night cup</span><Tag>ACTIVE</Tag><span>2026.07.08</span></div>
      </section>
    </PageShell>
  );
}
