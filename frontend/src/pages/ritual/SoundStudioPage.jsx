import {useEffect,useRef,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowUpRight,Download,Heart,Music2,RefreshCw,SlidersHorizontal} from 'lucide-react';
import PageShell from '../../components/common/PageShell.jsx';
import {readDevice,saveDevice} from '../../store/discoveryStore.js';
import {soundMoods,soundSettings,settingsForCoffee,soundCommands,applySoundCommand,validateSoundRecipe,parseSoundBackup} from '../../utils/soundStudio.js';
import {renderSound} from '../../utils/soundRenderer.js';
import '../../styles/sound-studio.css';

function loadStudio(coffee) {
  try{return {tracks:readDevice('sound-tracks').map(validateSoundRecipe),settings:coffee?settingsForCoffee(coffee):soundSettings(readDevice('sound-preference')[0]),error:''};}
  catch(error){return {tracks:[],settings:settingsForCoffee(coffee),error:`저장된 사운드를 읽지 못했습니다. ${error.message}`};}
}
const time=value=>`${Math.floor(value/60)}:${Math.floor(value%60).toString().padStart(2,'0')}`;
export default function SoundStudioPage() {
  const location=useLocation(), coffee=location.state?.coffeeCandidate;
  const [initial]=useState(()=>loadStudio(coffee));
  const [settings,setSettings]=useState(initial.settings),[tracks,setTracks]=useState(initial.tracks),[error,setError]=useState(initial.error);
  const [current,setCurrent]=useState(null),[url,setUrl]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[command,setCommand]=useState(''),[playing,setPlaying]=useState(false),[title,setTitle]=useState('');
  const [history,setHistory]=useState([]);
  const revision=useRef(0),urlRef=useRef(''),audio=useRef(null),file=useRef(null),mounted=useRef(true),rendering=useRef(false);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;revision.current++;URL.revokeObjectURL(urlRef.current);};},[]);
  useEffect(()=>{if(audio.current)audio.current.volume=.45;},[url]);
  function persist(rows){if(initial.error)throw new Error('기존 보관함을 읽지 못해 덮어쓰기를 중단했습니다. 브라우저 저장소 상태를 확인해 주세요.');saveDevice('sound-tracks',rows);setTracks(rows);}
  async function generate(recipe=null, nextSettings=settings, keepSeed=false) {
    if(rendering.current)return;
    rendering.current=true;const token=++revision.current;setBusy(true);setError('');setNotice('선율을 쓰고 소리를 만드는 중…');audio.current?.pause();
    const next=recipe||{version:1,id:crypto.randomUUID(),createdAt:new Date().toISOString(),coffee:String(keepSeed&&current?current.coffee:coffee?.name||'').slice(0,120),title:keepSeed&&current?(title.trim()||current.title):`${soundMoods[nextSettings.mood].label} · 한 잔의 소리`,seed:keepSeed&&current?current.seed:crypto.getRandomValues(new Uint32Array(1))[0],settings:soundSettings(nextSettings),favorite:false};
    try{const output=await renderSound(next.settings,next.seed);if(!mounted.current||token!==revision.current)return;const nextUrl=URL.createObjectURL(output.blob);URL.revokeObjectURL(urlRef.current);urlRef.current=nextUrl;setUrl(nextUrl);setCurrent({...next,duration:output.duration});setTitle(next.title);setSettings(next.settings);setPlaying(false);setNotice('음악이 준비됐어요. 재생 버튼을 눌러 들어보세요.');}
    catch(err){if(mounted.current)setError(err.message);}
    finally{rendering.current=false;if(mounted.current)setBusy(false);}
  }
  function requestSound(text){try{const next=applySoundCommand(text,settings);setSettings(next);setHistory(rows=>[...rows.slice(-5),{text,result:`${soundMoods[next.mood].label} · ${next.bpm} BPM · ${next.rhythm?'작은 리듬':'리듬 없이'}`}]);setCommand('');generate(null,next,true);}catch(err){setError(err.message);}}
  function save(){try{if(!current)return;if(tracks.length>=24&&!tracks.some(row=>row.id===current.id))throw new Error('24곡까지 보관할 수 있어요. 먼저 백업하고 필요 없는 곡을 지워 주세요.');const next=validateSoundRecipe({...current,title:title.trim()||current.title});persist([next,...tracks.filter(row=>row.id!==next.id)]);setCurrent({...next,duration:current.duration});setNotice('이 브라우저의 사운드 선반에 보관했어요.');}catch(err){setError(err.message);}}
  function backup(){const backupUrl=URL.createObjectURL(new Blob([JSON.stringify({format:'roast-reverb-sounds',version:1,tracks},null,2)],{type:'application/json'}));const anchor=document.createElement('a');anchor.href=backupUrl;anchor.download='roast-reverb-sounds.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(backupUrl),1000);}
  async function restore(event){const selected=event.target.files[0];event.target.value='';if(!selected)return;try{if(selected.size>150000)throw new Error('150KB 이하의 사운드 백업을 선택해 주세요.');const incoming=parseSoundBackup(JSON.parse(await selected.text()));const merged=new Map(tracks.map(row=>[row.id,row]));incoming.forEach(row=>{if(!merged.has(row.id))merged.set(row.id,row);});if(merged.size>24)throw new Error('합치면 24곡을 넘습니다. 현재 보관함을 먼저 정리해 주세요.');persist([...merged.values()]);setNotice('기존 곡을 유지하고 백업의 새 곡을 복원했어요.');}catch(err){setError(err.message);}}
  return <PageShell title="한 잔의 사운드" eyebrow="COMPOSE A LITTLE MOMENT" subtitle="오늘의 커피에, 세상에 없던 작은 선율 하나.">
    {error&&<p className="resource-error" role="alert">{error}</p>}
    <div className="sound-layout">
      <section className="sound-stage" style={{'--sound-color':soundMoods[settings.mood].color}} aria-label="나의 사운드 플레이어">
        <div className="sound-topline"><span>R&R ORIGINAL STUDIES</span><span>VOL. {String(tracks.length+1).padStart(2,'0')}</span></div>
        <div className={`sound-art ${playing?'is-playing':''}`} aria-hidden="true"><div className="sound-halo"/><div className="sound-disc"><div className="sound-label"><span>ROAST & REVERB</span><b>한 잔의<br/>여운</b><small>33⅓ / YOUR OWN SOUND</small></div></div><div className="sound-stem"/></div>
        <div className="sound-stage-copy"><p className="eyebrow">{current?'MADE FOR THIS MOMENT':'A NEW MELODY STARTS HERE'}</p><h2>{current?.title||'당신의 한 잔을\n음악으로 내려보세요.'}</h2><p>{current?`${soundMoods[current.settings.mood].description} · ${current.settings.bpm} BPM · ${time(current.duration)}`:coffee?.name?`${coffee.name}의 향미에서 시작합니다.`:'분위기 하나를 고르면, 건반과 베이스가 새로운 선율을 만듭니다.'}</p></div>
        {url&&<audio ref={audio} controls src={url} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} aria-label="생성한 연주곡"/>}
        <div className="action-row"><button className="primary-button" disabled={busy} onClick={()=>generate()}><Music2 size={17}/>{busy?'소리를 빚는 중…':current?'새로운 선율 만들기':'나의 첫 음악 만들기'}</button>{url&&<a className="ghost-button" href={url} download={`roast-reverb-${current.seed}.wav`}><Download size={16}/> WAV 다운로드</a>}</div>
        <p className="sound-status" role="status">{notice||'자동 재생 없이, 준비되면 직접 들어보세요.'}</p>
        <p className="sound-engine">기기 내 작곡 · 외부 전송 없음 · 보컬 없는 연주곡<br/>규칙 기반으로 새 선율을 만드는 기능이며 생성형 AI 음원은 아닙니다.</p>
      </section>
      <div className="sound-side"><section className="panel sound-controls"><p className="eyebrow">THE TEXTURE OF YOUR CUP</p><h2>어떤 결로 들려줄까요?</h2><div className="sound-moods">{Object.entries(soundMoods).map(([id,mood])=><button key={id} disabled={busy} aria-pressed={settings.mood===id} onClick={()=>setSettings({...settings,mood:id})}><i style={{background:mood.color}}/>{mood.label}</button>)}</div>
        <label className="sound-slider"><span>걸음의 속도 <b>{settings.bpm} BPM</b></span><input aria-label="음악 속도" type="range" min="56" max="110" value={settings.bpm} disabled={busy} onChange={e=>setSettings({...settings,bpm:Number(e.target.value)})}/><small>느긋하게 <span>가볍게 움직이기</span></small></label>
        <label className="sound-slider"><span>여운의 길이 <b>{Math.round(settings.space*100)}%</b></span><input aria-label="음악 잔향" type="range" min="0" max="1" step=".05" value={settings.space} disabled={busy} onChange={e=>setSettings({...settings,space:Number(e.target.value)})}/></label>
        <div className="sound-layers">{[['bass','둥근 베이스'],['pad','배경 화음'],['rhythm','작은 리듬']].map(([key,label])=><label key={key}><input type="checkbox" checked={settings[key]} disabled={busy} onChange={e=>setSettings({...settings,[key]:e.target.checked})}/>{label}</label>)}</div>
        {current&&<button className="ghost-button" disabled={busy} onClick={()=>generate(null,settings,true)}><SlidersHorizontal size={16}/> 같은 선율에 설정 반영</button>}
        <button className="sound-text-button" onClick={()=>{try{saveDevice('sound-preference',[settings]);setNotice('다음 방문의 시작 분위기로 기억할게요.');}catch(err){setError(err.message);}}}>이 설정을 다음에도 기억하기 ↗</button>
      </section>
      <section className="panel sound-conversation"><div className="sound-conversation-heading"><h3>말 한마디로, 다른 여운</h3><span>소리 요청</span></div><p>아래 표현을 누르거나 입력해 보세요. 같은 선율의 분위기를 바꿔 다시 만듭니다.</p><div className="sound-chips">{soundCommands.map(text=><button disabled={busy} key={text} onClick={()=>requestSound(text)}>{text}</button>)}</div>
        {history.length>0&&<div className="sound-history" aria-label="반영한 소리 요청">{history.map((row,i)=><div key={i}><b>{row.text}</b><span>{row.result}</span></div>)}</div>}
        <form onSubmit={event=>{event.preventDefault();requestSound(command);}}><label className="sr-only" htmlFor="sound-request">소리 요청 입력</label><input id="sound-request" value={command} disabled={busy} maxLength={120} onChange={e=>setCommand(e.target.value)} placeholder="예: 조금 느리게"/><button disabled={busy||!command.trim()} type="submit" aria-label="소리 요청 반영"><ArrowUpRight size={20}/></button></form>
        <small>소리 요청은 정해진 표현을 처리합니다. 자유로운 AI 대화는 아직 연결되지 않았습니다.</small>
      </section></div>
    </div>
    {current&&<section className="panel sound-save"><label className="input-field"><span>이 음악에 이름을 붙여주세요</span><input maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="비 오는 목요일의 한 잔"/></label><button className="primary-button" disabled={busy} onClick={save}>나의 사운드 선반에 보관</button><p>악보와 설정을 기기에 저장해 같은 음악을 다시 만들 수 있어요. 음원 파일은 WAV로 따로 내려받으세요.</p></section>}
    <section className="sound-library"><div className="sound-library-heading"><div><p className="eyebrow">A SHELF OF YOUR OWN</p><h2>다시 듣고 싶은 순간 <span>{tracks.length}</span></h2></div><div className="action-row"><button className="ghost-button" onClick={backup} disabled={!tracks.length}>선반 백업</button><button className="ghost-button" onClick={()=>file.current.click()}>백업 가져오기</button><input ref={file} type="file" accept="application/json,.json" hidden onChange={restore}/></div></div>
    {tracks.length?<div className="sound-cards">{tracks.map(track=><article className="sound-card" key={track.id}><div className="sound-mini-cover" style={{background:soundMoods[track.settings.mood].color}}><span>r&r</span><Music2 size={38}/><small>{track.settings.bpm} BPM</small></div><div className="sound-card-copy"><h3>{track.title}</h3><p>{track.coffee||soundMoods[track.settings.mood].label}</p><small>{new Date(track.createdAt).toLocaleDateString('ko-KR')}</small><div className="action-row"><button disabled={busy} onClick={()=>generate(track)}><RefreshCw size={14}/> 다시 듣기</button><button aria-label={`${track.title} 즐겨찾기`} aria-pressed={track.favorite} onClick={()=>{try{persist(tracks.map(row=>row.id===track.id?{...row,favorite:!row.favorite}:row));}catch(err){setError(err.message);}}}><Heart size={16} fill={track.favorite?'currentColor':'none'}/></button></div><button className="sound-text-button" onClick={()=>{if(window.confirm('이 곡을 선반에서 삭제할까요? 백업이 있으면 다시 가져올 수 있어요.'))try{persist(tracks.filter(row=>row.id!==track.id));}catch(err){setError(err.message);}}}>선반에서 삭제</button></div></article>)}</div>:<div className="sound-empty"><Music2 size={28}/><h3>당신의 첫 번째 트랙을 기다리고 있어요.</h3><p>마음에 드는 순간에 이름을 붙여 보관해 보세요.</p></div>}
    <p className="sound-footnote">이 브라우저에만 저장됩니다. 기기를 바꾸거나 브라우저 자료를 지우기 전 백업해 주세요. <Link to="/ritual">청음실로 돌아가기 ↗</Link></p></section>
  </PageShell>;
}
