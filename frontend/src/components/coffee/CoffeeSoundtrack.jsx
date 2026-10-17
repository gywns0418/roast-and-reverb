import {useEffect,useRef,useState} from 'react';
import {readDevice} from '../../store/discoveryStore.js';
import {roomTracks,roomMusicPool} from '../../utils/ritualLogic.js';
import {rankDiscovery,beanText,musicText} from '../../utils/discoveryRanking.js';
import {coffeeCandidate,matchedSoundtrack,generatedSoundtrack,readSoundtrack} from '../../utils/coffeeSoundtrack.js';
import {settingsForCoffee} from '../../utils/soundStudio.js';
import {renderSound} from '../../utils/soundRenderer.js';

// The attachment and the cup are saved in the same coffee request. Audio blobs stay in memory.
export default function CoffeeSoundtrack({coffee,onChange,readOnly=false,onBusyChange}){
  const details=coffee.brewDetails||{},song=readSoundtrack(details.soundtrack);
  const [results,setResults]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState(''),[url,setUrl]=useState('');
  const alive=useRef(true),flight=useRef(false),audioUrl=useRef('');
  const latest=useRef(coffee);latest.current=coffee;
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;URL.revokeObjectURL(audioUrl.current);};},[]);
  const context=JSON.stringify(coffeeCandidate(coffee));
  const contextRef=useRef(context);contextRef.current=context;
  useEffect(()=>{setResults([]);},[context]);
  function patch(changes){const value=latest.current;onChange?.({...value,brewDetails:{...value.brewDetails,...changes}});}
  function attach(value){URL.revokeObjectURL(audioUrl.current);audioUrl.current='';setUrl('');patch({soundtrack:value});setStatus('음악을 이 한 잔에 연결했어요. 아래에서 감상을 함께 남겨보세요.');}
  async function run(action){if(flight.current)return;flight.current=true;setBusy(true);onBusyChange?.(true);setError('');try{await action();}catch(err){if(alive.current)setError(err.message);}finally{flight.current=false;if(alive.current){setBusy(false);onBusyChange?.(false);}}}
  function match(ai=false){const started=context;run(async()=>{
    const bean=coffeeCandidate(coffee);if(!bean.name.trim())throw new Error('먼저 오늘 마시는 원두명을 입력해 주세요.');
    const pool=roomMusicPool([...roomTracks,...readDevice('music')]);
    let vectors=null;
    if(ai){setStatus('기기에서 AI 의미 모델을 준비하고 있어요. 처음에는 모델을 내려받습니다.');const {semanticEmbeddings}=await import('../../utils/semanticClient.js');vectors=await semanticEmbeddings([`query: ${beanText(bean)}에 어울리는 음악`,`passage: 커피 ${beanText(bean)}`,...pool.map(item=>`passage: 음악 ${musicText(item)}`)]);}
    if(!alive.current)return;if(started!==contextRef.current){setStatus('커피 정보가 바뀌었어요. 바뀐 정보로 다시 찾아 주세요.');return;}
    setResults(rankDiscovery({beans:[bean],music:pool,situation:'',vectors}));setStatus(ai?'기기 내 AI로 후보의 설명을 비교했어요. 마음에 드는 곡을 골라 주세요.':'향미와 음악 태그로 골랐어요. 마음에 드는 곡을 골라 주세요.');
  });}
  function make(recipe=null){const started=context;run(async()=>{
    if(!recipe&&!coffee.beanName?.trim())throw new Error('먼저 오늘 마시는 원두명을 입력해 주세요.');
    setStatus('한 잔의 향미로 선율과 소리를 만들고 있어요.');
    const next=recipe||{version:1,id:crypto.randomUUID(),title:`${coffee.beanName.slice(0,65)} · 한 잔의 연주`,coffee:coffee.beanName,createdAt:new Date().toISOString(),seed:crypto.getRandomValues(new Uint32Array(1))[0],settings:settingsForCoffee(coffeeCandidate(coffee)),favorite:false};
    const output=await renderSound(next.settings,next.seed);if(!alive.current)return;
    if(!recipe&&started!==contextRef.current){setStatus('커피 정보가 바뀌었어요. 바뀐 정보로 다시 만들어 주세요.');return;}
    if(!recipe)attach(generatedSoundtrack(next));
    URL.revokeObjectURL(audioUrl.current);audioUrl.current=URL.createObjectURL(output.blob);setUrl(audioUrl.current);setStatus('연주가 준비됐어요. 재생 버튼으로 들어보세요.');
  });}
  return <section className="cup-soundtrack" aria-label="커피와 함께하는 음악">
    <p className="eyebrow">A SOUND FOR YOUR CUP</p><h2>{readOnly?'이 한 잔과 함께한 음악':'이 커피에 음악을 더해요'}</h2>
    {!readOnly&&<><p>곡명은 따로 적지 않아도 돼요. 어울리는 음악을 받거나 이 한 잔의 연주를 만들어 보세요.</p><div className="action-row"><button type="button" className="primary-button" disabled={busy} onClick={()=>match()}>어울리는 음악 받기</button><button type="button" className="ghost-button" disabled={busy} onClick={()=>make()}>이 커피로 연주 만들기</button></div><details className="flow-options"><summary>AI로 음악 후보 더 살펴보기</summary><button type="button" className="ghost-button" disabled={busy} onClick={()=>match(true)}>AI 의미로 매칭하기</button><p className="model-note">공개 모델을 처음 내려받은 뒤 이 기기에서 향미와 음악 설명을 비교해요.</p></details><p className="model-note">기존 음악은 R&R 시작 선곡과 저장한 후보에서 찾아요. 새 연주는 기기 내 작곡 방식이며 생성형 AI 음원은 아닙니다.</p></>}
    {error&&<p role="alert" className="resource-error">{error}</p>}{status&&<p role="status">{status}</p>}
    {!readOnly&&results.length>0&&<div className="cup-song-options">{results.map(result=><article key={result.id}><h3>{result.music.track}</h3><p>{result.music.artist||result.music.channel}</p><small>{result.music.metadataSource||'저장한 음악 후보'}</small><button type="button" className="ghost-button" disabled={busy} onClick={()=>attach(matchedSoundtrack(result.music,result.method))}>이 곡과 함께하기</button></article>)}</div>}
    {song?<div className="cup-selected-song"><span>{song.kind==='generated'?'이 커피로 만든 연주':'이 커피에 매칭한 음악'} · {song.listened?'직접 들음':'감상 전'}</span><h3>{song.track}</h3><p>{song.artist||song.channel||'아티스트 미확인'}</p><small>{song.method}</small><div className="action-row">{song.kind==='matched'?<a className="primary-button" href={song.url} target="_blank" rel="noreferrer">음악 듣기 ↗</a>:<button type="button" className="primary-button" disabled={busy} onClick={()=>make(song.recipe)}>{busy?'연주를 준비하는 중…':'저장한 연주 다시 준비하기'}</button>}{!readOnly&&<button type="button" className="ghost-button" disabled={busy} onClick={()=>{patch({soundtrack:null});setStatus('음악 연결을 해제했어요.');}}>음악 연결 해제</button>}</div>{url&&song.kind==='generated'&&<audio controls src={url} aria-label="이 커피로 만든 연주"/>}{!readOnly&&<label className="cup-listened"><input type="checkbox" checked={song.listened} onChange={e=>patch({soundtrack:{...song,listened:e.target.checked}})}/> 이 음악을 실제로 들었어요</label>}</div>:<p className="model-note">{readOnly?'이 기록에는 연결한 음악이 없어요.':'음악 없이 커피만 저장해도 괜찮아요.'}</p>}
    {readOnly?details.momentNote&&<div className="cup-moment-note"><h3>커피와 음악, 함께 남긴 감상</h3><p>{details.momentNote}</p></div>:<label className="input-field cup-moment-note"><span>마시면서 느낀 맛과 음악의 감상</span><textarea rows={4} maxLength={2000} value={details.momentNote||''} onChange={e=>patch({momentNote:e.target.value})} placeholder="식으면서 산미가 선명해지고, 피아노의 여운과 잘 어울렸어요."/></label>}
  </section>;
}
