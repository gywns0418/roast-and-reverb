// Original, deterministic procedural composition. This is not a generative AI model.
export const SOUND_VERSION = 1;
export const soundMoods = {
  warm: {label:'고소한 온기', description:'둥근 베이스와 부드러운 건반', color:'#d6a46b', root:48, scale:[0,2,4,7,9]},
  airy: {label:'꽃 향의 여백', description:'맑은 건반과 천천히 번지는 잔향', color:'#b8b8d7', root:50, scale:[0,2,5,7,9]},
  bright: {label:'산뜻한 빛', description:'가벼운 멜로디와 작은 움직임', color:'#d0d89b', root:55, scale:[0,2,4,7,9]},
  dusk: {label:'깊은 밤', description:'낮은 음과 차분한 마이너 선율', color:'#9eafb1', root:45, scale:[0,3,5,7,10]},
};
export function soundSettings(value={}) {
  const finite=(n,fallback)=>typeof n==='number'&&Number.isFinite(n)?n:fallback;
  return {mood:Object.hasOwn(soundMoods,value.mood)?value.mood:'warm', bpm:Math.round(Math.max(56,Math.min(110,finite(value.bpm,76)))), space:Math.max(0,Math.min(1,finite(value.space,.45))), rhythm:value.rhythm!==false, bass:value.bass!==false, pad:value.pad!==false};
}
export function settingsForCoffee(coffee={}) {
  const notes=[coffee.cupNotes,coffee.tasteNote,...(Array.isArray(coffee.flavors)?coffee.flavors:[])].filter(Boolean).join(' ');
  const mood=/꽃|플로럴|자스민|아카시아|장미|라벤더|floral|jasmine|acacia|rose/i.test(notes)?'airy':/시트러스|레몬|베리|과일|복숭아|감귤|오렌지|자몽|포도|사과|citrus|berry|fruit|peach|orange|apple/i.test(notes)?'bright':/다크|카카오|dark|cocoa/i.test(notes)?'dusk':'warm';
  return soundSettings({mood,bpm:mood==='bright'?92:mood==='dusk'?64:76});
}
export const soundCommands=['조금 느리게','조금 빠르게','더 따뜻하게','조금 밝게','리듬 없이','리듬 넣기','여운 길게','피아노만'];
export function applySoundCommand(text, current) {
  const settings=soundSettings(current);
  const actions={
    '조금 느리게':{bpm:settings.bpm-8}, '조금 빠르게':{bpm:settings.bpm+8},
    '더 따뜻하게':{mood:'warm'}, '조금 밝게':{mood:'bright'},
    '리듬 없이':{rhythm:false}, '리듬 넣기':{rhythm:true},
    '여운 길게':{space:settings.space+.2}, '피아노만':{bass:false,pad:false,rhythm:false},
  };
  const action=actions[String(text).trim()];
  if(!action)throw new Error('지금은 아래의 소리 요청을 이해할 수 있어요. 자유로운 AI 대화는 연결 준비 중입니다.');
  return soundSettings({...settings,...action});
}
export function seededRandom(seed) {
  let state=seed>>>0;
  return ()=>{state=(state+0x6D2B79F5)>>>0;let n=Math.imul(state^(state>>>15),1|state);n^=n+Math.imul(n^(n>>>7),61|n);return ((n^(n>>>14))>>>0)/4294967296;};
}
export function createScore(value, seed) {
  const settings=soundSettings(value), mood=soundMoods[settings.mood], random=seededRandom(seed);
  const beat=60/settings.bpm, notes=[], progression=[0,3,1,4];
  let melody=2;
  for(let bar=0;bar<16;bar++) {
    const degree=progression[Math.floor(bar/2)%4], time=bar*4*beat;
    const pitch=(index,octave=0)=>mood.root+mood.scale[index%5]+12*Math.floor(index/5)+octave;
    if(settings.bass)notes.push({kind:'bass',time,midi:pitch(degree,-12),duration:3.7*beat,gain:.13});
    if(settings.pad)for(const index of [degree,degree+2,degree+4])notes.push({kind:'pad',time,midi:pitch(index),duration:4.2*beat,gain:.035});
    for(let step=0;step<8;step++) {
      if(step>0&&random()<.40)continue;
      melody=Math.max(0,Math.min(9,melody+(random()<.5?-1:1)));
      const index=step===0?degree+5:melody+3;
      notes.push({kind:'piano',time:time+step*.5*beat,midi:pitch(index),duration:1.7*beat,gain:.10+random()*.035});
    }
    if(settings.rhythm)for(let step=0;step<4;step++)notes.push({kind:'brush',time:time+step*beat,midi:0,duration:.075,gain:step%2?.025:.012});
  }
  return {version:SOUND_VERSION,settings,seed:seed>>>0,duration:64*beat+3,notes};
}
export function validateSoundRecipe(value) {
  if(!value||value.version!==SOUND_VERSION||!Number.isInteger(value.seed)||value.seed<0||value.seed>0xffffffff||typeof value.id!=='string'||!value.id||value.id.length>100||typeof value.title!=='string'||value.title.length>100||!Number.isFinite(Date.parse(value.createdAt)))throw new Error('지원하지 않는 사운드 보관 파일입니다.');
  return {version:SOUND_VERSION,id:value.id,title:value.title,coffee:String(value.coffee||'').slice(0,120),createdAt:value.createdAt,seed:value.seed,settings:soundSettings(value.settings),favorite:value.favorite===true};
}
export function parseSoundBackup(value) {
  if(value?.format!=='roast-reverb-sounds'||value.version!==1||!Array.isArray(value.tracks)||value.tracks.length>24)throw new Error('R&R 사운드 백업 파일을 선택해 주세요.');
  const tracks=value.tracks.map(validateSoundRecipe);
  if(new Set(tracks.map(row=>row.id)).size!==tracks.length)throw new Error('중복된 곡 식별자가 있습니다.');
  return tracks;
}
export function encodeWave(channels,sampleRate) {
  if(!Array.isArray(channels)||channels.length<1||channels.length>2||!channels[0].length||!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>96000||channels.some(row=>row.length!==channels[0].length))throw new Error('오디오 데이터 형식을 확인해 주세요.');
  const frames=channels[0].length, count=channels.length, buffer=new ArrayBuffer(44+frames*count*2), view=new DataView(buffer);
  const word=(at,text)=>[...text].forEach((char,i)=>view.setUint8(at+i,char.charCodeAt(0)));
  word(0,'RIFF');view.setUint32(4,buffer.byteLength-8,true);word(8,'WAVE');word(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,count,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*count*2,true);view.setUint16(32,count*2,true);view.setUint16(34,16,true);word(36,'data');view.setUint32(40,frames*count*2,true);
  for(let i=0;i<frames;i++)for(let c=0;c<count;c++){const n=Number.isFinite(channels[c][i])?Math.max(-1,Math.min(1,channels[c][i])):0;view.setInt16(44+(i*count+c)*2,Math.round(n*(n<0?32768:32767)),true);}
  return buffer;
}
