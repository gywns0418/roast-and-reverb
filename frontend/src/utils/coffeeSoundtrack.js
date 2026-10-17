import {safeMusicUrl,musicSearchLink} from './musicCandidates.js';
import {validateSoundRecipe} from './soundStudio.js';

const text=(value,max=300)=>typeof value==='string'?value.trim().slice(0,max):'';
export function coffeeCandidate(coffee){
  return {id:'current-cup',name:coffee.beanName||'',roastery:coffee.roastery||'',origin:coffee.originCountry||'',roast:coffee.roastLevel||'',process:coffee.process||'',flavors:text(coffee.cupNotes,1200).split(/[,，]/).filter(Boolean),tasteNote:coffee.tasteNote||'',source:'draft'};
}
export function matchedSoundtrack(music,method='기본 특성 매칭'){
  if(!text(music?.track))throw new Error('곡 정보가 없는 음악입니다.');
  return {version:1,kind:'matched',track:text(music.track,200),artist:text(music.artist,200),channel:text(music.channel,200),genre:text(music.genre,200),url:safeMusicUrl(music.url)||musicSearchLink(music),metadataSource:text(music.metadataSource),method:text(method),listened:false};
}
export function generatedSoundtrack(recipe){
  const checked=validateSoundRecipe(recipe);
  return {version:1,kind:'generated',track:checked.title,artist:'R&R 기기 내 작곡',method:'규칙 기반 연주 제작',recipe:checked,listened:false};
}
export function readSoundtrack(value){
  if(!value||value.version!==1)return null;
  try{
    const checked=value.kind==='generated'?generatedSoundtrack(value.recipe):value.kind==='matched'?matchedSoundtrack(value,value.method):null;
    return checked?{...checked,listened:value.listened===true}:null;
  }catch{return null;}
}
export function soundtrackRecords(coffees){
  return coffees.flatMap(coffee=>{
    const song=readSoundtrack(coffee.brewDetails?.soundtrack);
    return song?[{id:`cup-${coffee.id}`,path:`/coffee/${coffee.id}`,listened:song.listened,date:coffee.date,track:song.track,artist:song.artist||song.channel,genre:song.genre,tags:[song.kind==='generated'?'만든 연주':'매칭한 음악',song.listened?'직접 들음':'감상 전'],memo:coffee.brewDetails?.momentNote||coffee.bean}]:[];
  });
}
