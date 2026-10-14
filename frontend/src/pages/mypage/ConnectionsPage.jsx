import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import PageShell from '../../components/common/PageShell.jsx';
import BeanFileConnection from '../../components/beans/BeanFileConnection.jsx';
import {monthlyCatalog} from '../../api/monthlyCatalog.js';
import {readDevice} from '../../store/discoveryStore.js';
const date=value=>value&&Number.isFinite(Date.parse(value))?new Date(value).toLocaleString('ko-KR'):'확인 시각 미기록';
export default function ConnectionsPage(){
  const [catalog,setCatalog]=useState([]),[errors,setErrors]=useState({}),[counts,setCounts]=useState({});
  useEffect(()=>{
    let live=true,flight=false;
    function device(){try{if(live){setCounts(Object.fromEntries(['beans','music','room-memories','sound-tracks'].map(key=>[key,readDevice(key).length])));setErrors(previous=>({...previous,device:''}));}}catch(err){if(live)setErrors(previous=>({...previous,device:err.message}));}}
    async function refresh(){if(flight||document.visibilityState==='hidden')return;flight=true;try{const items=await monthlyCatalog();if(live){setCatalog(items);setErrors(previous=>({...previous,catalog:''}));}}catch(err){if(live)setErrors(previous=>({...previous,catalog:`${err.message} 마지막으로 읽은 목록은 유지합니다.`}));}finally{flight=false;}}
    device();refresh();const timer=setInterval(refresh,900000);window.addEventListener('focus',refresh);window.addEventListener('rr-discovery-changed',device);
    return()=>{live=false;clearInterval(timer);window.removeEventListener('focus',refresh);window.removeEventListener('rr-discovery-changed',device);};
  },[]);
  const latest=catalog[0];
  return <PageShell title="내 자료의 연결 상태" eyebrow="LESS SETUP, MORE RITUAL" subtitle="한 번 연결한 자료는 다시 전달하지 않아도 됩니다.">
    {Object.entries(errors).filter(([,message])=>message).map(([key,message])=><p key={key} className="resource-error" role="alert">{message}</p>)}
    <BeanFileConnection/>
    <section className="panel" style={{marginTop:22}}><p className="eyebrow">PUBLIC SOURCES</p><h2>새 월픽은 공개 목록에서 발견합니다.</h2><p>지원 판매처의 당월 상품을 정기 작업이 확인합니다. 매번 링크나 원두 자료를 붙여넣을 필요가 없습니다. 이 화면은 방문·포커스·15분 간격으로 게시된 목록을 다시 확인합니다.</p><p>{latest?`${latest.month} · ${latest.roastery} · ${latest.items.length}개 원문 항목`:'게시된 월픽 목록을 확인하는 중…'}</p><p>재고·가격 원문 확인: {date(latest?.sourceCheckedAt)}<br/>향미 자료 확인: {date(latest?.detailsCheckedAt)}</p><Link className="ghost-button" to="/monthly-pick">현재 연결된 월픽 보기 ↗</Link></section>
    <section className="panel" style={{marginTop:22}}><p className="eyebrow">YOUR DEVICE, YOUR MEMORY</p><h2>기록에서 다음 시간을 이어갑니다.</h2><p>원두 {counts.beans??'—'}종 · 음악 후보 {counts.music??'—'}곡 · 감각 기억 {counts['room-memories']??'—'}개 · 사운드 {counts['sound-tracks']??'—'}곡</p><p>원두는 실제 연결 파일에서, 취향은 직접 남긴 기록과 감상에서 읽습니다. 소비량이나 청취 이력을 추측해서 만들지 않습니다.</p><div className="action-row"><Link className="primary-button" to="/ritual">나의 청음실</Link><Link className="ghost-button" to="/backup">내 자료 백업·복구</Link></div></section>
    <p className="model-note" style={{marginTop:18}}>파일 읽기 권한은 브라우저가 관리합니다. 최초 연결과 권한이 해제된 경우의 허용만 직접 필요합니다. 공개 서비스의 자료 갱신과 이 기기의 개인 파일 연결은 별개입니다.</p>
  </PageShell>;
}
