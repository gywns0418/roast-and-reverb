import {trainPreference} from './pairingEngine.js';
import {safeMusicUrl} from './musicCandidates.js';
export const roomTracks=[
 {id:'room-aphex-avril',artist:'Aphex Twin',track:'Avril 14th',genre:'',tags:['piano','차분함','연주'],source:'starter',metadataSource:'R&R 시작 선곡 · 편집 태그',referenceUrl:'https://aphextwin.warp.net/release/86961-aphex-twin-drukqs'},
 {id:'room-nils-says',artist:'Nils Frahm',track:'Says',genre:'',tags:['ambient','공간감','연주'],source:'starter',metadataSource:'R&R 시작 선곡 · 편집 태그',referenceUrl:'https://www.nilsfrahm.com/works/spaces/'},
 {id:'room-khru-friday',artist:'Khruangbin',track:'Friday Morning',genre:'',tags:['guitar','부드러움','연주'],source:'starter',metadataSource:'R&R 시작 선곡 · 편집 태그',referenceUrl:'https://www.khruangbin.com/description?albumId=5'}
];
const str=(value,limit=500)=>typeof value==='string'?value.trim().slice(0,limit):'';
export const defaultRoom={name:'',about:'',minutes:8,explore:true};
export function roomProfile(value={}){return {name:str(value.name,32),about:str(value.about,600),minutes:[8,15,30].includes(value.minutes)?value.minutes:8,explore:value.explore!==false};}
export function roomPair(value){
 if(!value?.bean||!value?.music||!str(value.bean.name)||!str(value.music.track))throw new Error('원두와 음악 정보가 없는 조합입니다.');
 const bean=Object.fromEntries(['id','name','origin','roastery','process','variety','roast','source','availability'].map(key=>[key,str(value.bean[key],300)]));
 bean.flavors=Array.isArray(value.bean.flavors)?value.bean.flavors.filter(x=>typeof x==='string').slice(0,12).map(x=>str(x,100)):[];
 bean.flavorColors=Array.isArray(value.bean.flavorColors)?value.bean.flavorColors.filter(x=>/^#[a-f0-9]{6}$/i.test(x)).slice(0,12):[];
 const music=Object.fromEntries(['id','artist','track','genre','memo','channel','source','metadataSource'].map(key=>[key,str(value.music[key],400)]));
 music.tags=Array.isArray(value.music.tags)?value.music.tags.filter(x=>typeof x==='string').slice(0,12).map(x=>str(x,100)):[];music.url=safeMusicUrl(value.music.url)||'';
 return {bean,music};
}
export function roomMemory(value){const pair=roomPair(value);if(!str(value.id,100)||!Number.isFinite(Date.parse(value.date))||![0,1,-1].includes(value.rating))throw new Error('감각 기억의 날짜 또는 평가가 올바르지 않습니다.');return {...pair,id:str(value.id,100),date:new Date(value.date).toISOString(),note:str(value.note,1000),situation:str(value.situation,600),rating:value.rating,seconds:Math.min(7200,Math.max(0,Number(value.seconds)||0)),brewed:value.brewed===true,listened:value.listened===true,features:Array.isArray(value.features)&&value.features.length===4?value.features.map(x=>Number.isFinite(x)&&x>=0&&x<=1?x:null):[null,null,null,null]};}
export function tasteModel(memories){let model={weights:[0,0,0,0,0],samples:0};for(const memory of [...memories].reverse()){if(memory.rating!==0&&memory.brewed&&memory.listened&&memory.features.some(Number.isFinite))model=trainPreference(model,memory.features,memory.rating===1?1:0);}return model;}
export function elapsedRoom(active,now=Date.now()){if(!active)return 0;const before=Number(active.elapsed)||0;return Math.min(7200,Math.max(0,before+(active.startedAt?Math.max(0,now-active.startedAt)/1000:0)));}
export function roomContext(situation,profile,memories){const loved=memories.filter(item=>item.rating===1&&item.brewed&&item.listened).slice(0,3);return [str(situation,500),profile.about&&`내가 직접 적은 취향: ${profile.about}`,profile.explore?'익숙함에 새로운 질감을 조금 더하기':'익숙하고 편안한 질감',...loved.map(item=>`좋았던 감상: ${item.note||[item.bean.flavors.join(', '),item.music.genre,...item.music.tags].join(', ')}`)].filter(Boolean).join('\n').slice(0,1800);}
export function dailyRoomIndex(day,count){if(!count)return 0;return [...day].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0)%count;}
export function roomBackup(data){if(data?.schemaVersion!==1||!Array.isArray(data.memories)||data.memories.length>80||!Array.isArray(data.trash)||data.trash.length>160)throw new Error('지원하지 않는 청음실 백업입니다.');return {profile:roomProfile(data.profile),memories:data.memories.map(roomMemory),trash:data.trash.map(roomMemory)};}

export function roomMusicPool(items){const map=new Map();for(const item of items){const artist=item.artist?.trim().toLowerCase(),track=item.track?.trim().toLowerCase();const key=artist&&track?`${artist}|${track}`:item.id;map.set(key,item);}return [...map.values()];}

export function blendRoomIntent(vectors,baseCount){if(vectors.length<=baseCount)return vectors;const intent=vectors[0].map((value,i)=>value*.8+vectors.slice(baseCount).reduce((sum,row)=>sum+row[i],0)/ (vectors.length-baseCount)*.2);const norm=Math.sqrt(intent.reduce((n,value)=>n+value*value,0))||1;return [intent.map(value=>value/norm),...vectors.slice(1)];}

export function eligibleRoomMusic(items,context){const pool=roomMusicPool(items);if(!/보컬\s*(?:없이|없는|없)|가사\s*(?:없이|없는)|without\s+vocals|instrumental\s+only/i.test(context))return pool;return pool.filter(item=>/연주|instrumental|보컬 없음|without vocals/i.test([item.genre,...(item.tags||[]),item.memo].join(' ')));}
