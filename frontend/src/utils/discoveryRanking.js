import { analyzePairing } from "./pairingEngine.js";
export function cosine(a,b) {if(!Array.isArray(a)||!Array.isArray(b)||!a.length||a.length!==b.length)return 0;let dot=0,na=0,nb=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}return na&&nb?dot/Math.sqrt(na*nb):0;}
export function beanText(bean) {return [bean.name,...(bean.flavors || []),bean.tasteNote,bean.roast,bean.process].filter(Boolean).join(" · ").slice(0,480);}
export function musicText(music) {return [music.track,music.artist,music.genre,...(music.tags || []),music.memo].filter(Boolean).join(" · ").slice(0,480);}
export function situationHints(situation) {
  const value=String(situation||"").toLowerCase();const avoid=[];
  for(const [term,label] of [["재즈|jazz","jazz"],["록|rock","rock"],["피아노|piano","piano"],["보컬|vocal","vocal"],["팝|pop","pop"]])if(new RegExp(`(?:${term})[^,.。]{0,12}(?:말고|제외|싫|원하지|아닌)|(?:no|without|not)\\s+(?:${term})`).test(value))avoid.push(label);
  let cleaned=value.replace(/[^,.。]*(?:말고|제외|원하지)[^,.。]*?/g,"");
  if(!cleaned.trim())cleaned=value;
  const calm=/밤|조용|차분|고요|잠|독서|읽|휴식|쉬|calm|quiet/.test(cleaned),focus=/일할|일하는|업무|집중|공부|작업|focus|work/.test(cleaned),bright=/아침|산뜻|경쾌|기분 전환|활기|bright|upbeat/.test(cleaned);
  return {avoid,calm,focus,bright,decaf:/디카페인.*(?:원해|좋|만|마실)|카페인.*(?:피하|없이|없는)/.test(value)};
}
function contextScore(music,hints) {
  const text=[music.genre,...(music.tags||[]),music.memo].join(" ").toLowerCase();let score=0;
  if(hints.calm&&/ambient|앰비언트|차분|고요|calm|piano|피아노|acoustic|어쿠스틱/.test(text))score+=.15;
  if(hints.focus&&/instrumental|연주|보컬 없음|ambient|piano|피아노/.test(text))score+=.12;
  if(hints.bright&&/pop|팝|경쾌|upbeat|funk|펑크/.test(text))score+=.15;
  if(hints.avoid.some(term=>text.includes(term) || ({jazz:"재즈",rock:"록",piano:"피아노",vocal:"보컬",pop:"팝"}[term] && text.includes({jazz:"재즈",rock:"록",piano:"피아노",vocal:"보컬",pop:"팝"}[term]))))return null;
  return score;
}
export function rankDiscovery({beans,music,situation,vectors=null,model=null}) {
  const hints=situationHints(situation);const pairs=[];
  for(let i=0;i<beans.length;i++) {const bean=beans[i];if(bean.source==="owned"&&bean.status!=="held")continue;
    if(hints.decaf&&!/디카페인|decaf/i.test([bean.name,bean.process].join(" ")))continue;
    for(let j=0;j<music.length;j++){const song=music[j],boost=contextScore(song,hints);if(boost===null)continue;
      let analyzed=null;try{analyzed=analyzePairing({coffee:{...bean,memo:[...(bean.flavors || []),bean.tasteNote].filter(Boolean).join(", "),tasteNote:[...(bean.flavors || []),bean.tasteNote].filter(Boolean).join(", "),roastLevel:bean.roast},music:song},model);}catch{}
      const semantic=vectors ? .5*cosine(vectors[0],vectors[1+beans.length+j])+.2*cosine(vectors[0],vectors[1+i])+.3*cosine(vectors[1+i],vectors[1+beans.length+j]) : null;
      const score=(semantic ?? (analyzed?analyzed.pairingScore/100*.65:.25))+boost+(analyzed?.evidence.scoreKind==="개인 선호 추정"?analyzed.pairingScore/100*.08:0);
      pairs.push({id:`${bean.id}::${song.id}`,bean,music:song,score,semantic,analyzed,method:vectors?"다국어 의미 모델":"기본 특성 추천",metadataThin:!(song.genre || song.tags?.length || song.memo)});
    }
  }
  pairs.sort((a,b)=>b.score-a.score || a.id.localeCompare(b.id));if(!pairs.length)return [];
  const output=[];const usedMusic=new Set(),usedBeans=new Set();
  const picks=[{label:"취향 가까운 조합",choose:items=>items.find(item=>item.music.source==="record") || items[0]}, {label:"새로운 발견",choose:items=>items.find(item=>item.music.source!=="record") || items[0]}, {label:"다른 결의 조합",choose:items=>[...items].sort((a,b)=>Math.abs(a.score-output[0].score)-Math.abs(b.score-output[0].score)).at(-1)}];
  for(const pick of picks){let choices=pairs.filter(item=>!usedMusic.has(item.music.id));if(!choices.length)choices=pairs.filter(item=>!usedBeans.has(item.bean.id)&&!output.some(row=>row.id===item.id));if(!choices.length)break;
    const selected=pick.choose(choices);output.push({...selected,label:pick.label==="새로운 발견"&&selected.music.source==="record"?"익숙한 곡, 새로운 한 잔":pick.label});usedMusic.add(selected.music.id);usedBeans.add(selected.bean.id);
  }
  return output;
}
