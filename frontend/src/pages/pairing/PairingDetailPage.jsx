import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import { pairings } from "../../data/sampleData.js";
import { pairingApi } from "../../api/pairingApi.js";
import { collectionApi } from "../../api/collectionApi.js";
import { adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

function gradeFor(score) {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Notable";
  if (score >= 70) return "Fair";
  return "Provisional";
}

export default function PairingDetailPage() {
  const { id } = useParams();
  const fallback = adaptPairing(pairings.find((pairing) => String(pairing.id) === String(id)) || pairings[0]);
  const { data: item } = useApiResource(
    () => pairingApi.detail(id).then(adaptPairing),
    fallback,
    [id]
  );
  const grade = gradeFor(item.score);
  const [archiving, setArchiving] = useState(false);
  const [archived, setArchived] = useState(false);

  async function handleArchive() {
    setArchiving(true);
    try {
      await collectionApi.create({
        title: item.music,
        artist: item.artist,
        format: "LP",
        score: item.score,
        note: `${item.coffee}와의 페어링 · ${item.date}`
      });
      setArchived(true);
    } finally {
      setArchiving(false);
    }
  }

  return (
    <PageShell title="페어링 상세" eyebrow="Field Ledger" subtitle="오늘의 커피와 음악을 한 장의 도판으로 남겼습니다.">
      <section className="pairing-result-layout">
        <div className="plate-frame">
          <div className="plate-num smcp">Plate VII</div>

          <svg className="plate-illus" viewBox="0 0 600 220" fill="none" aria-hidden="true">
            <g stroke="#2c2a1e" strokeWidth="1.3" strokeLinecap="round">
              <path d="M40 200 C70 160 60 120 95 95 C120 77 110 50 130 25" />
              <path d="M95 95 C75 80 55 82 35 70" />
              <path d="M110 130 C90 122 70 128 52 118" />
              <path d="M120 60 C104 50 100 34 108 18" />
              <circle cx="33" cy="69" r="4.5" fill="#2c2a1e" />
              <circle cx="52" cy="118" r="5.5" fill="#2c2a1e" />
              <path d="M60 86 C66 78 78 78 84 86 C78 94 66 94 60 86 Z" />
              <path d="M78 132 C84 124 96 124 102 132 C96 140 84 140 78 132 Z" />
            </g>
            <g stroke="#2c2a1e" strokeWidth="1.1" fill="none">
              <path d="M130 25 C 200 45, 230 5, 300 30 S 400 55, 470 20" />
              <path d="M130 46 C 200 66, 235 30, 300 52 S 400 78, 480 46" opacity="0.75" />
              <path d="M132 68 C 205 86, 240 56, 305 76 S 405 100, 490 72" opacity="0.5" />
            </g>
            <g fill="#2c2a1e" opacity="0.55">
              <circle cx="150" cy="185" r="0.8" /><circle cx="160" cy="178" r="0.8" /><circle cx="168" cy="190" r="0.8" />
              <circle cx="145" cy="172" r="0.8" /><circle cx="178" cy="180" r="0.8" /><circle cx="158" cy="196" r="0.8" />
            </g>
          </svg>

          <p className="plate-caption">
            <b>Plate VII.</b> — <i>{item.coffee}</i>, in accompaniment with {item.artist}, <i>{item.music}</i>.
          </p>

          <div className="side-columns">
            <div>
              <span className="side-label side-a smcp">Coffee</span>
              <h2>{item.coffee}</h2>
              <p>핸드드립 · 밝은 산미 · Ethiopia</p>
            </div>
            <div>
              <span className="side-label side-b smcp">Music</span>
              <h2>{item.music}</h2>
              <p>{item.artist} · {item.mood}</p>
            </div>
          </div>

          <p className="liner-note">{item.text}</p>

          <div className="determination">
            <div className="det-label orig">
              <b>{item.coffee}</b>
              Coll. <span className="oldnum">{item.date}</span> · {item.brew || "handdrip"}
            </div>
            <div className="det-label redet">
              <span className="tag smcp">Redet. — AI Pairing Lab</span>
              <span className="grade">Compatibility: <b>{grade}</b> · <span className="oldnum">{item.score}</span></span>
            </div>
          </div>

          <div className="pairing-actions">
            <Link to="/pairing/write" className="ghost-button">◂ 다시 기록</Link>
            <button
              type="button"
              className="primary-button"
              onClick={handleArchive}
              disabled={archiving || archived}
            >
              {archived ? "표본철에 보관됨" : archiving ? "보관 중" : "표본철에 보관 ▸"}
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
