import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Motif from "../../components/common/Motif.jsx";
import { coffeeLogs, monthlyReport, musicLogs, pairings } from "../../data/sampleData.js";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { reportApi } from "../../api/reportApi.js";
import { adaptCoffeeLog, adaptMonthlyReport, adaptMusicLog, adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

const FRESH_THRESHOLD = "07.09";

function buildRecentNotes(coffees, music) {
  return [
    ...coffees.map((item) => ({
    id: `coffee-${item.id}`,
    type: "coffee",
    date: item.date.slice(5),
    title: item.bean,
    meta: `${item.brew} · ${item.memo}`
    })),
    ...music.map((item) => ({
    id: `music-${item.id}`,
    type: "music",
    date: item.date.slice(5),
    title: `${item.artist} — ${item.track}`,
    meta: `${item.genre} · ${item.memo}`
    }))
  ].sort((a, b) => b.date.localeCompare(a.date));
}

const moodTags = [
  ["밝은 산미", "warm"],
  ["몽환적", "cool"],
  ["집중", "neutral"],
  ["플로럴", "warm"]
];

export default function DashboardPage() {
  const fallbackCoffees = coffeeLogs.map(adaptCoffeeLog);
  const fallbackMusic = musicLogs.map(adaptMusicLog);
  const fallbackPairings = pairings.map(adaptPairing);
  const fallbackReport = adaptMonthlyReport({
    summary: {
      latestMoodSummary: monthlyReport.summary,
      coffeeDays: 18,
      pairingCount: 12,
      avgPairingScore: 88
    },
    favoriteCoffees: [{ beanName: monthlyReport.favoriteCoffee }],
    favoriteArtists: [{ artistName: monthlyReport.favoriteArtist }],
    moodStats: [{ moodTags: monthlyReport.frequentMood }]
  });

  const { data: coffees } = useApiResource(
    () => coffeeApi.list({ limit: 6 }).then((items) => items.map(adaptCoffeeLog)),
    fallbackCoffees,
    []
  );
  const { data: music } = useApiResource(
    () => musicApi.list({ limit: 6 }).then((items) => items.map(adaptMusicLog)),
    fallbackMusic,
    []
  );
  const { data: latestPairing } = useApiResource(
    () => pairingApi.latest().then(adaptPairing),
    fallbackPairings[0],
    []
  );
  const { data: report } = useApiResource(
    () => reportApi.monthly().then(adaptMonthlyReport),
    fallbackReport,
    []
  );
  const recentNotes = buildRecentNotes(coffees, music);

  return (
    <PageShell title="Roast & Reverb" eyebrow="Field Ledger" subtitle="오늘 마신 커피와 들은 음악을 조용히 적어둡니다.">
      <div className="action-row">
        <Link to="/coffee/write" className="primary-button">오늘의 로그 작성</Link>
        <Link to="/music/search" className="ghost-button">음악 검색</Link>
        <Link to="/pairing/write" className="ghost-button">페어링 생성</Link>
      </div>
      <div className="dashboard-layout">
        <div className="ledger">
          <div className="ledger-head">
            <span className="book smcp">Roast &amp; Reverb</span>
            <span className="vol oldnum">Vol. II · 2026</span>
          </div>

          {latestPairing && latestPairing.id ? (
            <Link to={`/pairing/${latestPairing.id}`} className="specimen-card" style={{ display: "block" }}>
              <Motif variant="blend" />
              <div className="names">{latestPairing.coffee} <span>&</span> {latestPairing.artist}</div>
              <p className="catalog smcp">Specimen No. <span className="oldnum">{latestPairing.score}</span> · Recorded <span className="oldnum">{latestPairing.date}</span></p>
            </Link>
          ) : (
            <div className="specimen-card">
              <p className="catalog smcp" style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}>아직 첫 페어링이 없어요 — 오늘의 로그를 남기면 여기 채워집니다.</p>
            </div>
          )}

          <div className="ledger-line fresh">
            <time className="oldnum">07.10.</time>
            <span className="entry">
              오늘의 기록을 기다리고 있어요. <Link to="/coffee/write" style={{ borderBottom: "1px solid currentColor" }}>오늘의 로그 쓰기 →</Link>
            </span>
            <span className="no" />
          </div>

          {recentNotes.length === 0
            ? <EmptyState>아직 적어둔 기록이 없어요.</EmptyState>
            : recentNotes.map((item, i) => (
              <div className={`ledger-line ${item.date >= FRESH_THRESHOLD ? "fresh" : "aged"}`} key={item.id}>
                <time className="oldnum">{item.date}.</time>
                <span className="entry">
                  <span className={`type-dot ${item.type}`} />
                  <strong>{item.title}</strong> — {item.meta}
                </span>
                <span className="no oldnum">no. {String(95 - i).padStart(3, "0")}</span>
              </div>
            ))}

          <p className="ledger-foot">이번 달 — {report.summary}</p>
        </div>

        <aside className="margin-panel">
          <div>
            <h4>This Month</h4>
            {report.stats.map((stat) => (
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
