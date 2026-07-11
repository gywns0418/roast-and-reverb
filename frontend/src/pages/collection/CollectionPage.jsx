import PageShell from "../../components/common/PageShell.jsx";
import { collections } from "../../data/sampleData.js";

export default function CollectionPage() {
  return (
    <PageShell title="컬렉션" eyebrow="Collection" subtitle="LP/CD 소장품과 페어링 기록을 함께 관리합니다.">
      <div className="filter-row">
        <button className="ghost-button">전체</button>
        <button className="ghost-button">LP</button>
        <button className="ghost-button">CD</button>
      </div>
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Collection</span>
          <span className="vol oldnum">{collections.length} items</span>
        </div>
        {collections.map((item, i) => (
          <div className="ledger-line fresh" key={item.id}>
            <span className="format-chip smcp">{item.format}</span>
            <span className="entry">
              <span className="type-dot music" />
              <strong>{item.title}</strong> — {item.artist} · {item.note}
            </span>
            <span className="no oldnum">no. {item.score || 0}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
