import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";

export default function MyPage() {
  return (
    <PageShell title="마이페이지" eyebrow="Profile" subtitle="나의 기록 수와 자주 등장한 취향 키워드를 확인합니다.">
      <section className="panel profile-panel">
        <div className="profile-avatar">RR</div>
        <div>
          <h3>slow brew</h3>
          <p>brewer@example.com</p>
          <div className="tag-row">
            <Tag variant="warm">밝은 산미</Tag>
            <Tag variant="cool">포스트록</Tag>
            <Tag variant="cool">몽환적</Tag>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
