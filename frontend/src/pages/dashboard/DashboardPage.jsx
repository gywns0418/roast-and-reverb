import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { Link } from "react-router-dom";
import { Coffee, Headphones, ArrowUpRight, Sparkles } from "lucide-react";
import PageShell from "../../components/common/PageShell.jsx";
import RecordArtwork from "../../components/common/RecordArtwork.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { adaptCoffeeLog, adaptMusicLog, adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function DashboardPage() {
  const { data: coffees } = useApiResource(() => listDiaryRecords(coffeeApi.list).then(items => items.map(adaptCoffeeLog)), [], []);
  const { data: music } = useApiResource(() => listDiaryRecords(musicApi.list).then(items => items.map(adaptMusicLog)), [], []);
  const { data: pairs } = useApiResource(() => listDiaryRecords(pairingApi.list).then(items => items.map(adaptPairing)), [], []);
  const recent = [...coffees.map(item => ({ ...item, kind: "coffee", title: item.bean, detail: [item.brew, item.roastery].filter(Boolean).join(" · "), path: `/coffee/${item.id}` })), ...music.map(item => ({ ...item, kind: "music", title: item.track, detail: item.artist, path: `/music/${item.id}` }))].sort((a,b) => b.date.localeCompare(a.date)).slice(0,6);
  const last = [...pairs].sort((a,b) => b.date.localeCompare(a.date))[0];
  const latestCoffee = [...coffees].sort((a,b) => b.date.localeCompare(a.date))[0];
  const latestMusic = [...music].sort((a,b) => b.date.localeCompare(a.date))[0];
  const days = new Set([...coffees, ...music].map(item => item.date).filter(Boolean)).size;
  return <PageShell title="오늘도, 나의 리듬으로." eyebrow="YOUR DAILY RITUAL" subtitle="커피의 향과 음악의 여운, 그 사이에 쌓이는 나의 취향.">
    <div className="dashboard-hero">
      <div className="session-copy"><p className="eyebrow">BREW & LISTEN / DAILY SESSION</p><h2>한 잔을 내리고,<br/>한 곡에 머무르는 시간.</h2><p>오늘의 작은 감각을 기록해두세요.<br/>좋아하는 순간들이 나만의 리듬이 됩니다.</p><div className="action-row"><Link to="/coffee/write" className="primary-button">오늘의 한 잔 기록 <ArrowUpRight size={17}/></Link><Link to="/music/write" className="session-secondary">음악 더하기 ↗</Link></div></div>
      <RecordArtwork kind="blend" seed="daily" />
    </div>
    <div className="metric-strip">{[["커피 기록", coffees.length, "cups", Coffee],["음악 기록", music.length, "tracks", Headphones],["연결한 페어링", pairs.length, "pairs", Sparkles],["기록한 날", days, "days", ArrowUpRight]].map(([label, value, unit, Icon]) => <div className="metric" key={label}><span><Icon size={16}/>{label}</span><strong>{value}<small>{unit}</small></strong></div>)}</div>
    <div className="dashboard-body"><section className="journal-panel"><div className="section-heading"><div><p className="eyebrow">THE JOURNAL</p><h2>최근의 순간들</h2></div><Link to="/coffee">모든 커피 기록 ↗</Link></div>{recent.length ? recent.map(item => <Link key={`${item.kind}-${item.id}`} to={item.path} className="journal-entry"><div className={`entry-icon ${item.kind}`}>{item.kind === "coffee" ? <Coffee size={22}/> : <Headphones size={22}/>}</div><div><span className="entry-date">{item.date} / {item.kind === "coffee" ? "COFFEE" : "MUSIC"}</span><h3>{item.title}</h3><p>{item.detail || "나의 취향 기록"}</p></div><ArrowUpRight size={18}/></Link>) : <EmptyState>아직 첫 기록이 없어요. 오늘 마신 커피부터 남겨보세요.</EmptyState>}<Link className="journal-add" to="/coffee/write">+ 새로운 순간 기록하기</Link></section>
      <aside className="dashboard-aside"><section className="latest-session"><p className="eyebrow">LAST PAIRING</p><h2>함께 남은 여운</h2>{last ? <><RecordArtwork kind="blend" seed={last.artist}/><h3>{last.coffee}</h3><p>{last.artist} — {last.music}</p><blockquote>{last.text || last.mood}</blockquote><Link to={`/pairing/${last.id}`}>페어링 자세히 보기 ↗</Link></> : <><RecordArtwork kind="blend"/><p>한 잔과 한 곡을 골라 첫 조합을 연결해보세요.</p><Link to="/pairing/write">첫 페어링 만들기 ↗</Link></>}</section></aside>
    </div>
    <div className="two-sides">{[["SIDE A / LAST BREW", latestCoffee?.bean || "나의 다음 한 잔", latestCoffee?.memo || "원두, 추출 조건, 식은 뒤의 맛까지 남겨보세요.", "coffee", latestCoffee ? `/coffee/${latestCoffee.id}` : "/coffee/write"],["SIDE B / LAST LISTEN", latestMusic?.track || "나의 다음 한 곡", latestMusic ? [latestMusic.artist, latestMusic.memo].filter(Boolean).join(" · ") : "오늘의 기분에 머무른 곡을 기록해보세요.", "music", latestMusic ? `/music/${latestMusic.id}` : "/music/write"]].map(([label,title,note,kind,path]) => <Link className={`side-feature ${kind}`} to={path} key={kind}><RecordArtwork kind={kind} seed={title} small/><div><p className="eyebrow">{label}</p><h3>{title}</h3><p>{note}</p><span>기록 열기 ↗</span></div></Link>)}</div>
  </PageShell>;
}

