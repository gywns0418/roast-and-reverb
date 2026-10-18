import {useEffect,useId,useRef,useState} from 'react';
import {Play,Check,Headphones,X} from 'lucide-react';
import {Link} from 'react-router-dom';
import {brewPlaylist} from '../../data/brewPlaylist.js';
import {parseMusicLink,musicSearchLink} from '../../utils/musicCandidates.js';
import {playlistLink,personalMusic} from '../../utils/brewMusic.js';
import {authStore} from '../../store/authStore.js';
import {readDevice,saveDevice} from '../../store/discoveryStore.js';
import {musicApi} from '../../api/musicApi.js';
import {adaptMusicLog} from '../../api/adapters.js';
import {listDiaryRecords} from '../../utils/diaryRecords.js';
const real=import.meta.env.VITE_USE_REAL_API==='true';
export default function BrewPlaylist(props){
 const [,refresh]=useState(0);
 useEffect(()=>{const changed=()=>refresh(x=>x+1);window.addEventListener('rr-auth-changed',changed);return()=>window.removeEventListener('rr-auth-changed',changed);},[]);
 const scope=real?(authStore.token?String(authStore.user.memberId||authStore.user.id||authStore.user.email):'guest'):'trial';
 return <BrewPlayer key={scope} {...props} scope={scope}/>;
}
function BrewPlayer({tracks,onSelect,selected,title='커피와 함께, 오늘은 한국 음악.',continuous=true,scope}){
 const defaults=tracks===undefined;
 const [active,setActive]=useState(null),[running,setRunning]=useState(false),[source,setSource]=useState('korean'),[mine,setMine]=useState([]),[query,setQuery]=useState(''),[limit,setLimit]=useState(6),[error,setError]=useState(''),[busy,setBusy]=useState(false),[input,setInput]=useState(''),[queue,setQueue]=useState(null);
 const heading=useId(),inputId=useId(),player=useRef(null);
 useEffect(()=>{
  if(!defaults||scope==='guest')return;let live=true;
  try{const saved=readDevice('youtube-playlist')[0];if(saved){const link=playlistLink(saved.url);setInput(link.url);setQueue(link);}}catch{setError('저장된 재생목록을 읽지 못했어요. 원본 자료는 유지합니다.');}
  async function load(){setBusy(true);let candidates=[];try{candidates=readDevice('music');}catch{if(live)setError('이 기기의 음악 자료 일부를 읽지 못했어요. 기존 자료는 유지됩니다.');}
   try{const rows=await listDiaryRecords(musicApi.list);if(live)setMine(personalMusic(rows.map(adaptMusicLog),candidates,brewPlaylist));}catch{if(live){setMine(personalMusic([],candidates,brewPlaylist));setError('계정의 음악 기록을 읽지 못했어요. 보관한 후보는 계속 사용할 수 있어요.');}}finally{if(live)setBusy(false);}}
  load();window.addEventListener('rr-discovery-changed',load);return()=>{live=false;window.removeEventListener('rr-discovery-changed',load);};
 },[defaults,scope]);
 useEffect(()=>{if(!running)return;const stop=()=>{if(document.hidden)setRunning(false);};document.addEventListener('visibilitychange',stop);player.current?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});let seen=false;const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)seen=true;else if(seen)setRunning(false);}});const media=player.current?.querySelector('iframe');if(media)observer.observe(media);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',stop);};},[running,active,source,queue?.id]);
 const songs=(defaults?(source==='mine'?mine:brewPlaylist):tracks||[]).map(song=>{const known=brewPlaylist.find(x=>x.id===song.id||x.track===song.track&&x.artist===song.artist);return {...known,...song,url:song.url||known?.url||''};});
 const song=songs.find(x=>x.id===active)||songs[0];
 const filtered=songs.filter(x=>[x.track,x.artist,x.channel].join(' ').toLowerCase().includes(query.toLowerCase()));
 function video(item){try{const link=parseMusicLink(item?.url);return link.kind==='video'?link.id:null;}catch{return null;}}
 const id=video(song),ids=songs.map(video).filter(Boolean),tail=continuous&&id?ids.slice(ids.indexOf(id)+1):[];
 const playlistMode=defaults&&source==='queue';
 const src=playlistMode?(queue?`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(queue.id)}&autoplay=1&playsinline=1&rel=0`:''):id?`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0${tail.length?`&playlist=${[id,...tail].join(',')}`:''}`:'';
 function changeSource(value){setSource(value);setActive(null);setRunning(false);setQuery('');setLimit(6);}
 function disconnect(){try{if(scope!=='guest')saveDevice('youtube-playlist',[]);setQueue(null);setInput('');setRunning(false);setError('');}catch(err){setError(err.message);}}
 function connect(event){event.preventDefault();setError('');try{const link=playlistLink(input);setQueue(link);setRunning(true);if(scope!=='guest')saveDevice('youtube-playlist',[{url:link.url}]);}catch(err){setError(err.message);}}
 return <section className="brew-playlist" aria-labelledby={heading}>
  <div className="brew-playlist-heading"><Headphones size={18}/><div><p>R&R BREWING PLAYLIST · 무료 재생</p><h2 id={heading}>{title}</h2></div></div>
  {defaults&&<><div className="brew-source-tabs" role="group" aria-label="음악 선택 범위">{[['korean','한국 선곡'],['mine','내 음악'],['queue','내 플레이리스트']].map(([key,label])=><button type="button" key={key} aria-pressed={source===key} onClick={()=>changeSource(key)}>{label}</button>)}</div>
   {source==='mine'&&<p className="brew-player-note">{scope==='guest'?'로그인하면 내 보관함의 음악을 여기서 골라요.':'R&R에 남긴 음악 기록과 이 기기에 보관한 후보입니다.'} YouTube Music의 청취 순위는 가져오지 않습니다.</p>}
   {source==='mine'&&busy&&<p role="status">내 음악을 꺼내는 중…</p>}
   {playlistMode&&<form className="brew-playlist-form" onSubmit={connect}><label htmlFor={inputId}>내 YouTube Music 재생목록 링크</label><input id={inputId} type="url" required maxLength={1000} value={input} onChange={e=>setInput(e.target.value)} placeholder="https://music.youtube.com/playlist?list=…"/><button type="submit" className="ghost-button">{queue?'이 플레이리스트 듣기':'플레이리스트 연결하고 듣기'}</button>{queue&&<button type="button" className="ghost-button" onClick={disconnect}>플레이리스트 연결 해제</button>}<p>공개·일부 공개 재생목록을 지원해요. 계정 청취 기록에 접근하지 않으며, {scope==='guest'?'로그인 전에는 이 화면에서만 재생합니다.':'연결한 링크는 이 기기에만 보관합니다.'}</p></form>}
  </>}
  {!playlistMode&&<>{songs.length>5&&<label className="brew-music-search">곡·아티스트 찾기<input type="search" maxLength={100} value={query} onChange={e=>{setQuery(e.target.value);setLimit(6);}}/></label>}
   {songs.length>2&&<p className="brew-player-note">{songs.length}곡 중 골라요 · 모바일에서는 좌우로 넘겨보세요.</p>}
   <div className="brew-song-tabs" style={{gridTemplateColumns:`repeat(${Math.min(2,songs.length)||1},minmax(0,1fr))`}} role="group" aria-label="들어볼 곡 선택">{filtered.slice(0,limit).map(item=><button type="button" key={item.id} aria-pressed={song?.id===item.id} onClick={()=>{setActive(item.id);setRunning(true);}}><span>{String(songs.indexOf(item)+1).padStart(2,'0')}</span><span><b title={item.track}>{item.track}</b><small>{item.artist||item.channel}</small></span></button>)}</div>
   {!filtered.length&&<p>{query?'검색한 곡이 없어요.':'아직 보관한 음악이 없어요.'} <Link to="/recommend">음악 후보 더하기 ↗</Link></p>}
   {filtered.length>limit&&<button className="ghost-button" type="button" onClick={()=>setLimit(x=>x+6)}>다음 곡 더 보기</button>}
  </>}
  {(song||playlistMode)&&<div className="brew-now-playing">
   <div ref={player}>{running&&src?<><iframe key={src} title={playlistMode?'내 YouTube 재생목록 플레이어':`${song.track} · YouTube 플레이어`} src={src} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/><button type="button" className="brew-stop" onClick={()=>setRunning(false)}><X size={16}/>재생 닫기</button></>:!playlistMode&&<button type="button" className="brew-play-cover" onClick={()=>setRunning(true)}><span className="brew-record" aria-hidden="true"><i/></span><span><b>{song.track}</b><small>{song.caption||'지금 이 자리에서 들어보세요.'}</small><span><Play size={16}/> {continuous?'선곡을 이어 듣기':'먼저 들어보기'}</span></span></button>}</div>
   {running&&!src&&!playlistMode&&<p>이 곡은 <a href={song.url||musicSearchLink(song)} target="_blank" rel="noreferrer">YouTube에서 찾아 듣기 ↗</a></p>}
   {!playlistMode&&onSelect&&<button type="button" className="brew-choose" onClick={()=>onSelect(song)}>{selected?.track===song.track?<><Check size={16}/>이 곡을 골랐어요</>:<>{song.track} 담기 <Check size={16}/></>}</button>}
   <p className="brew-player-note">{running?'재생이 제한되면 YouTube 앱에서 열어 주세요. ':''}YouTube 공식 플레이어 · {playlistMode?'내 재생목록':continuous?'선곡 순서대로 이어집니다.':'들어본 뒤 마음에 드는 곡을 골라요.'} {(!playlistMode||queue)&&<a href={playlistMode?queue.url:song.url||musicSearchLink(song)} target="_blank" rel="noreferrer">YouTube에서 듣기 ↗</a>}</p>
  </div>}
  {error&&<p role="alert" className="resource-error">{error}</p>}
  <details className="brew-rights"><summary>음악 이용·YouTube 연결 안내</summary><p>곡의 권리는 저작권자에게 있습니다. 음원을 복제·판매하지 않고 YouTube 공식 플레이어를 무료로 제공합니다. 영상·광고·출처를 가리지 않습니다. 화면이나 탭을 벗어나면 재생을 멈춥니다.</p><p>Google 로그인은 YouTube Music 청취 기록 연동이 아닙니다. 공식 API는 자주 듣는 곡과 시청 기록을 제공하지 않습니다. 내 음악 또는 직접 공유한 재생목록으로 취향을 연결해 주세요.</p><a href="https://developers.google.com/youtube/terms/developer-policies" target="_blank" rel="noreferrer">YouTube 이용 정책 ↗</a></details>
 </section>;
}
