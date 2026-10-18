import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {authStore} from '../store/authStore.js';
import {coffeeApi} from '../api/coffeeApi.js';
import {adaptCoffeeLog} from '../api/adapters.js';
import {listDiaryRecords} from '../utils/diaryRecords.js';
import FirstCup from '../components/coffee/FirstCup.jsx';
import TastingShelf from '../components/coffee/TastingShelf.jsx';
import AuthModal from '../components/auth/AuthModal.jsx';
const real=import.meta.env.VITE_USE_REAL_API==='true';
const examples=[{id:'example-1',date:'체험 예시',bean:'오늘의 한 잔',brew:'느낌부터 시작',memo:'고소하고 끝에 초콜릿 맛이 남았어.',brewDetails:{}},{id:'example-2',date:'체험 예시',bean:'식으면서 달라진 커피',brew:'한 모금 더',memo:'처음엔 조금 낯설었는데 식으니까 달게 느껴졌어.',brewDetails:{}}];
export default function HomePage(){
 const [records,setRecords]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false),[revision,refresh]=useState(0),[authMode,setAuthMode]=useState(null),[shelfOpen,setShelfOpen]=useState(false);
 useEffect(()=>{const changed=()=>refresh(x=>x+1);window.addEventListener('rr-auth-changed',changed);return()=>window.removeEventListener('rr-auth-changed',changed);},[]);
 useEffect(()=>{let active=true;setRecords([]);setError('');if(real&&!authStore.token){setLoading(false);return;}setLoading(true);listDiaryRecords(coffeeApi.list).then(rows=>{if(active)setRecords(rows.map(adaptCoffeeLog).sort((a,b)=>b.date.localeCompare(a.date)||Number(b.id)-Number(a.id)));}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[revision]);
 return <div className="studio-home first-cup-home"><header className="first-home-nav"><Link to="/" className="first-home-brand">r&r<span>ROAST & REVERB</span></Link><nav aria-label="첫 화면 메뉴"><button type="button" onClick={()=>setShelfOpen(true)}>내 진열장</button>{!real||authStore.token?<Link to="/dashboard">기록장 ↗</Link>:<button type="button" onClick={()=>setAuthMode('login')}>로그인</button>}</nav></header>
 <main className="first-home-main"><FirstCup heading="h1" onSaved={()=>{refresh(x=>x+1);setShelfOpen(true);}} collectionOpen={shelfOpen} onCollectionChange={setShelfOpen} recordCount={records.length} collection={loading?<p role="status">내 테이스팅 카드를 꺼내고 있어요…</p>:error?<div role="alert"><p>{error}</p><button className="ghost-button" onClick={()=>refresh(x=>x+1)}>진열장 다시 불러오기</button></div>:records.length?<TastingShelf key={records.length} records={records}/>:<TastingShelf records={examples} example/>}/>
 <section className="first-home-next"><div><p className="eyebrow">A LITTLE MORE, WHEN YOU WANT</p><h2>오늘은 한 줄.<br/>다음엔 한 가지만 더.</h2><p>좋았던 한 잔이 쌓이면, 내 취향의 모양이 보여요.</p></div><div><Link to="/coffee/write">원두와 추출 조건까지 남기기 ↗</Link><Link to="/journey">맛을 표현하는 짧은 가이드 ↗</Link><Link to="/monthly-pick">다음에 마실 원두 둘러보기 ↗</Link></div></section></main>
 <footer className="first-home-footer"><strong>Roast & Reverb</strong><span>한 잔의 취향. 한 곡의 여운.</span><Link to="/help">도움말</Link><a href={`${import.meta.env.BASE_URL}privacy.html`}>개인정보처리방침</a></footer>{authMode&&<AuthModal initialMode={authMode} onClose={()=>setAuthMode(null)} onAuthenticated={()=>{setAuthMode(null);refresh(x=>x+1);}}/>}</div>;
}
