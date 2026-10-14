import { parseBeansMarkdown, mergeBeans } from '../utils/beanInventory.js';
import { deviceScope, readDevice, saveDevice } from './discoveryStore.js';
const subscribers=new Set();let current={phase:'idle',name:'',checkedAt:'',message:''};let flight=null;let epoch=0;
const supported=()=>typeof window.showOpenFilePicker==='function' && !!window.indexedDB;
function emit(value){current={...current,...value};for(const fn of subscribers)fn(current);}
export function subscribeBeanFile(fn){subscribers.add(fn);fn(current);return()=>subscribers.delete(fn);}
function database(){return new Promise((resolve,reject)=>{const request=indexedDB.open('rr-private-bean-files',1);request.onupgradeneeded=()=>request.result.createObjectStore('links');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('파일 연결 저장소를 열지 못했습니다.'));});}
async function record(scope,value,remove=false){const db=await database();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('links',value!==undefined||remove?'readwrite':'readonly');const store=tx.objectStore('links');const req=remove?store.delete(scope):value!==undefined?store.put(value,scope):store.get(scope);let result;req.onsuccess=()=>{result=req.result;};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(new Error('파일 연결을 저장하지 못했습니다.'));tx.onabort=()=>reject(new Error('파일 연결 저장이 중단되었습니다.'));});}finally{db.close();}}
export function reconcileLinkedBeans(previous,incoming,oldIds=[]){const nextIds=new Set(incoming.map(bean=>bean.id));const old=new Set(oldIds);const retained=previous.map(bean=>old.has(bean.id)&&!nextIds.has(bean.id)?{...bean,status:'unknown',state:'연결 원본에서 제외됨',fileMissing:true}:bean);return mergeBeans(retained,incoming.map(bean=>({...bean,fileMissing:false})));}
export async function readLinkedBeanFile(link){
 if(await link.handle.queryPermission({mode:'read'})!=='granted')return {permission:false};
 const file=await link.handle.getFile();if(file.size>1000000)throw new Error('연결 파일은 1MB 이하여야 합니다. 기존 원두는 유지했습니다.');
 const content=await file.text();const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(content)))].map(x=>x.toString(16).padStart(2,'0')).join('');
 return {permission:true,hash,incoming:hash===link.hash?null:parseBeansMarkdown(content)};
}
async function synchronize(scope,link,version){
 const snapshot=await readLinkedBeanFile(link);
 if(scope!==deviceScope()||version!==epoch)return;
 if(!snapshot.permission){emit({phase:'permission',name:link.name,message:'파일 읽기 권한을 다시 허용해 주세요. 기존 원두는 유지합니다.'});return;}
 if(scope!==deviceScope()||version!==epoch)return;
 if(snapshot.incoming){saveDevice('beans',reconcileLinkedBeans(readDevice('beans'),snapshot.incoming,link.ids));link={...link,hash:snapshot.hash,ids:snapshot.incoming.map(bean=>bean.id)};}
 link.checkedAt=new Date().toISOString();await record(scope,link);emit({phase:'connected',name:link.name,checkedAt:link.checkedAt,message:'원본을 읽어 최신 원두를 반영했습니다.'});
}
export async function checkBeanFile(){if(flight)return flight;flight=(async()=>{try{if(!supported()){emit({phase:'unsupported',message:'이 브라우저는 지속 파일 연결을 지원하지 않습니다. 파일 가져오기를 사용할 수 있어요.'});return;}const scope=deviceScope();const version=epoch;const link=await record(scope);if(!link){emit({phase:'idle',name:'',checkedAt:'',message:''});return;}await synchronize(scope,link,version);}catch(error){emit({phase:'error',message:error.name==='NotFoundError'?'연결 파일을 찾지 못했습니다. 파일 위치를 확인하거나 다시 연결해 주세요. 기존 원두는 유지합니다.':error.message || '원본을 읽지 못했습니다. 기존 원두는 유지합니다.'});}finally{flight=null;}})();return flight;}
export async function connectBeanFile(){
 if(!supported())throw new Error('Chrome 또는 Edge에서 파일 연결을 사용할 수 있습니다.');
 const scope=deviceScope();const [handle]=await window.showOpenFilePicker({multiple:false,types:[{description:'원두 Markdown',accept:{'text/markdown':['.md']}}]});
 const file=await handle.getFile();if(file.size>1000000)throw new Error('1MB 이하의 원두 파일을 선택해 주세요.');
 const content=await file.text();parseBeansMarkdown(content);if(scope!==deviceScope())throw new Error("로그인 계정이 변경되어 연결을 중단했습니다.");const old=await record(scope);const link={handle,name:file.name,ids:old?.ids||[],hash:'',checkedAt:''};epoch++;await record(scope,link);if(flight)await flight;await checkBeanFile();
}
export async function renewBeanPermission(){const scope=deviceScope();const link=await record(scope);if(!link)throw new Error('연결한 파일이 없습니다.');if(await link.handle.requestPermission({mode:'read'})!=='granted'){emit({phase:'permission',message:'읽기 권한이 허용되지 않았습니다. 기존 원두는 유지합니다.'});return;}await checkBeanFile();}
export async function disconnectBeanFile(){epoch++;await record(deviceScope(),undefined,true);emit({phase:'idle',name:'',checkedAt:'',message:'파일 연결을 해제했습니다. 저장한 원두와 원본 파일은 그대로입니다.'});}
export function watchBeanFile(){checkBeanFile();const timer=setInterval(()=>{if(document.visibilityState==='visible')checkBeanFile();},15000);const focus=()=>checkBeanFile();window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);return()=>{clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus);};}
