import PageShell from "../../components/common/PageShell.jsx";

export default function JoinPage() {
  return (
    <PageShell title="회원가입" eyebrow="Roast & Reverb" subtitle="취향 데이터를 쌓을 개인 계정을 만듭니다.">
      <div className="panel-grid">
        <section className="panel">
          <h3>핵심 작업</h3>
          <p>이 화면은 API 연동 전에도 흐름을 확인할 수 있도록 샘플 데이터 기반으로 구성했습니다.</p>
        </section>
        <section className="panel">
          <h3>다음 구현</h3>
          <p>백엔드 엔드포인트와 연결한 뒤 등록, 수정, 삭제, 상세 조회 로직을 채우면 됩니다.</p>
        </section>
      </div>
    </PageShell>
  );
}
