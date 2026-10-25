export function createSemanticClient({createWorker,timeoutMs=240000}={}) {
  let worker=null,seq=0;const pending=new Map();
  function retire(owner,message) {
    if(worker===owner)worker=null;
    owner.terminate();
    for(const [id,item] of pending)if(item.owner===owner){clearTimeout(item.timer);pending.delete(id);item.reject(new Error(message));}
  }
  return function embed(texts,onProgress=()=>{}) {
    if(!Array.isArray(texts)||!texts.length||texts.length>1100||texts.some(text=>typeof text!=='string'||text.length>6000))return Promise.reject(new Error('의미 분석 입력의 형식 또는 크기를 확인해 주세요.'));
    if(!worker) {
      const owner=createWorker?createWorker():new Worker(new URL('../workers/semanticWorker.js',import.meta.url),{type:'module'});
      worker=owner;
      owner.onmessage=({data})=>{const item=pending.get(data.id);if(!item||item.owner!==owner)return;if(data.progress){item.progress(data.progress);return;}clearTimeout(item.timer);pending.delete(data.id);data.error?item.reject(new Error('의미 모델을 준비하지 못했습니다. 연결 상태를 확인하거나 기본 추천을 이용해 주세요.')):item.resolve(data.vectors);};
      owner.onerror=()=>{if(worker!==owner)return;retire(owner,'이 브라우저에서 의미 모델을 실행하지 못했습니다.');};
    }
    const owner=worker,id=++seq;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>retire(owner,'모델 준비가 오래 걸립니다. 다시 시도하거나 기본 추천을 이용해 주세요.'),timeoutMs);
      pending.set(id,{resolve,reject,progress:onProgress,timer,owner});
      try{owner.postMessage({id,texts});}catch{retire(owner,'의미 분석 요청을 전달하지 못했습니다. 입력을 확인하고 다시 시도해 주세요.');}
    });
  };
}
export const semanticEmbeddings=createSemanticClient();
