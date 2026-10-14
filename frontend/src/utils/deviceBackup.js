import {DIARY_KEY,validateDiary} from './diaryStorage.js';
import {validateBeansFile} from './beanInventory.js';
import {roomMemory,roomProfile,roomPair} from './ritualLogic.js';
import {validateSoundRecipe,soundSettings} from './soundStudio.js';

export const backupLabels={diary:'커피·음악 일지와 컬렉션',beans:'내 원두',music:'음악 후보', 'room-profile':'청음실 취향','room-memories':'감각의 기억','room-trash':'기억 보관함','room-active':'진행 중인 청음 시간','sound-tracks':'사운드 선반','sound-preference':'사운드 기본 설정',favorites:'월픽 관심 원두',preferences:'페어링 선호'};
export function backupKeys(scope='trial') {
  return Object.fromEntries(Object.keys(backupLabels).map(name=>[name,name==='diary'?DIARY_KEY:name==='favorites'?'rr-monthly-favorites-v1':name==='preferences'?'rr-pairing-preferences-v1':`rr-discovery-${name}-v1-${encodeURIComponent(scope)}`]));
}
function safeTree(value,depth=0) {
  if(depth>15)throw new Error('백업 자료가 너무 복잡합니다.');
  if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){if(['__proto__','constructor','prototype','password','token','apiKey','secret'].includes(key))throw new Error('인증 정보 또는 지원하지 않는 필드가 포함된 백업입니다.');safeTree(item,depth+1);}
}
function checkedSection(name,value) {
  safeTree(value);
  if(name==='diary')return validateDiary(value);
  if(name==='preferences'){if(!value||!Array.isArray(value.weights)||value.weights.length!==5||!value.weights.every(Number.isFinite)||!Number.isInteger(value.samples)||value.samples<0)throw new Error('페어링 선호 자료가 올바르지 않습니다.');return value;}
  if(!Array.isArray(value)||value.length>500)throw new Error(`${backupLabels[name]} 자료 형식이 올바르지 않습니다.`);
  if(name==='beans'){validateBeansFile({schemaVersion:1,beans:value});return value;}
  if(name==='music'&&(value.length>250||value.some(row=>!row||typeof row.id!=='string'||typeof row.track!=='string'||!row.track.trim())))throw new Error('음악 후보 자료가 올바르지 않습니다.');
  if(name==='room-memories'||name==='room-trash'){if(value.length>(name==='room-memories'?80:160))throw new Error('기억 저장 한도를 넘습니다.');return value.map(roomMemory);}
  if(name==='room-profile'){if(value.length>1)throw new Error('취향 자료가 올바르지 않습니다.');return value.map(roomProfile);}
  if(name==='room-active'){if(value.length>1)throw new Error('진행 중인 세션 자료가 올바르지 않습니다.');value.forEach(roomPair);}
  if(name==='sound-tracks'){if(value.length>24)throw new Error('사운드 저장 한도를 넘습니다.');return value.map(validateSoundRecipe);}
  if(name==='sound-preference'){if(value.length>1)throw new Error('사운드 설정 자료가 올바르지 않습니다.');return value.map(soundSettings);}
  if(name==='favorites'&&value.some(row=>typeof row!=='string'&&typeof row!=='number'))throw new Error('관심 원두 자료가 올바르지 않습니다.');
  return value;
}
export function parseDeviceBackup(value) {
  if(value?.format!=='roast-reverb-device'||value.version!==1||!value.sections||typeof value.sections!=='object'||Array.isArray(value.sections))throw new Error('R&R 기기 백업 파일을 선택해 주세요.');
  const result={};
  for(const [name,section] of Object.entries(value.sections)){if(!Object.hasOwn(backupLabels,name))throw new Error('지원하지 않는 백업 항목이 있습니다.');result[name]=checkedSection(name,section);}
  if(!Object.keys(result).length)throw new Error('복구할 자료가 없는 백업입니다.');
  return result;
}
export function collectDeviceBackup(storage,scope='trial',includeDiary=true) {
  const sections={};
  for(const [name,key] of Object.entries(backupKeys(scope))){if(name==='diary'&&!includeDiary)continue;const raw=storage.getItem(key);if(raw!==null)sections[name]=checkedSection(name,JSON.parse(raw));}
  return {format:'roast-reverb-device',version:1,exportedAt:new Date().toISOString(),sections};
}
export function restoreDeviceBackup(storage,backup,scope='trial',includeDiary=true) {
  const sections=parseDeviceBackup(backup),keys=backupKeys(scope);
  if(!includeDiary&&Object.hasOwn(sections,'diary'))throw new Error('서버 모드에서 체험 일지를 복원할 수 없습니다. 서버 기록은 변경하지 않습니다.');
  const previous=Object.entries(sections).map(([name,value])=>({key:keys[name],raw:storage.getItem(keys[name]),next:JSON.stringify(value)}));
  const written=[];
  try {for(const row of previous){storage.setItem(row.key,row.next);written.push(row);}}
  catch(error){let failed=false;for(const row of written.reverse())try{if(row.raw===null)storage.removeItem(row.key);else storage.setItem(row.key,row.raw);}catch{failed=true;}throw new Error(failed?'복원과 이전 자료 되돌리기에 실패했습니다. 보관한 백업을 유지하고 저장 공간을 확인해 주세요.':'복원할 저장 공간이 부족하거나 저장이 차단됐습니다. 이전 자료를 유지했습니다.');}
  return Object.keys(sections).length;
}
