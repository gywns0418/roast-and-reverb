const VERSION = "rr-local-v1";
export const axes = ["밝기", "깊이", "부드러움", "공간감"];
const lexicon = [
  ["산미|시트러스|레몬|라임|자몽|청사과|밝|상큼|citrus|lemon|bright|upbeat|경쾌|팝|pop|dance|댄스|funk|펑크", [0.9,0.2,0.4,0.4]],
  ["초콜릿|카카오|견과|고소|다크|묵직|쓴맛|dark|chocolate|nut|베이스|bass|블루스|blues|힙합|hip.?hop|(?<!post-)(?<!post )\\brock\\b|(?<![가-힣])록(?![가-힣])", [0.2,0.9,0.5,0.3]],
  ["달콤|단맛|꿀|캐러멜|크리미|부드|sweet|honey|caramel|smooth|재즈|jazz|soul|소울|피아노|piano|acoustic|어쿠스틱", [0.5,0.5,0.9,0.5]],
  ["플로럴|꽃|재스민|자스민|차분|차 같은|맑|floral|tea|clean|ambient|앰비언트|몽환|고요|공기감|잔향|공간감|클래식|classical|post.?rock|포스트록", [0.65,0.3,0.7,0.95]]
];
function profile(record, kind) {
  const raw=record.raw || record;
  const fields=kind === "coffee" ? [raw.tasteNote,raw.taste_note,raw.memo,raw.roastLevel,raw.roast_level,record.roast,record.memo] : [raw.genre,raw.tags,raw.memo,record.genre,record.tags,record.memo];
  const text=fields.filter(Boolean).join(" ").toLowerCase();
  const values=axes.map(() => []),evidence=[];
  for(const [pattern,vector] of lexicon){const matches=text.match(new RegExp(pattern,"gi"));if(matches){evidence.push(...new Set(matches));vector.forEach((value,index)=>values[index].push(value));}}
  if(kind === "coffee") {
    for(const [field,index] of [["acidity",0],["body",1],["sweetness",2],["aroma",3]]) {
      const source=record[field] ?? raw[field]; const value=source === "" || source == null ? NaN : Number(source);
      if(Number.isFinite(value) && value>=0 && value<=5){values[index]=[value/5];evidence.push(`${({acidity:"산미",body:"바디",sweetness:"단맛",aroma:"향"})[field]} ${value}/5`);}
    }
  }
  return {vector:values.map(items=>items.length ? items.reduce((a,b)=>a+b,0)/items.length : null),evidence:[...new Set(evidence)].slice(0,8)};
}
export function analyzePairing({coffee={},music={}}, model=null) {
  const cup=profile(coffee,"coffee"),track=profile(music,"music");
  if(!cup.evidence.length || !track.evidence.length) throw new Error("커피의 맛 노트/평점과 음악의 장르/감상 태그를 각각 남겨주세요. 곡명과 원두명만으로 특성을 추정하지 않습니다.");
  const features=axes.map((_,index)=>cup.vector[index] == null || track.vector[index] == null ? null : 1-Math.abs(cup.vector[index]-track.vector[index]));
  const known=features.filter(value=>value != null);
  if(!known.length) throw new Error("비교할 공통 특성이 부족합니다. 맛과 음악의 감상을 조금 더 남겨주세요.");
  const ranked=features.map((value,index)=>({label:axes[index],value})).filter(item=>item.value!=null).sort((a,b)=>b.value-a.value);
  const semanticScore=Math.round(known.reduce((a,b)=>a+b,0)/known.length*100);
  const personal=model?.samples >= 5;
  const input=[1,...features.map(value=>value ?? 0.5)];
  const prediction=personal ? 1/(1+Math.exp(-input.reduce((total,value,index)=>total+value*(model.weights[index] || 0),0))) : null;
  const score=personal ? Math.round(prediction*100) : semanticScore;
  const summary=`${ranked[0].label}에서 만나는 한 잔과 한 곡`;
  const evidence={engine:VERSION,features,coffee:cup.evidence,music:track.evidence,axes:ranked,coverage:known.length,scoreKind:personal ? "개인 선호 추정" : "특성 유사도",samples:model?.samples || 0,summary};
  return {engine:VERSION,moodSummary:summary,moodTags:ranked.slice(0,2).map(item=>item.label).join(", "),pairingScore:score,
    pairingText:`커피 단서 「${cup.evidence.slice(0,3).join(" · ")}」와 음악 단서 「${track.evidence.slice(0,3).join(" · ")}」를 비교했어요. ${ranked[0].label}의 닮은 특성이 이 조합을 연결합니다. ${ranked.at(-1).label}의 차이도 직접 느껴보세요.`,
    aiReason:JSON.stringify(evidence),evidence};
}
export function decodePairingEvidence(value) {
  try {const parsed=JSON.parse(value);return parsed.engine === VERSION && Array.isArray(parsed.features) && parsed.features.length===4 ? parsed : null;} catch {return null;}
}
export function trainPreference(model, features, label) {
  if(!Array.isArray(features) || features.length!==4 || ![0,1].includes(label)) throw new Error("유효한 페어링 피드백이 필요합니다.");
  const current=model && Array.isArray(model.weights) && model.weights.length===5 ? model : {weights:[0,0,0,0,0],samples:0};
  const input=[1,...features.map(value=>Number.isFinite(value) ? Math.max(0,Math.min(1,value)) : 0.5)];
  const predicted=1/(1+Math.exp(-input.reduce((sum,value,index)=>sum+value*current.weights[index],0)));
  return {weights:current.weights.map((weight,index)=>weight+0.25*(label-predicted)*input[index]-0.002*weight),samples:current.samples+1,version:VERSION};
}
const KEY="rr-pairing-preferences-v1";
export function readPreferences() {
  try {const value=JSON.parse(localStorage.getItem(KEY));return value && value.weights?.length===5 && value.weights.every(Number.isFinite) && Number.isInteger(value.samples) && value.samples>=0 ? value : {weights:[0,0,0,0,0],samples:0};}catch{return {weights:[0,0,0,0,0],samples:0};}
}
export function saveFeedback(id,features,label) {
  const current=readPreferences();
  if(Object.hasOwn(current.votes || {},String(id))) throw new Error("이 조합의 피드백은 이미 반영됐어요.");
  const model=trainPreference(current,features,label);
  localStorage.setItem(KEY,JSON.stringify({...model,votes:{...(current.votes || {}),[String(id)]:label}}));
  return model;
}
