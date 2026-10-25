import {listeningGuides} from '../data/listeningGuides.js';
export const journeyGoals={coffee:'커피의 맛을 더 알아가고 싶어요',rest:'음악과 함께 쉬는 시간을 만들고 싶어요',pairing:'나에게 맞는 조합을 찾고 싶어요'};
export function journeyProfile(value={}) {return {goal:Object.hasOwn(journeyGoals,value.goal)?value.goal:'pairing',name:typeof value.name==='string'?value.name.trim().slice(0,32):''};}
export function journeyEntry(value) {
  if(!value||typeof value.id!=='string'||!value.id||value.id.length>100||!listeningGuides.some(g=>g.id===value.guideId)||!Number.isFinite(Date.parse(value.savedAt))||!Array.isArray(value.notes)||value.notes.length!==3||value.notes.some(x=>typeof x!=='string'||x.length>1200)||!value.notes.some(x=>x.trim()))throw new Error('발견 기록의 형식을 확인해 주세요.');
  return {id:value.id,guideId:value.guideId,savedAt:new Date(value.savedAt).toISOString(),notes:value.notes.map(x=>x.trim()),practiced:value.practiced===true};
}
export function journeyProgress(entries,goal='pairing') {
  const done=new Set(entries.filter(row=>row.practiced).map(row=>row.guideId));
  const order=goal==='coffee'?['first-note','cooling','brightness','sweetness','body-rhythm','one-change','my-language']:goal==='rest'?['first-note','body-rhythm','cooling','sweetness','brightness','one-change','my-language']:listeningGuides.map(g=>g.id);
  return {completed:listeningGuides.filter(g=>done.has(g.id)).length,next:listeningGuides.find(g=>g.id===(order.find(id=>!done.has(id))||'my-language'))};
}
