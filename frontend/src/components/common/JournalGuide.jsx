import { Link } from 'react-router-dom';
const steps=[
  {title:'느낌 한 줄',text:'“고소하고 초콜릿 맛이 났어.” 기억나는 말만 적어요.',to:'/dashboard',action:'한 줄 남기기',kind:'cup'},
  {title:'음악은 원할 때',text:'함께 듣고 싶은 곡을 골라요. 음악 없이 저장해도 좋아요.',kind:'music'},
  {title:'확인하고 보관',text:'카드를 확인하고 저장해요. 내 기록에서 다시 볼 수 있어요.',to:'/coffee',action:'내 기록 보기',kind:'save'},
];
// These original SVG illustrations repeat the adjacent real text, so are decorative.
function Drawing({kind}){
 return <svg viewBox="0 0 160 100" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
  {kind==='cup'?<><path d="M34 40h65v24a24 24 0 0 1-24 24H58a24 24 0 0 1-24-24Z" fill="#e7edda"/><path d="M99 44h9a14 14 0 0 1 0 28h-9M28 90h85M50 27v-9m20 9V10m20 17v-9M119 22l11 11-27 27-14 3 3-14Z"/></>:kind==='music'?<><path d="M45 62V47a35 35 0 0 1 70 0v15M44 59h13v28H44a10 10 0 0 1-10-10v-8a10 10 0 0 1 10-10Zm72 0h-13v28h13a10 10 0 0 0 10-10v-8a10 10 0 0 0-10-10Z" fill="#e7edda"/><path d="M81 44v27m0-27 17-4v24"/><ellipse cx="73" cy="73" rx="8" ry="5"/><ellipse cx="90" cy="66" rx="8" ry="5"/></>:<><path d="M37 31h86v61H37Z" fill="#e7edda"/><path d="M29 20h102v18H29Zm35 33h32M64 69l11 11 23-24"/></>}
 </svg>;
}
export default function JournalGuide({compact=false}){
 return <section className={`journal-guide${compact?' journal-guide-compact':''}`} aria-label="그림으로 보는 기록 방법">
  <h2>한 잔을 남기는 세 단계</h2>
  <ol>{steps.map((step,index)=><li key={step.kind}>
   <div className="journal-guide-picture"><Drawing kind={step.kind}/><span aria-hidden="true">{index+1}</span></div>
   <h3><span className="sr-only">{index+1}단계. </span>{step.title}</h3><p>{step.text}</p>
   {step.to&&<Link to={step.to}>{step.action} →</Link>}
  </li>)}</ol>
  <p className="journal-guide-storage">기록은 이 브라우저에 보관돼요. 기기를 바꾸기 전 설정에서 백업해 주세요.</p>
 </section>;
}
