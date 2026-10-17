import {soundtrackRecords} from '../../utils/coffeeSoundtrack.js';
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import RecordArtwork from "../../components/common/RecordArtwork.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { adaptCoffeeLog, adaptMusicLog, adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

function Ranking({ title, eyebrow, items, field, kind }) {
  const counts = new Map();
  items.forEach(item => { if(item[field]) counts.set(item[field], (counts.get(item[field]) || 0) + 1); });
  const ranked = [...counts].sort((a,b) => b[1]-a[1]).slice(0,5);
  const max = Math.max(1,...ranked.map(item => item[1]));
  return <section className="panel ranking-panel"><p className="eyebrow">{eyebrow}</p><h3>{title}</h3>{ranked.length ? ranked.map(([name,count],index) => <div className={`rank-row ${kind}`} key={name}><span className="rank-index">{String(index+1).padStart(2,"0")}</span><div><div className="rank-label"><strong>{name}</strong><span>{count}회</span></div><div className="rank-track"><i style={{width:`${count/max*100}%`}}/></div></div></div>) : <div className="report-no-data"><p>이번 달의 기록이 아직 없어요.</p><Link to={`/${kind}/write`}>첫 기록 남기기 ↗</Link></div>}</section>;
}
export default function MonthlyReportPage() {
  const now = new Date();
  const [month,setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`);
  const moveMonth = offset => { const [y,m] = month.split("-").map(Number); const date = new Date(y,m-1+offset,1); setMonth(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`); };
  const {data:coffees} = useApiResource(() => listDiaryRecords(coffeeApi.list).then(items => items.map(adaptCoffeeLog)), [], []);
  const {data:music} = useApiResource(() => listDiaryRecords(musicApi.list).then(items => items.map(adaptMusicLog)), [], []);
  const {data:pairs} = useApiResource(() => listDiaryRecords(pairingApi.list).then(items => items.map(adaptPairing)), [], []);
  const inMonth = items => items.filter(item => item.date.replaceAll(".","-").startsWith(month));
  const cups = inMonth(coffees), tracks = inMonth([...music,...soundtrackRecords(coffees).filter(row=>row.listened)]), connections = inMonth(pairs);
  const dates = new Set([...cups,...tracks].map(item => item.date));
  const [year,mo] = month.split("-").map(Number);
  const dayCount = new Date(year,mo,0).getDate();
  const counts = Array.from({length:dayCount},(_,index) => ({day:index+1,coffee:cups.filter(item => Number(item.date.slice(8,10)) === index+1).length,music:tracks.filter(item => Number(item.date.slice(8,10)) === index+1).length}));
  const max = Math.max(1,...counts.map(item => item.coffee+item.music));
  return <PageShell title="기록이 들려주는 나의 취향" eyebrow="YOUR MONTH IN NOTES" subtitle="마신 커피와 들은 음악을 모아, 한 달의 리듬을 돌아봅니다.">
    <div className="report-month"><div className="month-controls"><button type="button" className="ghost-button" aria-label="이전 달" onClick={() => moveMonth(-1)}>←</button><label>돌아볼 달 <input type="month" aria-label="리포트 월" value={month} onChange={event => { if(event.target.value) setMonth(event.target.value); }}/></label><button type="button" className="ghost-button" aria-label="다음 달" onClick={() => moveMonth(1)}>→</button></div><span>커피와 직접 들었다고 남긴 음악 기준</span></div>
    <div className="report-hero"><div><p className="eyebrow">{month.replace("-"," / ")} · MONTHLY JOURNAL</p><h2>나를 닮은 순간이<br/><em>{dates.size}일</em> 쌓였어요.</h2><p>기록이 남은 날을 기준으로 정리했어요.<br/>작은 감각이 모여 다음 취향의 힌트가 됩니다.</p></div><RecordArtwork kind="blend" seed={month}/></div>
    <div className="metric-strip">{[["마신 커피",cups.length,"cups"],["들은 음악",tracks.length,"tracks"],["음악과 함께한 커피",cups.filter(cup=>cup.brewDetails?.soundtrack?.listened===true).length,"cups"],["기록한 날",dates.size,"days"]].map(([label,count,unit]) => <div className="metric" key={label}><span>{label}</span><strong>{count}<small>{unit}</small></strong></div>)}</div>
    <section className="panel activity-panel"><div className="section-heading"><div><p className="eyebrow">DAILY RHYTHM</p><h2>이번 달의 기록 리듬</h2></div><div className="chart-legend"><span>● 커피</span><span>● 음악</span></div></div><div className="activity-chart" role="img" aria-label={`${month} 일별 커피와 음악 기록: ${counts.map(item => `${item.day}일 커피 ${item.coffee}개 음악 ${item.music}개`).join(', ')}`}>{counts.map(item => <div className="activity-day" key={item.day} title={`${item.day}일 · 커피 ${item.coffee} / 음악 ${item.music}`}><div className="activity-bars"><i className="coffee-bar" style={{height:`${item.coffee/max*100}%`}}/><i className="music-bar" style={{height:`${item.music/max*100}%`}}/></div><span>{item.day === 1 || item.day % 5 === 0 || item.day === dayCount ? item.day : ""}</span></div>)}</div>{!dates.size && <p className="chart-empty">아직 이번 달 기록이 없어요. 기록을 남기면 이곳에 리듬이 쌓입니다.</p>}</section>
    <div className="panel-grid report-rankings"><Ranking title="자주 마신 원두" eyebrow="SIDE A / COFFEE" items={cups} field="bean" kind="coffee"/><Ranking title="자주 들은 아티스트" eyebrow="SIDE B / MUSIC" items={tracks} field="artist" kind="music"/></div>
  </PageShell>;
}

