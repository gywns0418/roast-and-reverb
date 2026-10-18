import {useEffect,useId,useState} from 'react';
import {Link} from 'react-router-dom';
import {readSoundtrack} from '../../utils/coffeeSoundtrack.js';
const palettes=['#607354','#b86f47','#6e7b83','#8b735e','#7c718d','#8b874f'];
const name=row=>!row.bean||row.bean==='원두 미기록'?'오늘의 한 잔':row.bean;
function CupDrawing(){return <svg viewBox="0 0 100 70" fill="none" aria-hidden="true"><path d="M24 24h45v18c0 25-45 25-45 0V24Z" stroke="currentColor" strokeWidth="2"/><path d="M69 28c25-6 23 25 0 19M15 63h65M35 16c-7-8 7-8 0-15M49 16c-7-8 7-8 0-15M62 16c-7-8 7-8 0-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
function Keepsake({row,index,view,mini=false,example=false}){return <div className={`keepsake keepsake-${view}${mini?' keepsake-mini':''}`} style={{'--keepsake-color':palettes[index%palettes.length]}} aria-hidden="true"><span className="keepsake-seal"/><div className="keepsake-label"><small>{example?'EXAMPLE · 체험 예시':row.date||'날짜 미기록'}</small><CupDrawing/><strong>{name(row)}</strong><span>{row.roastery||'나의 한 잔 기록'}</span><i>ROAST & REVERB</i></div><span className="keepsake-base"/></div>}
export default function TastingShelf({records=[],example=false}){
 const [view,setView]=useState('bags'),[selected,setSelected]=useState(null),[limit,setLimit]=useState(12);const detailId=useId();
 const index=Math.max(0,records.findIndex(row=>String(row.id)===selected)),row=records[index];
 useEffect(()=>{setSelected(null);setLimit(12);},[example]);
 const song=row&&readSoundtrack(row.brewDetails?.soundtrack);
 return <section className={`tasting-shelf keepsake-shelf tasting-shelf-${view}`} aria-label={example?'테이스팅 카드 예시':'나의 테이스팅 카드 진열장'}>
 <header><div><p className="eyebrow">{example?'TRY YOUR FIRST SHELF':'YOUR COFFEE SHELF'}</p><h2>{example?'이렇게, 내 취향이 쌓여요.':'나의 커피 진열장'}</h2><p>{example?'예시 봉투를 눌러 펼쳐보세요. 내 기록에 저장되지 않아요.':`${records.length}장의 기록 · 봉투나 카드를 눌러 그날의 한 잔을 꺼내보세요.`}</p></div><div className="tasting-view" role="group" aria-label="진열 방식"><button type="button" aria-pressed={view==='bags'} onClick={()=>setView('bags')}>원두 봉투</button><button type="button" aria-pressed={view==='cards'} onClick={()=>setView('cards')}>노트 카드</button></div></header>
 {row?<><div className="keepsake-stage" id={detailId} key={`${view}-${row.id}`}><div className="keepsake-display"><span className="keepsake-shadow"/><Keepsake row={row} index={index} view={view} example={example}/></div><div className="keepsake-story" role="region" aria-label="펼친 테이스팅 노트"><small>{example?'체험 예시':row.date||'날짜 미기록'} · {index+1} / {records.length}</small><h3>{name(row)}</h3><p>{row.brewDetails?.momentNote||row.memo||'이날의 감상은 아직 남기지 않았어요.'}</p><dl>{row.roastery&&<><dt>로스터리</dt><dd>{row.roastery}</dd></>}{row.brew&&<><dt>내린 방법</dt><dd>{row.brew}</dd></>}</dl>{song&&<p className="keepsake-song">♫ {song.artist} · {song.track}</p>}{!example&&<Link to={`/coffee/${row.id}`}>이날의 기록 자세히 보기 ↗</Link>}{example&&<span className="keepsake-example">직접 남긴 한 줄도 이런 한 장이 돼요.</span>}</div></div>
 <div className="keepsake-rack" role="group" aria-label="펼쳐볼 커피 기록">{records.slice(0,limit).map((item,i)=><button type="button" key={item.id} aria-pressed={i===index} aria-controls={detailId} aria-label={`${i+1}번째 ${name(item)} 펼치기`} onClick={()=>setSelected(String(item.id))} style={{'--card-order':i%6}}><Keepsake row={item} index={i} view={view} mini example={example}/><span>{name(item)}</span></button>)}</div><p className="keepsake-hint">{view==='bags'?'봉투를 고르면 그날의 노트가 펼쳐져요.':'카드를 고르면 그날의 문장을 다시 만나요.'} 좌우로 넘겨 골라보세요.</p>
 {records.length>limit&&<button type="button" className="ghost-button" onClick={()=>setLimit(n=>n+12)}>다음 12장 꺼내기 · {limit} / {records.length}</button>}</>:<div className="tasting-empty"><p>첫 한 줄을 남기면<br/>나만의 진열장이 시작돼요.</p></div>}
 </section>;
}
