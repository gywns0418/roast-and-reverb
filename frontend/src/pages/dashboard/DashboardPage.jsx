import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import { coffeeLogs, monthlyReport, musicLogs, pairings } from "../../data/sampleData.js";

const FRESH_THRESHOLD = "07.09";

const recentNotes = [
  ...coffeeLogs.map((item) => ({
    id: `coffee-${item.id}`,
    type: "coffee",
    date: item.date.slice(5),
    title: item.bean,
    meta: `${item.brew} · ${item.memo}`
  })),
  ...musicLogs.map((item) => ({
    id: `music-${item.id}`,
    type: "music",
    date: item.date.slice(5),
    title: `${item.artist} — ${item.track}`,
    meta: `${item.genre} · ${item.memo}`
  }))
].sort((a, b) => b.date.localeCompare(a.date));

const moodTags = [
  ["밝은 산미", "warm"],
  ["몽환적", "cool"],
  ["집중", "neutral"],
  ["플로럴", "warm"]
];

export default function DashboardPage() {
  return (
    <PageShell title="Roast & Reverb" eyebrow="Field Ledger" subtitle="오늘 마신 커피와 들은 음악을 조용히 적어둡니다.">
      <div className="dashboard-layout">
        <div className="ledger">
          <div className="ledger-head">
            <span className="book smcp">Roast &amp; Reverb</span>
            <span className="vol oldnum">Vol. II · 2026</span>
          </div>

          <Link to={`/pairing/${pairings[0].id}`} className="specimen-card" style={{ display: "block" }}>
            <svg className="motif" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M24 44 C24 30 20 20 10 10" />
              <path d="M24 34 C24 26 27 20 34 15" />
              <path d="M14 16 C14 12 17 9 22 8" />
            </svg>
            <div className="names">{pairings[0].coffee} <span>&</span> {pairings[0].artist}</div>
            <p className="catalog smcp">Specimen No. {pairings[0].score} · Recorded {pairings[0].date}</p>
          </Link>

          <div className="ledger-line fresh">
            <time className="oldnum">07.10.</time>
            <span className="entry">
              오늘의 기록을 기다리고 있어요. <Link to="/coffee/write" style={{ borderBottom: "1px solid currentColor" }}>오늘의 로그 쓰기 →</Link>
            </span>
            <span className="no" />
          </div>

          {recentNotes.map((item, i) => (
            <div className={`ledger-line ${item.date >= FRESH_THRESHOLD ? "fresh" : "aged"}`} key={item.id}>
              <time className="oldnum">{item.date}.</time>
              <span className="entry">
                <span className={`type-dot ${item.type}`} />
                <strong>{item.title}</strong> — {item.meta}
              </span>
              <span className="no oldnum">no. {String(95 - i).padStart(3, "0")}</span>
            </div>
          ))}

          <p className="ledger-foot">이번 달 — {monthlyReport.summary}</p>
        </div>

        <aside className="margin-panel">
          <div>
            <h4>This Month</h4>
            {monthlyReport.stats.map((stat) => (
              <div className="margin-stat" key={stat.label}>
                <span>{stat.label}</span>
                <strong className="oldnum">{stat.value}</strong>
              </div>
            ))}
          </div>
          <div>
            <h4>Recurring Moods</h4>
            <div className="margin-tags">
              {moodTags.map(([tag, variant]) => <Tag key={tag} variant={variant}>{tag}</Tag>)}
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
