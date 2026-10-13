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
            <span>페어링 점수</span>
            <strong>
              {item.score}
              <small>/ 100</small>
            </strong>
          </div>
        </div>
        {item.reason && <p className="session-reason">{item.reason}</p>}
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
