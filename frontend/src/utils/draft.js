import {listeningGuides} from '../data/listeningGuides.js';
export function validateDraft(row,kind='') {
  if(!row||row.version!==1||!Number.isFinite(Date.parse(row.updatedAt))||!row.value||typeof row.value!=='object'||Array.isArray(row.value)||JSON.stringify(row.value).length>50000)throw new Error('저장된 초안의 형식을 확인해 주세요.');
  function check(value,depth=0){if(depth>10)throw new Error('초안의 구조가 너무 복잡합니다.');if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){if(['__proto__','prototype','constructor','token','password','apiKey','secret'].includes(key))throw new Error('초안에 저장할 수 없는 정보입니다.');check(item,depth+1);}}
  check(row.value);
  const value=row.value;
  const required=kind==='draft-coffee'?['beanName','memo','drinkDate']:kind==='draft-music'?['trackName','artistName','memo','listenedDate']:[];
  if(required.some(key=>typeof value[key]!=='string'))throw new Error('초안에 필요한 입력 항목이 없습니다.');
  if(kind==='draft-journey'&&(!listeningGuides.some(g=>g.id===value.guideId)||!Array.isArray(value.notes)||value.notes.length!==3||value.notes.some(x=>typeof x!=='string'||x.length>1200)||typeof value.practiced!=='boolean'))throw new Error('발견 노트 초안을 읽지 못했습니다.');
  return row;
}
