import { Link } from 'react-router-dom';
const steps=[
  {title:'느낌 한 줄',text:'“고소하고 초콜릿 맛이 났어.” 기억나는 말만 적어요.',to:'/dashboard',action:'한 줄 남기기',kind:'cup'},
  {title:'음악은 원할 때',text:'함께 듣고 싶은 곡을 골라요. 음악 없이 저장해도 좋아요.',kind:'music'},
  {title:'확인하고 보관',text:'카드를 확인하고 저장해요. 내 기록에서 다시 볼 수 있어요.',to:'/coffee',action:'내 기록 보기',kind:'save'},
];
export default function JournalGuide({compact=false}){
 return <section className={`journal-guide${compact?' journal-guide-compact':''}`} aria-label="그림으로 보는 기록 방법">
  <h2>한 잔을 남기는 세 단계</h2>
  <ol>{steps.map((step,index)=><li key={step.kind}>
   <div className="journal-guide-picture"><img src={`${import.meta.env.BASE_URL}images/guide-${step.kind}.webp`} alt="" aria-hidden="true" loading="lazy" width="320" height="320"/><span aria-hidden="true">{index+1}</span></div>
   <h3><span className="sr-only">{index+1}단계. </span>{step.title}</h3><p>{step.text}</p>
   {step.to&&<Link to={step.to}>{step.action} →</Link>}
  </li>)}</ol>
  <p className="journal-guide-storage">기록은 이 브라우저에 보관돼요. 기기를 바꾸기 전 설정에서 백업해 주세요.</p>
 </section>;
}
