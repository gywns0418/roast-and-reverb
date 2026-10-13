import { decodePairingEvidence, saveFeedback, readPreferences } from "../../utils/pairingEngine.js";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Coffee, Headphones, ArrowUpRight, Bookmark } from "lucide-react";
import PageShell from "../../components/common/PageShell.jsx";
import { pairings } from "../../data/sampleData.js";
import { pairingApi } from "../../api/pairingApi.js";
import { collectionApi } from "../../api/collectionApi.js";
import { adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";
export default function PairingDetailPage() {
  const { id } = useParams();
  const fallback = adaptPairing(
    pairings.find((p) => String(p.id) === id) || pairings[0],
  );
  const { data: item } = useApiResource(
    () => pairingApi.detail(id).then(adaptPairing),
    fallback,
    [id],
  );
  const evidence = decodePairingEvidence(item.reason);
  const [feedback, setFeedback] = useState("");
  function rate(label) { try { const model=saveFeedback(item.id,evidence.features,label); setFeedback(`피드백을 반영했어요. 이 기기 학습 ${model.samples}건`); } catch(error) { setFeedback(error.message); } }
  const [archiving, setArchiving] = useState(false);
  const [archived, setArchived] = useState(false);
  const [error, setError] = useState("");
  async function archive() {
    setArchiving(true);
    setError("");
    try {
      await collectionApi.create({
        title: item.music,
        artist: item.artist,
        artistName: item.artist,
        format: "LP",
        score: item.score,
        pairingScore: item.score,
        note: `${item.coffee}와의 페어링 · ${item.date}`,
      });
      setArchived(true);
    } catch (e) {
      setError(e.message || "보관에 실패했습니다.");
    } finally {
      setArchiving(false);
    }
  }
  return (
    <PageShell
      title="두 취향이 만나는 순간"
      eyebrow="Your pairing"
      subtitle="한 잔과 한 곡, 오늘의 조합을 오래 기억하세요."
    >
      <section className="session-result">
        <header>
          <span>SESSION / {String(item.id).padStart(3, "0")}</span>
          <time>{item.date}</time>
        </header>
        <div className="session-pair">
          <article>
            <Coffee size={28} />
            <p>THE COFFEE</p>
            <h2>{item.coffee}</h2>
            {item.brew && <span>{item.brew}</span>}
          </article>
          <span className="session-join">&</span>
          <article>
            <Headphones size={28} />
            <p>THE MUSIC</p>
            <h2>{item.music}</h2>
            <span>{item.artist}</span>
          </article>
        </div>
        <div className="session-insight">
          <div>
            <p>PAIRING INSIGHT</p>
            <h3>{item.mood}</h3>
            <p>{item.text}</p>
          </div>
          <div className="session-score">
            <span>{evidence?.scoreKind || "페어링 점수"}</span>
            <strong>
              {item.score}
              <small>/ 100</small>
            </strong>
          </div>
        </div>
        {evidence ? <section className="pairing-evidence"><p className="eyebrow">R&R LOCAL / EXPLAINABLE PAIRING</p><h3>이 조합을 연결한 단서</h3><div className="evidence-columns"><div><strong>커피에서</strong><p>{evidence.coffee.join(" · ")}</p></div><div><strong>음악에서</strong><p>{evidence.music.join(" · ")}</p></div></div><div className="evidence-axes">{evidence.axes.map(axis => <div key={axis.label}><span>{axis.label}</span><progress max="1" value={axis.value} /><b>{Math.round(axis.value*100)}%</b></div>)}</div><p>비교 가능한 특성 {evidence.coverage}/4 · {evidence.scoreKind} · 분석 당시 피드백 {evidence.samples}건. 특성 유사도는 만족 확률이나 객관적 음악/커피 평점이 아닙니다.</p><h3>직접 느낀 조합은 어땠나요?</h3><div className="action-row"><button className="primary-button" onClick={() => rate(1)}>잘 어울려요</button><button className="ghost-button" onClick={() => rate(0)}>조금 아쉬워요</button></div><p role="status">{feedback || `이 기기 학습 ${readPreferences().samples}건 · 5건부터 개인 선호 추정 적용`}</p></section> : item.reason && <p className="session-reason">{item.reason}</p>}
        <footer>
          <Link className="ghost-button" to="/pairing/write">
            새 조합 만들기 <ArrowUpRight size={17} />
          </Link>
          <button
            className="primary-button"
            onClick={archive}
            disabled={archiving || archived}
          >
            <Bookmark size={16} />{" "}
            {archiving
              ? "보관 중"
              : archived
                ? "컬렉션에 보관됨"
                : "컬렉션에 보관"}
          </button>
        </footer>
        {error && (
          <p role="alert" className="resource-error">
            {error}
          </p>
        )}
      </section>
    </PageShell>
  );
}
