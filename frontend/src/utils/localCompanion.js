// Deliberately small, explainable rules. No remote model or invented tasting facts.
export function organizeCup(note) {
  const text=String(note||'').trim();
  if(!text||text.length>2000)throw Error('커피 감상을 1~2000자로 적어 주세요.');
  const firstMatch=pattern=>text.match(pattern)?.[0]||'';
  return {beanName:'',roastery:'',brewMethod:firstMatch(/핸드드립|에어로프레스|프렌치프레스|에스프레소|모카포트|콜드브루/),tastes:[...new Set(text.match(/초콜릿|카카오|견과|고소|레몬|라임|자몽|베리|자스민|재스민|플로럴|산미|단맛|쓴맛|꿀|캐러멜|부드러움|묵직함/g)||[])].slice(0,8)};
}
export function soundAdvice({message,settings={}}) {
  const text=String(message||'').trim();
  if(!text||text.length>1200)throw Error('듣고 싶은 분위기를 1~1200자로 적어 주세요.');
  const slow=/조용|차분|잠|휴식|느리|숨|편안/.test(text), fast=/활기|빠르|신나|경쾌|운동/.test(text);
  const space=/공간|몽환|여운|넓/.test(text)?0.85:settings.space??0.5;
  const bpm=slow?65:fast?110:settings.bpm??80;
  return {reply:`기기 내 규칙으로 문장을 살펴봤어요. ${slow?'조용한 분위기 단서에 맞춰 느린 템포를':fast?'활기 있는 분위기 단서에 맞춰 빠른 템포를':'직접 적은 분위기를 보며 현재 템포를 유지하고 여운을'} 제안합니다. 적용한 뒤 직접 듣고 조절해 주세요. 자유 대화형 AI 답변은 제공하지 않습니다.`,settings:{...settings,bpm,space}};
}
