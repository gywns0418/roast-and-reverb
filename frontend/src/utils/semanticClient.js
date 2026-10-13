let worker=null,seq=0;const pending=new Map();
export function semanticEmbeddings(texts,onProgress=()=>{}) {
  if(!worker) {
    worker=new Worker(new URL("../workers/semanticWorker.js",import.meta.url),{type:"module"});
    worker.onmessage=({data})=>{const item=pending.get(data.id);if(!item)return;if(data.progress){item.progress(data.progress);return;}clearTimeout(item.timer);pending.delete(data.id);data.error?item.reject(new Error("의미 모델을 준비하지 못했습니다. 연결 상태를 확인하거나 기본 추천을 이용해 주세요.")):item.resolve(data.vectors);};
    worker.onerror=()=>{for(const item of pending.values()){clearTimeout(item.timer);item.reject(new Error("이 브라우저에서 의미 모델을 실행하지 못했습니다."));}pending.clear();worker?.terminate();worker=null;};
  }
  const id=++seq;
  return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);worker?.terminate();worker=null;for(const item of pending.values()){clearTimeout(item.timer);item.reject(new Error("의미 분석 시간이 초과되었습니다."));}pending.clear();reject(new Error("모델 준비가 오래 걸립니다. 다시 시도하거나 기본 추천을 이용해 주세요."));},240000);pending.set(id,{resolve,reject,progress:onProgress,timer});worker.postMessage({id,texts});});
}
