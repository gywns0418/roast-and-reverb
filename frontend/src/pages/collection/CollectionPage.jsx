import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Motif from "../../components/common/Motif.jsx";
import RecordArtwork from "../../components/common/RecordArtwork.jsx";
import { collections } from "../../data/sampleData.js";
import { adaptCollection } from "../../api/adapters.js";
import { request, toQuery } from "../../api/http.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function CollectionPage() {
  const [format, setFormat] = useState("ALL");
  const fallback = collections.map(adaptCollection);
  const { data: items } = useApiResource(
    () => request(`/collection${toQuery({ format })}`).then((result) => result.map(adaptCollection)),
    fallback,
    [format]
  );
  const filteredItems = useMemo(() => (
    format === "ALL" ? items : items.filter((item) => item.format === format)
  ), [format, items]);
  const featured = useMemo(() => (
    items.length === 0 ? null : [...items].sort((a, b) => b.score - a.score)[0]
  ), [items]);

  return (
    <PageShell title="컬렉션" eyebrow="Collection" subtitle="LP/CD 소장품과 페어링 기록을 함께 관리합니다.">
      <div className="filter-row">
        <button className={format === "ALL" ? "primary-button" : "ghost-button"} onClick={() => setFormat("ALL")}>전체</button>
        <button className={format === "LP" ? "primary-button" : "ghost-button"} onClick={() => setFormat("LP")}>LP</button>
        <button className={format === "CD" ? "primary-button" : "ghost-button"} onClick={() => setFormat("CD")}>CD</button>
      </div>
      {featured && (
        <div className="specimen-card">
          <Motif variant="wave" />
          <div className="names">{featured.title}<span>·</span>{featured.artist}</div>
          <p className="catalog smcp">Featured · No. <span className="oldnum">{featured.score}</span> · {featured.format}</p>
        </div>
      )}
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Collection</span>
          <span className="vol oldnum">
            {filteredItems.length} items · <Link to="/collection/write" style={{ borderBottom: "1px solid currentColor" }}>+ 추가</Link>
          </span>
        </div>
        {filteredItems.length === 0
          ? <EmptyState icon="wave">{items.length === 0 ? "아직 채워지지 않은 컬렉션이에요." : `${format} 소장품이 아직 없어요.`}</EmptyState>
          : <div className="collection-shelf">{filteredItems.map((item) => (
            <article className="collection-album" key={item.id}><RecordArtwork seed={item.artist + item.title} label={item.title}/><div className="card-head"><span className="format-chip">{item.format}</span><span>MY COLLECTION</span></div><h3>{item.title}</h3><p>{item.artist}</p>{item.note && <p className="album-note">{item.note}</p>}</article>
          ))}<Link to="/collection/write" className="library-add"><span>+</span><h3>다음 소장 음반</h3><p>좋아하는 한 장을 선반에 더해요.</p><b>음반 추가 ↗</b></Link></div>}
      </div>
    </PageShell>
  );
}
