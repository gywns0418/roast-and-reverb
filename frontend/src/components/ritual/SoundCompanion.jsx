import {useEffect,useRef,useState} from 'react';
import {companionApi} from '../../api/companionApi.js';
import {soundMoods} from '../../utils/soundStudio.js';

const statusText={server_offline:'이 화면은 기기 모드입니다. AI 대화는 서버가 연결된 화면에서 사용할 수 있어요.',missing_key:'서버에 AI 키가 아직 연결되지 않았습니다.',quota_exhausted:'AI 크레딧이 소진됐습니다. 관리자가 잔액을 확인해야 합니다.'};
export default function SoundCompanion({settings,onApply,disabled}) {
  const [status,setStatus]=useState(null),[error,setError]=useState(''),[text,setText]=useState(''),[turns,setTurns]=useState([]),[proposal,setProposal]=useState(null),[sending,setSending]=useState(false);
  const alive=useRef(true),controller=useRef(null),flight=useRef(false);
  useEffect(()=>{alive.current=true;companionApi.status().then(result=>{if(alive.current)setStatus(result);}).catch(err=>{if(alive.current){setError(err.message);setStatus({available:false,state:'connection_failed'});}});return()=>{alive.current=false;controller.current?.abort();};},[]);
  async function send(event) {
    event.preventDefault();if(flight.current||!status?.available||!text.trim())return;
    flight.current=true;setSending(true);setError('');setProposal(null);
    const message=text.trim(),history=turns.slice(-8).map(({role,content})=>({role,content}));controller.current=new AbortController();
    try {
      const answer=await companionApi.chat({message,settings,history},controller.current.signal);
      if(!alive.current)return;
      setTurns(rows=>[...rows.slice(-6),{role:'user',content:message},{role:'assistant',content:answer.reply}]);setText('');setProposal(answer.settings);
    } catch(err) {if(alive.current){setError(err.message);companionApi.status().then(result=>{if(alive.current)setStatus(result);}).catch(()=>{});}}
    finally {flight.current=false;if(alive.current)setSending(false);}
  }
  return <section className="panel sound-conversation sound-ai" aria-label="AI 사운드 대화">
    <div className="sound-conversation-heading"><h3>오늘은 어떤 마음으로 듣나요?</h3><span>AI 대화</span></div>
    <p>“생각이 많아서, 조용히 숨을 고를 음악이 필요해.” 당신의 말에서 다음 소리의 결을 함께 찾습니다.</p>
    <small>보내는 문장·최근 대화 8개·현재 음악 설정만 OpenAI로 전송합니다. 원두 파일과 일지는 전송하지 않습니다. 대화는 이 화면을 떠나면 지워집니다.</small>
    {!status&&<p role="status">AI 서버 연결을 확인하는 중…</p>}
    {status&&!status.available&&<p role="status">{statusText[status.state]||'지금 AI 대화를 사용할 수 없습니다.'}</p>}
    {error&&<p role="alert" className="resource-error">{error}</p>}
    <div className="sound-ai-messages" role="log" aria-live="polite" aria-label="AI와 나눈 대화">{turns.map((turn,i)=><div key={i} className={`sound-ai-${turn.role}`}><b>{turn.role==='user'?'나':'R&R'}</b><p>{turn.content}</p></div>)}</div>
    <form onSubmit={send}><label className="sr-only" htmlFor="ai-sound-message">AI에게 전할 말</label><textarea id="ai-sound-message" maxLength={1200} rows={3} value={text} disabled={!status?.available||sending} onChange={e=>setText(e.target.value)} placeholder="지금 마음이나 듣고 싶은 분위기를 적어 주세요"/><button type="submit" disabled={!status?.available||sending||!text.trim()}>{sending?'답변 중…':'보내기'}</button></form>
    {proposal&&<div className="sound-ai-proposal"><p>{soundMoods[proposal.mood]?.label} · {proposal.bpm} BPM · 여운 {Math.round(proposal.space*100)}%</p><button className="primary-button" disabled={disabled||sending} onClick={()=>{onApply(proposal);setProposal(null);}}>이 제안으로 연주 만들기</button></div>}
    <small>AI는 대화와 음악 설정을 제안하고, 실제 연주는 기기의 합성 엔진이 만듭니다.</small>
  </section>;
}
