import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import RecordArtwork from "./RecordArtwork.jsx";
import EmptyState from "./EmptyState.jsx";

export default function RecordLibrary({ items, kind }) {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("newest");
  const coffee = kind === "coffee";
  const visible = useMemo(() => items.filter(item => [item.bean, item.roastery, item.origin, item.brew, item.track, item.artist, item.album, item.genre, item.memo].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase())).sort((a,b) => order === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)), [items, query, order]);
  const diversity = new Set(items.map(item => coffee ? item.bean : item.artist).filter(Boolean)).size;
  return <>
    <div className={`library-banner ${kind}`}><div><p className="eyebrow">{coffee ? "THE BREW ARCHIVE" : "THE LISTENING ROOM"}</p><h2>{coffee ? "내가 마신 한 잔의 기록." : "내가 머문 한 곡의 기록."}</h2><p>{coffee ? "향, 질감, 추출의 작은 변화까지." : "좋아하는 곡은 다시 듣고, 그 순간은 오래 남기고."}</p></div><div className="library-counter"><strong>{items.length}</strong><span>{coffee ? "CUPS RECORDED" : "TRACKS RECORDED"}</span></div><div className="library-counter"><strong>{diversity}</strong><span>{coffee ? "DIFFERENT BEANS" : "ARTISTS"}</span></div></div>
    <div className="library-toolbar"><label className="library-search"><Search size={18}/><input aria-label={coffee ? "커피 기록 필터" : "음악 기록 필터"} placeholder={coffee ? "원두, 로스터리, 추출 방식 검색" : "곡, 아티스트, 앨범 검색"} value={query} onChange={event => setQuery(event.target.value)}/></label><span>{visible.length}개의 기록</span><select aria-label="기록 정렬" value={order} onChange={event => setOrder(event.target.value)}><option value="newest">최신순</option><option value="oldest">오래된순</option></select></div>
    <div className={`record-library ${kind}`}>
      {visible.map(item => <Link className="library-card" to={`/${kind}/${item.id}`} key={item.id}><RecordArtwork kind={kind} seed={coffee ? item.bean : item.artist} label={coffee ? item.bean : item.album || item.track}/><div className="library-card-content"><div className="card-head"><span>{item.date || "날짜 미기록"}</span><ArrowUpRight size={17}/></div><h3>{coffee ? item.bean : item.track}</h3><p>{coffee ? [item.roastery, item.origin].filter(Boolean).join(" · ") : item.artist}</p><div className="library-chips">{(coffee ? [item.brew, item.process, item.waterTemp != null ? `${item.waterTemp}℃` : ""] : [item.genre, ...item.tags]).filter(Boolean).slice(0,3).map((tag,index) => <span key={`${tag}-${index}`}>{tag}</span>)}</div><p className="library-note">{item.memo || (coffee ? "다음 한 잔에 기억해둘 기록" : item.album || "나의 음악 기록")}</p></div></Link>)}
      {!query && <Link className="library-add" to={`/${kind}/write`}><span>+</span><h3>{coffee ? "새로운 한 잔" : "새로운 한 곡"}</h3><p>{coffee ? "오늘의 커피를 이곳에 남겨요." : "오늘의 플레이리스트에 더해요."}</p><b>기록 작성 ↗</b></Link>}
    </div>
    {query && visible.length === 0 && <EmptyState>검색한 기록이 없어요. 다른 단어로 찾아보세요.</EmptyState>}
  </>;
}
