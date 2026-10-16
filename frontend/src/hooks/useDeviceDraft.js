import {useRef,useState} from 'react';
import {readDevice,saveDevice,deviceScope} from '../store/discoveryStore.js';
import {validateDraft} from '../utils/draft.js';
export function useDeviceDraft(kind,createInitial){
  const [initial]=useState(()=>{const fallback=typeof createInitial==='function'?createInitial():createInitial;try{const scope=deviceScope();const previous=readDevice(kind)[0];return {scope,value:previous?validateDraft(previous,kind).value:fallback,error:'',restored:!!previous,fallback};}catch(error){return {value:fallback,error:error.message,restored:false,fallback};}});
  const [value,setValue]=useState(initial.value),[status,setStatus]=useState(initial.error?`초안을 읽지 못했습니다. ${initial.error}`:initial.restored?'이 기기에 남겨 둔 초안을 이어서 작성합니다.':''),current=useRef(initial.value);
  function update(next){const resolved=typeof next==='function'?next(current.current):next;current.current=resolved;setValue(resolved);try{if(deviceScope()!==initial.scope)throw new Error('계정이 바뀌었습니다. 이 화면을 다시 열어 주세요.');if(initial.error)throw new Error('기존 초안을 보존하기 위해 저장을 멈췄습니다. 백업·복구에서 확인해 주세요.');saveDevice(kind,[validateDraft({version:1,updatedAt:new Date().toISOString(),value:resolved},kind)]);setStatus('초안을 이 기기에 저장했어요. 다른 화면에 다녀와도 이어서 쓸 수 있습니다.');}catch(error){setStatus(`초안 저장 실패: ${error.message} 화면의 입력은 유지됩니다.`);}}
  function clear(){try{if(initial.error||deviceScope()!==initial.scope)return false;saveDevice(kind,[]);return true;}catch(error){setStatus(`저장된 초안을 지우지 못했습니다. ${error.message}`);return false;}}
  function discard(){if(!window.confirm('이 작성 화면의 초안을 지우고 새로 시작할까요?'))return;if(clear()){current.current=initial.fallback;setValue(initial.fallback);setStatus('초안을 비우고 새로 시작합니다.');}}
  return [value,update,{status,clear,discard}];
}
