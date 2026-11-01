import {analyzePairing,readPreferences} from '../utils/pairingEngine.js';
import {organizeCup} from '../utils/localCompanion.js';
import {DIARY_KEY,validateDiary} from '../utils/diaryStorage.js';
const today = new Date().toLocaleDateString('sv-SE');

let coffeeSeq=1,musicSeq=1,pairingSeq=1,collectionSeq=1;
const coffeeLogs=[],musicLogs=[],pairings=[],collections=[];
function bodyOf(options = {}) {
  if (!options.body) return {};
  try {
    return JSON.parse(options.body);
  } catch {
    return {};
  }
}

function pathOnly(path) {
  return path.split("?")[0];
}

function findCoffee(id) {
  const item=coffeeLogs.find((item) => String(item.coffeeLogId) === String(id));
  if(!item)throw new Error('커피 기록을 찾을 수 없습니다.');return item;
}

function findMusic(id) {
  const item=musicLogs.find((item) => String(item.musicLogId) === String(id));
  if(!item)throw new Error('음악 기록을 찾을 수 없습니다.');return item;
}

function enrichPairing(pairing) {
  if(!pairing)return null;
  const coffee = coffeeLogs.find(row=>row.coffeeLogId===pairing.coffeeLogId)||{beanName:'삭제된 커피 기록'};
  const music = musicLogs.find(row=>row.musicLogId===pairing.musicLogId)||{trackName:'삭제된 음악 기록'};
  return {
    ...pairing,
    beanName: coffee.beanName,
    brewMethod: coffee.brewMethod,
    drinkDate: coffee.drinkDate,
    trackName: music.trackName,
    artistName: music.artistName,
    albumName: music.albumName,
    listenedDate: music.listenedDate
  };
}

function createCoffee(payload) {
  const item = {
    coffeeLogId: coffeeSeq++,
    memberId: 1,
    beanName: payload.beanName || "오늘의 커피",
    roastery: payload.roastery || "",
    originCountry: payload.originCountry || "",
    region: payload.region || "",
    process: payload.process || "",
    brewDetails: payload.brewDetails || {},
    waterTemp: payload.waterTemp ?? null,
    grindSize: payload.grindSize || "",
    brewTime: payload.brewTime ?? null,
    roastLevel: payload.roastLevel || "",
    brewMethod: payload.brewMethod || "",
    tasteNote: payload.tasteNote || payload.memo || "",
    acidity: payload.acidity ?? null,
    sweetness: payload.sweetness ?? null,
    bitterness: payload.bitterness ?? null,
    body: payload.body ?? null,
    aroma: payload.aroma ?? null,
    memo: payload.memo || payload.tasteNote || "",
    drinkDate: payload.drinkDate || today
  };
  coffeeLogs.unshift(item);
  return item;
}

function createMusic(payload) {
  const item = {
    musicLogId: musicSeq++,
    memberId: 1,
    trackName: payload.trackName || "Untitled Track",
    artistName: payload.artistName || "Unknown Artist",
    albumName: payload.albumName || "",
    genre: payload.genre || "",
    tags: payload.tags || "",
    memo: payload.memo || "",
    listenedDate: payload.listenedDate || today
  };
  musicLogs.unshift(item);
  return item;
}

function createCollection(payload) {
  const item = {
    collectionId: collectionSeq++,
    title: payload.title || "Untitled",
    artistName: payload.artistName || payload.artist || "Unknown Artist",
    format: payload.format || "LP",
    pairingScore: Number(payload.pairingScore ?? payload.score ?? 0),
    note: payload.note || ""
  };
  collections.unshift(item);
  return item;
}

function createPairing(payload) {
  findCoffee(payload.coffeeLogId);findMusic(payload.musicLogId);
  const item = {
    pairingId: pairingSeq++,
    memberId: 1,
    coffeeLogId: payload.coffeeLogId,
    musicLogId: payload.musicLogId,
    moodSummary: payload.moodSummary || "조용히 이어지는 페어링",
    moodTags: payload.moodTags || "차분함, 균형감",
    pairingScore: payload.pairingScore == null ? null : Number(payload.pairingScore),
    pairingText: payload.pairingText || "커피의 질감과 음악의 무드가 자연스럽게 이어집니다.",
    aiReason: payload.aiReason || "사용자가 직접 남긴 페어링입니다.",
    createdAt: new Date().toISOString()
  };
  pairings.unshift(item);
  return enrichPairing(item);
}

async function dispatchRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const route = pathOnly(path);
  const payload = bodyOf(options);

  await new Promise((resolve) => setTimeout(resolve, 120));

  if(route.startsWith('/auth/')||route==='/members/me')throw new Error('GitHub 기록장은 가입 없이 사용합니다. 계정과 비밀번호를 수집하지 않습니다.');
  if (route === "/coffee" && method === "GET") return coffeeLogs.slice().sort((a,b)=>b.drinkDate.localeCompare(a.drinkDate));
  if (route === "/coffee" && method === "POST") return createCoffee(payload);
  if (route.startsWith("/coffee/") && route !== "/coffee/calendar" && route !== "/coffee/statistics") {
    const id = route.split("/")[2];
    if (method !== "GET") throw Error("유효한 커피 기록 번호가 필요합니다.");
    return findCoffee(id);
  }
  if (route === "/coffee/calendar") return coffeeLogs.map((item) => ({ drinkDate: item.drinkDate, logCount: 1 }));
  if (route === "/coffee/statistics") return Object.fromEntries([['totalCount',coffeeLogs.length],...['Acidity','Sweetness','Bitterness','Body','Aroma'].map(name=>{const values=coffeeLogs.map(x=>x[name.toLowerCase()]).filter(x=>typeof x==='number'&&Number.isFinite(x));return ['avg'+name,values.length?values.reduce((a,b)=>a+b,0)/values.length:null];})]);

  if (route === "/music" && method === "GET") return musicLogs;
  if (route === "/music" && method === "POST") return createMusic(payload);
  if (route.startsWith("/music/") && route !== "/music/tags/recent") {
    const id = route.split("/")[2];
    if (method !== "GET") throw Error("유효한 음악 기록 번호가 필요합니다.");
    return findMusic(id);
  }
  if (route === "/music/tags/recent") return Object.entries(musicLogs.reduce((counts,row)=>{for(const tag of String(row.tags||'').split(',').map(x=>x.trim()).filter(Boolean))counts[tag]=(counts[tag]||0)+1;return counts;},{})).map(([tags,usageCount])=>({tags,usageCount}));

  if (route === "/pairing" && method === "GET") return pairings.map(enrichPairing);
  if (route === "/pairing" && method === "POST") return createPairing(payload);
  if (route === "/pairing/latest") return enrichPairing(pairings[0]);
  if (route === "/pairing/recent-crate") {
    return [
      ...coffeeLogs.map((item) => ({ itemType: "coffee", itemId: item.coffeeLogId, recordedDate: item.drinkDate, title: item.beanName, description: item.memo, catalogNo: `no. ${String(item.coffeeLogId).padStart(3, "0")}` })),
      ...musicLogs.map((item) => ({ itemType: "music", itemId: item.musicLogId, recordedDate: item.listenedDate, title: `${item.artistName} - ${item.trackName}`, description: item.memo, catalogNo: `no. ${String(item.musicLogId).padStart(3, "0")}` }))
    ];
  }
  if(route==='/pairing/analyze')return analyzePairing({coffee:payload.coffee||findCoffee(payload.coffeeLogId),music:payload.music||findMusic(payload.musicLogId)},readPreferences());
  if(route==='/pairing/parse-natural-log'){const note=String(payload.text||payload.note||'');const fields=organizeCup(note);return {coffee:{...fields,tasteNote:fields.tastes.join(', '),memo:note},music:{}};}
  if (route.startsWith("/pairing/")) {
    const id = route.split("/")[2];
    if (method !== "GET") throw Error("유효한 페어링 기록 번호가 필요합니다.");
    const found=pairings.find((item) => String(item.pairingId) === String(id));
    if(!found)throw new Error('페어링 기록을 찾을 수 없습니다.');return enrichPairing(found);
  }

  if ((route === "/collection" || route === "/collections") && method === "POST") return createCollection(payload);
  if (route === "/collection" || route === "/collections") return collections;
  if(route==='/recommend'||route==='/recommendations')return pairings.map(enrichPairing).map(row=>({recommendationId:row.pairingId,title:row.beanName,targetTitle:`${row.artistName} - ${row.trackName}`,reason:row.pairingText,score:row.pairingScore}));
  if(route==='/report/monthly'){
    const month=new URLSearchParams(path.split('?')[1]).get('month')||today.slice(0,7);
    const cups=coffeeLogs.filter(x=>x.drinkDate.startsWith(month)),songs=musicLogs.filter(x=>x.listenedDate.startsWith(month)),pairs=pairings.filter(x=>x.createdAt.startsWith(month));
    return {summary:{latestMoodSummary:pairs[0]?.moodSummary||'이번 달의 기록을 모았습니다.',coffeeDays:new Set(cups.map(x=>x.drinkDate)).size,pairingCount:pairs.length,avgPairingScore:pairs.length?pairs.reduce((n,x)=>n+x.pairingScore,0)/pairs.length:null},favoriteCoffees:cups,favoriteArtists:songs,moodStats:pairs.map(x=>({moodTags:x.moodTags}))};
  }
  if(route==='/report')return [];
  // There are no server accounts or provider request logs in a personal notebook.
  if(route==='/admin/dashboard')return {memberCount:0,coffeeLogCount:coffeeLogs.length,musicLogCount:musicLogs.length,pairingCount:pairings.length,apiErrorCount:0};
  if(route==='/admin/members'||route==='/admin/api-logs')return [];
  if(route==='/admin/statistics/daily')return [...new Set([...coffeeLogs.map(x=>x.drinkDate),...musicLogs.map(x=>x.listenedDate)])].sort().map(statDate=>({statDate,coffeeCount:coffeeLogs.filter(x=>x.drinkDate===statDate).length,musicCount:musicLogs.filter(x=>x.listenedDate===statDate).length,pairingCount:pairings.filter(x=>x.createdAt.startsWith(statDate)).length}));
  throw Error('이 기록장에서는 지원하지 않는 요청입니다.');
}

const monthlyPicks = [];
const storageKey = "roast-reverb-demo-v1";
const tables = { coffeeLogs, musicLogs, pairings, collections, monthlyPicks };
let storageError,persistedDiary;
try {
 const raw = localStorage.getItem(DIARY_KEY);
 persistedDiary=raw;
 if (raw !== null) {
   const saved = validateDiary(JSON.parse(raw));
   for (const [key, items] of Object.entries(tables)) items.splice(0,items.length,...saved[key]);
 } else {
   // A new notebook starts empty; never claim that the visitor tasted or listened to seed examples.
   for(const rows of [coffeeLogs,musicLogs,pairings,collections])rows.splice(0,rows.length);
 }
} catch { storageError=new Error('이 브라우저의 기록 자료를 읽지 못했습니다. 마이페이지에서 원본 자료를 백업하거나 이전 백업으로 복구해 주세요. 예시 기록으로 덮어쓰지 않습니다.'); }
coffeeSeq = Math.max(0,...coffeeLogs.map(x=>x.coffeeLogId))+1;
musicSeq = Math.max(0,...musicLogs.map(x=>x.musicLogId))+1;
pairingSeq = Math.max(0,...pairings.map(x=>x.pairingId))+1;
collectionSeq = Math.max(0,...collections.map(x=>x.collectionId))+1;
async function executeRequest(path, options={}) {
 const method=(options.method||"GET").toUpperCase();
 const route=pathOnly(path);
 const match=route.match(/^\/(coffee|music|pairing)\/(\d+)$/);
 let result;
 if(route.startsWith("/monthly-picks")) {
  const id=Number(route.split("/")[2]);
  if(method==="POST" && !id) {
   const payload=bodyOf(options);
   result={monthly_pick_id:Math.max(0,...monthlyPicks.map(x=>x.monthly_pick_id))+1,pick_month:payload.month,roastery:payload.roastery,source_url:payload.sourceUrl,options:payload.rawOptionsText.split(/\r?\n/).filter(Boolean).map((text,i)=>({monthly_pick_option_id:i+1,raw_text:text,option_name:text,score:null,score_reason:"맛 정보가 부족해 점수를 계산하지 않았습니다.",dark_roast:false,decaf:false,sold_out:false}))};
   monthlyPicks.unshift(result);
  } else if(id){
    result=monthlyPicks.find(x=>x.monthly_pick_id===id);
    if(!result)throw Error('월픽 노트를 찾을 수 없습니다.');
    if(method==='POST'&&route.endsWith('/score')) result.options=result.options.map(option=>{try{const analysis=analyzePairing({coffee:{tasteNote:option.raw_text},music:{tags:'차분한 재즈, 피아노'}},readPreferences());return {...option,score:analysis.pairingScore,score_reason:'차분한 재즈와의 특성 유사도 · '+analysis.pairingText};}catch{return {...option,score:null,score_reason:'맛 단서가 부족해 점수를 계산하지 않았습니다.'};}});
  } else result=monthlyPicks;
  return result;
 }
 if(match && ["PUT","DELETE"].includes(method)) {
   const [name,id]=match.slice(1); const list={coffee:coffeeLogs,music:musicLogs,pairing:pairings}[name];
   const key={coffee:"coffeeLogId",music:"musicLogId",pairing:"pairingId"}[name];
   const index=list.findIndex(x=>String(x[key])===id);
   if(index<0) throw new Error("기록을 찾을 수 없습니다.");
   if(method==="DELETE") { list.splice(index,1); if(name!=='pairing'){const relation=name==='coffee'?'coffeeLogId':'musicLogId';for(let i=pairings.length-1;i>=0;i--)if(String(pairings[i][relation])===id)pairings.splice(i,1);} result={deleted:true}; }
   else { Object.assign(list[index],bodyOf(options),{[key]:Number(id),memberId:list[index].memberId}); result=list[index]; }
 } else result=await dispatchRequest(path,options);
 return result;
}
// Serial writes prevent one failed persistence attempt rolling back a concurrent edit.
let pendingWrite=Promise.resolve();
export function localRequest(path,options={}) {
 if(pathOnly(path).startsWith("/auth/")||pathOnly(path)==="/members/me")return Promise.reject(Error("GitHub 기록장은 가입 없이 사용합니다. 계정과 비밀번호를 수집하지 않습니다."));
 if(storageError)return Promise.reject(storageError);
 const method=(options.method||'GET').toUpperCase();
 if(method==='GET')return pendingWrite.then(()=>executeRequest(path,options));
 const action=pendingWrite.then(async()=>{
   if(localStorage.getItem(storageKey)!==persistedDiary)throw Error("다른 탭이나 복구 작업에서 기록이 변경됐습니다. 현재 초안을 보관하고 새로고침한 뒤 다시 저장해 주세요.");
   const before=JSON.parse(JSON.stringify(tables));
   const sequences=[coffeeSeq,musicSeq,pairingSeq,collectionSeq];
   try {const result=await executeRequest(path,options);const serialized=JSON.stringify(tables);localStorage.setItem(storageKey,serialized);persistedDiary=serialized;return result;}
   catch(error){for(const [name,rows] of Object.entries(tables))rows.splice(0,rows.length,...before[name]);[coffeeSeq,musicSeq,pairingSeq,collectionSeq]=sequences;throw error;}
 });
 pendingWrite=action.catch(()=>{});
 return action;
}

// Compatibility for existing backup and regression tests. Storage key is retained to preserve records.
export const mockRequest=localRequest;
