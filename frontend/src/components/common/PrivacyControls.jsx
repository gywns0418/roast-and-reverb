import {useEffect,useRef,useState} from 'react';
import {readPrivacy,savePrivacy,openPrivacy,privacyDataKeys} from '../../utils/privacyPreferences.js';
import {deviceScope} from '../../store/discoveryStore.js';
import {disconnectBeanFile} from '../../store/beanFileStore.js';
const policyLinks=[['privacy','개인정보처리방침'],['terms','이용약관'],['refund','환불정책'],['cookies','쿠키정책'],['rights','이미지·음악·글꼴 출처']];
export default function PrivacyControls(){
  const [choice,setChoice]=useState(()=>readPrivacy()),[open,setOpen]=useState(false),[media,setMedia]=useState(false),[ack,setAck]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  const dialog=useRef(null),previous=useRef(null);
  useEffect(()=>{const show=()=>{previous.current=document.activeElement;setMedia(readPrivacy()?.externalMedia===true);setAck(false);setMessage('');setOpen(true);};const update=()=>setChoice(readPrivacy());window.addEventListener('rr-open-privacy',show);window.addEventListener('rr-privacy-changed',update);window.addEventListener('storage',update);return()=>{window.removeEventListener('rr-open-privacy',show);window.removeEventListener('rr-privacy-changed',update);window.removeEventListener('storage',update);};},[]);
  useEffect(()=>{if(open){dialog.current?.showModal();}else if(dialog.current?.open){dialog.current.close();previous.current?.focus?.();}},[open]);
  function save(value){try{savePrivacy(value);setOpen(false);setMessage('');}catch{setMessage('선택을 저장하지 못했습니다. 브라우저 저장 설정을 확인해 주세요.');}}
  async function erase(){if(!ack||busy)return;setBusy(true);try{
    const scope=deviceScope();
    const keys=privacyDataKeys(localStorage,scope,import.meta.env.VITE_USE_REAL_API!=='true');
    await disconnectBeanFile();
    if(deviceScope()!==scope)throw new Error('계정이 바뀌어 삭제를 중단했습니다. 현재 계정을 확인해 주세요.');
    for(const key of keys)localStorage.removeItem(key);
    localStorage.removeItem('roast-reverb-log-selection');
    window.dispatchEvent(new Event('rr-discovery-changed'));
    window.location.reload();
  }catch(e){setMessage(e.message||'기기 자료를 삭제하지 못했습니다.');setBusy(false);}}
  const requestUrl='mailto:gywns7967@gmail.com?subject='+encodeURIComponent('Roast & Reverb 개인정보 삭제·처리정지 요청')+'&body='+encodeURIComponent('요청 항목: 계정 / 서버 기록 / Google 연결 정보 / 열람·정정 / 처리정지 (선택해 주세요)\n가입 이메일: \n요청 내용: \n비밀번호와 인증 토큰은 보내지 마세요.');
  return <>
    <footer className="rr-policy-footer" aria-label="정책 및 개인정보 관리">{policyLinks.map(([file,label])=><a key={file} href={`${import.meta.env.BASE_URL}${file}.html`}>{label}</a>)}<button type="button" onClick={openPrivacy}>쿠키 설정·개인정보 삭제 요청</button><span>운영 문의: <a href="mailto:gywns7967@gmail.com">gywns7967@gmail.com</a></span></footer>
    {!choice&&<section className="rr-cookie-banner" aria-label="쿠키 및 기기 저장 안내"><h2>쿠키와 외부 콘텐츠</h2><p>기록·로그인 유지에 필요한 기기 저장을 사용합니다. 광고·통계 추적기는 사용하지 않습니다. YouTube는 허용 후 재생할 때만 연결되며 IP·기기 정보가 전달될 수 있습니다.</p><div><button type="button" onClick={()=>save(false)}>필수만 사용</button><button type="button" onClick={openPrivacy}>선택 설정</button></div>{message&&<p role="alert">{message}</p>}</section>}
    <dialog ref={dialog} className="rr-privacy-dialog" aria-labelledby="rr-privacy-title" onCancel={e=>{if(busy)e.preventDefault();else setOpen(false);}} onClose={()=>setOpen(false)}>
      <h2 id="rr-privacy-title">개인정보와 쿠키 설정</h2><button type="button" disabled={busy} onClick={()=>setOpen(false)}>닫기</button>
      <p>필수 저장: 기록·초안·인증·이 선택의 보관. 브라우저에서 사이트 데이터를 차단하면 저장 기능을 사용할 수 없습니다.</p>
      <label><input type="checkbox" checked={media} onChange={e=>setMedia(e.target.checked)}/> YouTube 외부 재생 허용 (선택)</label><p>Google·YouTube에 IP·브라우저·재생 정보가 전달되고 외부 쿠키가 쓰일 수 있습니다. 거부해도 커피 기록은 이용할 수 있어요. 철회하면 열려 있는 플레이어가 닫힙니다. 외부 서비스에 이미 전달된 정보는 해당 서비스에서도 관리해 주세요.</p>
      <div className="rr-privacy-actions"><button type="button" disabled={busy} onClick={()=>save(false)}>필수만 사용</button><button type="button" disabled={busy} onClick={()=>save(media)}>선택 저장</button></div>
      <h3>개인정보 열람·정정·삭제 요청</h3><p>계정과 서버 기록은 운영자에게 요청할 수 있습니다. 아래 링크는 메일 작성 화면을 열며, 직접 보내야 요청이 접수됩니다. 비밀번호를 보내지 마세요. 본인 확인 후 처리 결과와 보관 사유가 있다면 안내합니다.</p><a href={requestUrl}>삭제·권리 행사 요청 메일 작성</a><p>메일 앱이 없다면 gywns7967@gmail.com으로 요청해 주세요.</p>
      <h3>현재 기기의 자료 삭제</h3><p>현재 기록장의 기기 자료와 공통 관심 원두·선호 설정을 지웁니다. 다른 계정의 기기 자료, 서버 계정·기록, 모델 캐시, 로그인 정보, 내려받은 백업과 원본 파일은 별도로 관리해야 합니다. 모든 사이트 데이터와 캐시는 브라우저 설정에서 지울 수 있습니다. 먼저 설정의 백업·복구에서 백업하세요.</p><label><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/> 삭제 범위를 확인했으며 되돌릴 수 없음을 이해했습니다.</label><p><button type="button" disabled={!ack||busy} onClick={erase}>{busy?'삭제 중…':'확인한 기기 자료 삭제'}</button></p>
      {message&&<p role="alert">{message}</p>}
    </dialog>
  </>;
}
