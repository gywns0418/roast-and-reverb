import PageShell from "../../components/common/PageShell.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Motif from "../../components/common/Motif.jsx";
import RecordArtwork from "../../components/common/RecordArtwork.jsx";
import { recommendations } from "../../data/sampleData.js";
import { adaptRecommendation } from "../../api/adapters.js";
import { request } from "../../api/http.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function RecommendPage() {
  const fallback = recommendations.map(adaptRecommendation);
  const { data: items } = useApiResource(
    () => request("/recommend").then((result) => result.map(adaptRecommendation)),
    fallback,
    []
  );
  const featured = items.length === 0 ? null : [...items].sort((a, b) => b.score - a.score)[0];
  const rest = items.length > 1 && featured ? items.filter((item) => item.id !== featured.id) : items;

  return (
    <PageShell title="취향의 다음 페이지" eyebrow="DISCOVER YOUR NEXT RITUAL" subtitle="익숙한 취향에서 출발해, 새로운 커피와 음악의 조합을 만나보세요.">
      {featured && (
        <div className="recommend-feature">
          <RecordArtwork kind="blend" seed={featured.title}/><div className="recommend-copy"><p className="eyebrow">IN THE SPOTLIGHT</p>
          <Motif variant="flow" />
          <div className="names">{featured.title}<span>→</span>{featured.target}</div>
          <p className="catalog smcp">Best Match · No. <span className="oldnum">{featured.score}</span></p>
          <p>{featured.reason}</p></div>
        </div>
      )}
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Recommend</span>
          <span className="vol oldnum">{items.length} pairs</span>
        </div>
        <div className="xref-list">
          {items.length === 0
            ? <EmptyState icon="flow">아직 추천할 만한 조합이 없어요. 기록이 며칠만 더 쌓이면 보여드릴게요.</EmptyState>
            : rest.map((item) => (
              <div className="xref-row" key={item.id}>
                <RecordArtwork kind="blend" seed={item.title} small />
                <span className="eyebrow">{item.title}</span>
                <div className="flow"><span className="arrow">→</span> {item.target}</div>
                <p>{item.reason}</p>
              </div>
            ))}
        </div>
      </div>
    </PageShell>
  );
}
