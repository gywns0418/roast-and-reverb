import {useState} from 'react';
import {Link} from 'react-router-dom';
import PageShell from '../../components/common/PageShell.jsx';
import BeanArtwork from '../../components/beans/BeanArtwork.jsx';
import {readRoom,moveRoomMemory,downloadRoomBackup,restoreRoomBackup} from '../../store/ritualStore.js';
import {tasteModel} from '../../utils/ritualLogic.js';
export default function MemoriesPage(){
 const [error,setError]=useState(''),[message,setMessage]=useState('');const [room,setRoom]=useState(()=>{try{return readRoom();}catch(err){return {profile:{},memories:[],trash:[],error:err.message};}});
 function move(id,restore=false){try{moveRoomMemory(id,restore);setRoom(readRoom());setMessage(restore?'기억을 다시 펼쳤습니다.':'기억을 보관함으로 옮겼습니다. 언제든 복원할 수 있어요.');setError('');}catch(err){setError(err.message);}}
 async function restore(event){try{const file=event.target.files?.[0];if(!file)return;if(file.size>2000000)throw new Error('2MB 이하의 청음실 백업을 선택해 주세요.');restoreRoomBackup(JSON.parse(await file.text()));setRoom(readRoom());setMessage('청음실 기억과 취향을 복구했습니다.');setError('');}catch(err){setError(err.message);}finally{event.target.value='';}}
 const likes=room.memories.filter(row=>row.rating===1&&row.brewed&&row.listened);
 const flavorCount=new Map();for(const item of likes)for(const flavor of item.bean.flavors)flavorCount.set(flavor,(flavorCount.get(flavor)||0)+1);
 return <PageShell title="머물렀던 나의 시간" eyebrow="YOUR SENSORY ATLAS" subtitle="좋았던 순간을 펼치면, 다음 한 잔의 힌트가 보입니다.">
 <div className="memory-summary"><div><span>{room.memories.length}</span><p>남긴 감각 기억</p></div><div><span>{new Set(room.memories.map(row=>new Date(row.date).toLocaleDateString('sv-SE'))).size}</span><p>각자의 속도로 머문 날</p></div><div><span>{tasteModel(room.memories).samples}</span><p>직접 확인한 선호 평가</p></div></div>
 <div className="action-row"><Link className="primary-button" to="/ritual">오늘의 청음실로 ↗</Link><button className="ghost-button" onClick={()=>{try{downloadRoomBackup();}catch(err){setError(err.message);}}}>취향과 기억 백업</button><label className="ghost-button file-button">백업 복구<input aria-label="청음실 백업 복구" type="file" accept=".json" onChange={restore}/></label></div>
 {(error||room.error)&&<p role="alert" className="resource-error">{error||room.error}</p>}{message&&<p role="status" className="device-message">{message}</p>}
 {flavorCount.size>0&&<section className="memory-flavors"><p className="eyebrow">NOTICED IN YOUR OWN WORDS</p><h2>좋았다고 확인한 조합에서 자주 만난 향미</h2><div>{[...flavorCount].sort((a,b)=>b[1]-a[1]).slice(0,12).map(([flavor,count])=><span key={flavor}>{flavor}<small>{count}번</small></span>)}</div><p>실제 마시고 들었다고 확인한 좋아요만 집계합니다. 향미는 원두 설명이며 실제 맛을 측정한 결과는 아닙니다.</p></section>}
 {!room.memories.length&&<div className="discovery-empty"><h2>아직 어떤 모습도 정해지지 않았어요.</h2><p>오늘의 한 잔과 한 곡에서 느낀 작은 것을 남겨보세요. 그 문장이 이 공간의 첫 색이 됩니다.</p><Link to="/ritual">나의 첫 시간 시작하기 ↗</Link></div>}
 <div className="memory-grid">{room.memories.map(row=><article className="memory-card" key={row.id}><BeanArtwork item={row.bean} compact/><div><span className="eyebrow">{new Date(row.date).toLocaleDateString('ko-KR')} · 경과 {Math.floor(row.seconds/60)}분</span><h3>{row.bean.name}</h3><p className="memory-track">{row.music.artist||row.music.channel} · {row.music.track}</p><blockquote>{row.note||'말보다 여운으로 남긴 시간.'}</blockquote><p className="room-caption">{row.rating===1?'다시 만나고 싶은 조합':row.rating===-1?'다음에는 다른 결로':'아직 평가하지 않은 조합'} · {row.brewed&&row.listened?'직접 마시고 들었다고 확인':'실제 경험 확인 전'}</p><div className="action-row"><Link className="ghost-button" to="/recommend" state={{coffeeCandidate:{...row.bean,source:'draft'}}}>이 한 잔에서 다시 발견 ↗</Link><button className="ghost-button" onClick={()=>move(row.id)}>보관함으로 이동</button></div></div></article>)}</div>
 {room.trash.length>0&&<details className="panel memory-trash"><summary>접어 둔 기억 {room.trash.length}개 · 복원할 수 있어요</summary>{room.trash.map(row=><div key={row.id}><span>{row.bean.name} · {new Date(row.date).toLocaleDateString('ko-KR')}</span><button className="ghost-button" onClick={()=>move(row.id,true)}>다시 펼치기</button></div>)}</details>}
 <p className="room-caption">기억과 취향은 이 브라우저에만 보관합니다. 다른 기기로 옮기거나 브라우저 저장소를 정리하기 전에 백업해 주세요. 새로운 음원 생성은 아직 연결되지 않았습니다.</p>
 </PageShell>;
}
