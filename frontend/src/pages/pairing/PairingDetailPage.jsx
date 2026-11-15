import { decodePairingEvidence, saveFeedback, readPreferences, axes as pairAxes } from "../../utils/pairingEngine.js";
import ResonanceChart from "../../components/visual/ResonanceChart.jsx";
import ResonanceAura from "../../components/visual/ResonanceAura.jsx";
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
  const unit = (v) => (typeof v === "number" && v >= 0 && v <= 1 ? v : null);
  const vectors = evidence?.vectors && Array.isArray(evidence.vectors.coffee) && Array.isArray(evidence.vectors.music) && evidence.vectors.coffee.length === 4 && evidence.vectors.music.length === 4
    ? { coffee: evidence.vectors.coffee.map(unit), music: evidence.vectors.music.map(unit) }
    : null;
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
        {evidence && (
          <section className="pairing-resonance" aria-labelledby="pairing-resonance-title">
            <div className="pairing-resonance-head">
              <ResonanceAura
                className="pairing-aura"
                colors={["#B23E22", "#3446C9"].slice(0, 2)}
                energy={Math.round((vectors?.coffee[0] ?? evidence.features[0] ?? 0.5) * 10)}
                depth={Math.round((vectors?.coffee[1] ?? evidence.features[1] ?? 0.5) * 10)}
                rings={3 + evidence.coverage}
                seedKey={String(item.id)}
                label="이 페어링의 단서 값으로 만든 오라"
              />
              <div>
                <p className="taste-map-kicker">Resonance</p>
                <h3 id="pairing-resonance-title">같은 좌표에 놓인 두 감각</h3>
                <p>{vectors ? "커피와 음악에서 찾은 단서를 같은 네 축에 놓았어요." : "이 조합은 축별로 얼마나 닮았는지만 저장돼 있어요. 새로 만드는 조합부터 커피와 음악을 따로 겹쳐 보여 드려요."}</p>
              </div>
            </div>
            <ResonanceChart
              axes={pairAxes}
              caption="페어링 공명 차트"
              series={vectors
                ? [
                    { label: "커피", values: vectors.coffee, color: "var(--rs-coffee)", fill: "color-mix(in srgb, var(--rs-coffee) 20%, transparent)" },
                    { label: "음악", values: vectors.music, color: "var(--rs-sound)", dashed: true },
                  ]
                : [{ label: "닮은 정도", values: evidence.features.map(unit), color: "var(--rs-coffee)", fill: "color-mix(in srgb, var(--rs-coffee) 20%, transparent)" }]}
            />
          </section>
        )}
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
