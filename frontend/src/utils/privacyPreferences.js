export const PRIVACY_KEY='rr-privacy-choice-v1';
export function readPrivacy(storage){try {const value=JSON.parse((storage??globalThis.localStorage).getItem(PRIVACY_KEY));return value?.version===1?{version:1,externalMedia:value.externalMedia===true}:null;}catch{return null;}}
export function savePrivacy(externalMedia,storage=localStorage){const value={version:1,externalMedia:externalMedia===true};storage.setItem(PRIVACY_KEY,JSON.stringify(value));window.dispatchEvent(new Event('rr-privacy-changed'));return value;}
export function openPrivacy(){window.dispatchEvent(new Event('rr-open-privacy'));}
export function privacyDataKeys(storage,scope,includeDiary=true){
 if(typeof scope!=='string'||!scope)throw new Error('자료를 삭제할 기록장을 확인해 주세요.');
 const shared=new Set(['roast-reverb-log-selection','rr-monthly-favorites-v1','rr-pairing-preferences-v1']);
 if(includeDiary)shared.add('roast-reverb-demo-v1');
 const suffix='-v1-'+encodeURIComponent(scope),keys=[];
 for(let i=0;i<storage.length;i++){const key=storage.key(i);if(shared.has(key)||key?.startsWith('rr-discovery-')&&key.endsWith(suffix))keys.push(key);}
 return keys;
}
