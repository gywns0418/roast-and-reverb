import { useEffect,useState } from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import PageShell from '../../components/common/PageShell.jsx';
import CoffeeForm from '../../components/coffee/CoffeeForm.jsx';
import Input from '../../components/common/Input.jsx';
import { coffeeApi } from '../../api/coffeeApi.js';
import { coffeePayload } from '../../utils/brewDetails.js';
import { readDevice } from '../../store/discoveryStore.js';
import { coffeeMusicBrief } from '../../utils/coffeeMusicBrief.js';
export default function CoffeeWritePage(){
 const navigate=useNavigate();const {state}=useLocation();const candidate=state?.coffeeCandidate;
 const [coffee,setCoffee]=useState(state?.coffeeDraft || {beanName:candidate?.name||'',roastery:candidate?.roastery||'',originCountry:candidate?.origin||'',process:candidate?.process||'',roastLevel:candidate?.roast||'',cupNotes:(candidate?.flavors||[]).join(', '),brewMethod:'',tasteNote:'',memo:'',drinkDate:new Date().toLocaleDateString('sv-SE'),brewDetails:{}});
 const [beans,setBeans]=useState([]),[error,setError]=useState(''),[saving,setSaving]=useState(false),[brief,setBrief]=useState(null),[message,setMessage]=useState('');
 useEffect(()=>{const refresh=()=>{try{setBeans(readDevice('beans').filter(bean=>bean.status==='held'));}catch(err){setError(err.message);}};refresh();window.addEventListener('rr-discovery-changed',refresh);return()=>window.removeEventListener('rr-discovery-changed',refresh);},[]);
 function update(value){setCoffee(value);setBrief(null);setMessage('');}
 async function save(){setError('');if(!coffee.beanName.trim()){setError('원두명을 입력해 주세요.');return;}setSaving(true);try{const saved=await coffeeApi.create(coffeePayload({...coffee,memo:[coffee.memo,coffee.cupNotes&&`판매처 컵노트: ${coffee.cupNotes}`].filter(Boolean).join('\n')}));navigate(`/coffee/${saved.coffeeLogId||saved.coffee_log_id||saved.id}`);}catch(err){setError(err.message);}finally{setSaving(false);}}
 const recommendBean={...candidate,id:candidate?.id||'coffee-draft',name:coffee.beanName,roastery:coffee.roastery,origin:coffee.originCountry,process:coffee.process,roast:coffee.roastLevel,flavors:coffee.cupNotes.split(/[,，]/).map(s=>s.trim()).filter(Boolean),tasteNote:coffee.tasteNote,source:'draft'};
 return <PageShell title="오늘의 커피" eyebrow="BREW JOURNAL" subtitle="한 잔의 맛을 먼저 남기세요. 음악은 그 향미에서 이어집니다.">
 <div className="action-row"><Link className="ghost-button" to="/coffee">커피 기록 목록</Link><Link className="ghost-button" to="/music/write">음악은 따로 기록하기 ↗</Link></div>
 <div className="coffee-sound-layout"><section className="panel"><label className="input-field"><span>내 보유 원두에서 가져오기</span><select aria-label="작성할 보유 원두" defaultValue="" onChange={e=>{const bean=beans.find(row=>row.id===e.target.value);if(bean)update({...coffee,beanName:bean.name,roastery:bean.roastery||'',originCountry:bean.origin||'',process:bean.process||'',roastLevel:bean.roast||'',cupNotes:(bean.flavors||[]).join(', ')});}}><option value="">직접 적기 · 보유 {beans.length}종</option>{beans.map(bean=><option key={bean.id} value={bean.id}>{bean.name}</option>)}</select></label>
 <h2>내린 한 잔의 기록</h2><CoffeeForm value={coffee} onChange={update}/><div className="form-grid"><Input placeholder="산지" value={coffee.originCountry} onChange={e=>update({...coffee,originCountry:e.target.value})}/><Input placeholder="가공 방식" value={coffee.process} onChange={e=>update({...coffee,process:e.target.value})}/><Input placeholder="판매처 컵노트" value={coffee.cupNotes} onChange={e=>update({...coffee,cupNotes:e.target.value})}/></div><p className="model-note">판매처 컵노트와 내가 느낀 맛은 구분해서 남깁니다. 음악 입력 없이 커피만 저장할 수 있어요.</p><button className="primary-button" disabled={saving} onClick={save}>{saving?'저장 중…':'커피 기록 저장'}</button></section>
 <aside className="panel coffee-sound-panel"><p className="eyebrow">THE SOUND OF YOUR CUP</p><h2>이 한 잔은 어떤 소리일까요?</h2><p>컵노트와 산지를 음악의 질감·악기·흐름으로 풀어보세요.</p><div className="action-row"><Link className="primary-button" to="/recommend" state={{coffeeCandidate:recommendBean,coffeeDraft:coffee}}>이 커피로 AI 음악 추천 ↗</Link><button className="ghost-button" onClick={()=>{try{setError('');setBrief(coffeeMusicBrief(coffee));}catch(err){setError(err.message);}}}>음악 제작 설명 만들기</button><Link className="ghost-button" to="/studio" state={{coffeeCandidate:{...recommendBean,cupNotes:coffee.cupNotes,tasteNote:coffee.tasteNote}}}>이 한 잔으로 새 연주곡 만들기 ↗</Link></div><p className="model-note">AI 음악 추천은 기존 음악 후보에서 찾습니다. 제작 설명은 향미를 음악에 비유한 규칙 기반 초안이며 실제 음원을 생성하지 않습니다.</p>
 {brief&&<div className="music-brief"><h3>{brief.mood}</h3><p>{brief.basis.join(' · ')}</p><label className="input-field"><span>음원 생성 도구에 사용할 제작 설명</span><textarea aria-label="음악 제작 설명" readOnly rows={9} value={brief.prompt}/></label><button className="ghost-button" onClick={async()=>{try{await navigator.clipboard.writeText(brief.prompt);setMessage('제작 설명을 복사했습니다.');}catch{setMessage('복사할 수 없습니다. 설명을 직접 선택해 주세요.');}}}>설명 복사</button><p>실제 음악 생성은 음원 서비스 연결과 무료 크레딧 확인 후 사용할 수 있습니다.</p></div>}
 {message&&<p role="status">{message}</p>}</aside></div>{error&&<p role="alert" className="resource-error">{error}</p>}
 </PageShell>;
}
