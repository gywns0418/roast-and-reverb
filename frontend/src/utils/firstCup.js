import {coffeePayload} from './brewDetails.js';
import {readSoundtrack} from './coffeeSoundtrack.js';
export const firstCupExamples=['오늘 커피는 고소하고 끝에 초콜릿 맛이 남았어.','산미가 조금 낯설었는데 식으니까 달게 느껴졌어.','무슨 원두인지는 모르지만 따뜻해서 좋았어.'];
export function firstCupPayload({note,beanName='',roastery='',brewMethod='',tastes=[],soundtrack=null},date=new Date().toLocaleDateString('sv-SE')){
 const original=String(note||'').trim();if(!original||original.length>2000)throw Error('오늘의 커피를 1~2000자로 남겨 주세요.');
 return coffeePayload({beanName:beanName.trim().slice(0,120)||'원두 미기록',roastery:roastery.trim().slice(0,100),brewMethod:brewMethod.trim().slice(0,60),drinkDate:date,tasteNote:tastes.filter(x=>typeof x==='string'&&original.includes(x)).join(', ').slice(0,500),memo:original,brewDetails:{quickNote:true,momentNote:original,...(readSoundtrack(soundtrack)?{soundtrack:readSoundtrack(soundtrack)}:{})}});
}
export function literalCupFields(value,note){
 if(!value||typeof value!=='object')throw Error('정리된 문장을 확인하지 못했어요. 입력한 문장은 그대로 남아 있어요.');
 const literal=(text,max)=>typeof text==='string'&&text.length<=max&&(!text||note.includes(text))?text:'';
 return {beanName:literal(value.beanName,120),roastery:literal(value.roastery,100),brewMethod:literal(value.brewMethod,60),tastes:Array.isArray(value.tastes)?value.tastes.map(x=>literal(x,80)).filter(Boolean).slice(0,8):[]};
}
export function quickDraftKey(scope){return `rr-discovery-draft-first-cup-v1-${encodeURIComponent(scope)}`;}
