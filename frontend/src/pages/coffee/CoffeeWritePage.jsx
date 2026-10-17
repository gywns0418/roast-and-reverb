import { useEffect,useState } from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import PageShell from '../../components/common/PageShell.jsx';
import CoffeeForm from '../../components/coffee/CoffeeForm.jsx';
import Input from '../../components/common/Input.jsx';
import {useDeviceDraft} from '../../hooks/useDeviceDraft.js';
import { coffeeApi } from '../../api/coffeeApi.js';
import { coffeePayload } from '../../utils/brewDetails.js';
import { readDevice } from '../../store/discoveryStore.js';
import CoffeeSoundtrack from '../../components/coffee/CoffeeSoundtrack.jsx';
export default function CoffeeWritePage(){
 const navigate=useNavigate();const {state}=useLocation();const candidate=state?.coffeeCandidate;
 const [coffee,setCoffee,draftState]=useDeviceDraft('draft-coffee',()=>state?.coffeeDraft || {beanName:candidate?.name||'',roastery:candidate?.roastery||'',originCountry:candidate?.origin||'',process:candidate?.process||'',roastLevel:candidate?.roast||'',cupNotes:(candidate?.flavors||[]).join(', '),brewMethod:'',tasteNote:'',memo:'',drinkDate:new Date().toLocaleDateString('sv-SE'),brewDetails:{}},!!state?.coffeeDraft||!!candidate);
 const [beans,setBeans]=useState([]),[error,setError]=useState(''),[saving,setSaving]=useState(false),[musicBusy,setMusicBusy]=useState(false);
 useEffect(()=>{const refresh=()=>{try{setBeans(readDevice('beans').filter(bean=>bean.status==='held'));}catch(err){setError(err.message);}};refresh();window.addEventListener('rr-discovery-changed',refresh);return()=>window.removeEventListener('rr-discovery-changed',refresh);},[]);
 function update(value){setCoffee(value);}
 async function save(){if(saving||musicBusy)return;setError('');if(!coffee.beanName.trim()){setError('원두명을 입력해 주세요.');return;}setSaving(true);try{const saved=await coffeeApi.create(coffeePayload({...coffee,memo:[coffee.memo,coffee.cupNotes&&`판매처 컵노트: ${coffee.cupNotes}`].filter(Boolean).join('\n')}));draftState.clear();navigate(`/coffee/${saved.coffeeLogId||saved.coffee_log_id||saved.id}`);}catch(err){setError(err.message);}finally{setSaving(false);}}
 useEffect(()=>{if(!state?.selectedSoundtrack)return;if(candidate?.name&&coffee.beanName&&candidate.name!==coffee.beanName){setError('작성 중인 다른 커피 초안을 유지했어요. 음악은 연결하지 않았습니다. 초안을 저장하거나 비운 뒤 원하는 조합을 다시 골라 주세요.');return;}setCoffee(value=>({...value,brewDetails:{...value.brewDetails,soundtrack:state.selectedSoundtrack}}));},[]);

 return <PageShell title="오늘의 커피와 음악" eyebrow="BREW JOURNAL" subtitle="커피를 고르면 음악이 이어집니다. 마시면서 느낀 감상을 함께 남겨보세요.">
 {draftState.status&&<p className="draft-status" role="status">{draftState.status}</p>}<div className="action-row"><button className="ghost-button" type="button" onClick={draftState.discard}>초안 비우기</button><Link className="ghost-button" to="/coffee">커피 기록 목록</Link></div>
 <div className="coffee-sound-layout"><section className="panel"><label className="input-field"><span>내 보유 원두에서 가져오기</span><select aria-label="작성할 보유 원두" defaultValue="" onChange={e=>{const bean=beans.find(row=>row.id===e.target.value);if(bean)update({...coffee,beanName:bean.name,roastery:bean.roastery||'',originCountry:bean.origin||'',process:bean.process||'',roastLevel:bean.roast||'',cupNotes:(bean.flavors||[]).join(', ')});}}><option value="">직접 적기 · 보유 {beans.length}종</option>{beans.map(bean=><option key={bean.id} value={bean.id}>{bean.name}</option>)}</select></label>
 <h2>내린 한 잔의 기록</h2><CoffeeForm value={coffee} onChange={update}/><div className="form-grid"><Input placeholder="산지" value={coffee.originCountry} onChange={e=>update({...coffee,originCountry:e.target.value})}/><Input placeholder="가공 방식" value={coffee.process} onChange={e=>update({...coffee,process:e.target.value})}/><Input placeholder="판매처 컵노트" value={coffee.cupNotes} onChange={e=>update({...coffee,cupNotes:e.target.value})}/></div><p className="model-note">판매처 컵노트와 내가 느낀 맛은 구분해서 남깁니다. 음악 입력 없이 커피만 저장할 수 있어요.</p></section>
 <aside className="panel coffee-sound-panel"><CoffeeSoundtrack coffee={coffee} onChange={update} onBusyChange={setMusicBusy}/></aside></div>
 <div className="cup-save-bar"><p>선택한 음악과 감상을 이 커피 기록에 함께 저장합니다.</p><button className="primary-button" disabled={saving||musicBusy} onClick={save}>{saving?'저장 중…':musicBusy?'음악을 준비하고 있어요':'이 한 잔의 기록 저장'}</button></div>{error&&<p role="alert" className="resource-error">{error}</p>}
 </PageShell>;
}
