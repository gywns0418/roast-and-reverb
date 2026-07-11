import PageShell from "../../components/common/PageShell.jsx";
import { pairings } from "../../data/sampleData.js";

function gradeFor(score) {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Notable";
  if (score >= 70) return "Fair";
  return "Provisional";
}

export default function PairingDetailPage() {
  const item = pairings[0];
  const grade = gradeFor(item.score);

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
              Coll. {item.date} · handdrip
            </div>
            <div className="det-label redet">
              <span className="tag smcp">Redet. — AI Pairing Lab</span>
              <span className="grade">Compatibility: <b>{grade}</b> · {item.score}</span>
            </div>
          </div>

          <div className="pairing-actions">
            <button className="ghost-button">◂ 다시 기록</button>
            <button className="primary-button">표본철에 보관 ▸</button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
