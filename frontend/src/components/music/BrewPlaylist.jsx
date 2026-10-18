import {useId,useState} from 'react';
import {Play,Check,Headphones,X} from 'lucide-react';
import {brewPlaylist} from '../../data/brewPlaylist.js';
import {parseMusicLink,musicSearchLink} from '../../utils/musicCandidates.js';

export default function BrewPlaylist({tracks=brewPlaylist,onSelect,selected,title='커피 내리는 동안, 틀어두세요.',continuous=true}){
 const [active,setActive]=useState(null),[running,setRunning]=useState(false);const heading=useId();
 const songs=tracks.map(song=>{const known=brewPlaylist.find(x=>x.id===song.id||x.track===song.track&&x.artist===song.artist);return {...known,...song,url:song.url||known?.url||''};});
 const song=songs.find(x=>x.id===active)||songs[0];
 function video(item){try{const link=parseMusicLink(item?.url);return link.kind==='video'?link.id:null;}catch{return null;}}
 const id=video(song),ids=songs.map(video).filter(Boolean);const tail=continuous&&id?ids.slice(ids.indexOf(id)+1):[];
 const src=id?`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0${tail.length?`&playlist=${[id,...tail].join(',')}`:''}`:'';
 return <section className="brew-playlist" aria-labelledby={heading}>
  <div className="brew-playlist-heading"><Headphones size={18}/><div><p>R&R BREWING PLAYLIST</p><h2 id={heading}>{title}</h2></div></div>
  <div className="brew-song-tabs" role="group" aria-label="들어볼 곡 선택">{songs.map((item,i)=><button type="button" key={item.id} aria-pressed={song?.id===item.id} onClick={()=>{setActive(item.id);setRunning(true);}}><span>{String(i+1).padStart(2,'0')}</span><span><b>{item.track}</b><small>{item.artist||item.channel}</small></span></button>)}</div>
  {song&&<div className="brew-now-playing">
   {running&&src?<><iframe key={src} title={`${song.track} · YouTube 플레이어`} src={src} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/><button type="button" className="brew-stop" onClick={()=>setRunning(false)}><X size={16}/>재생 닫기</button></>:<button type="button" className="brew-play-cover" onClick={()=>setRunning(true)}><span className="brew-record" aria-hidden="true"><i/></span><span><b>{song.track}</b><small>{song.caption||'지금 이 자리에서 들어보세요.'}</small><span><Play size={16}/> {continuous?'플레이리스트 틀어두기':'먼저 들어보기'}</span></span></button>}
   {running&&!src&&<p>이 곡은 <a href={song.url||musicSearchLink(song)} target="_blank" rel="noreferrer">YouTube에서 찾아 듣기 ↗</a></p>}
   {onSelect&&<button type="button" className="brew-choose" onClick={()=>onSelect(song)}>{selected?.track===song.track?<><Check size={16}/>이 곡을 골랐어요</>:<>{song.track} 담기 <Check size={16}/></>}</button>}
   <p className="brew-player-note">{running?'재생이 제한되면 ‘앱에서 듣기’로 열어 주세요. ':''}YouTube 공식 플레이어 · {continuous?'선곡 순서대로 이어집니다.':'들어본 뒤 마음에 드는 곡을 골라요.'} <a href={song.url||musicSearchLink(song)} target="_blank" rel="noreferrer">앱에서 듣기 ↗</a></p>
  </div>}
 </section>;
}
