export function coffeeMusicBrief(coffee){
 const notes=String(coffee.cupNotes || coffee.tasteNote || '').trim();const origin=String(coffee.originCountry||coffee.origin||'').trim();
 if(!notes&&!origin)throw new Error('컵노트 또는 산지를 먼저 적어 주세요.');
 const fruity=/시트러스|레몬|자몽|베리|복숭아|과일|citrus|berry|peach/i.test(notes),floral=/꽃|플로럴|자스민|장미|floral|jasmine/i.test(notes),deep=/초콜릿|카카오|견과|캐러멜|chocolate|cocoa|nut|caramel/i.test(notes);
 const mood=deep?'따뜻하고 부드러운 여운':floral?'가볍고 투명한 공간감':fruity?'산뜻하고 생동감 있는 흐름':'차분하고 열린 질감';
 const style=deep?'warm downtempo jazz, soft electric piano, rounded upright bass, gentle brushed drums':floral?'airy ambient instrumental, delicate piano, soft mallet tones, spacious restrained reverb':fruity?'bright acoustic downtempo, clean plucked strings, light percussion, fluid melodic movement':'minimal ambient instrumental, soft piano, restrained percussion, spacious evolving texture';
 return {mood,notes,origin,prompt:`Create an original instrumental piece for a coffee listening ritual. ${style}. ${deep?'72–82':fruity?'88–100':'65–80'} BPM, gentle dynamics, no vocals, no abrupt transitions. Express the following cup-note impressions as a creative metaphor: ${notes||'cup notes not provided'}. Coffee origin context: ${origin||'not specified'}; do not infer a musical culture from geography. No imitation of an existing artist or song. Duration about 90 seconds.`,basis:[notes&&`향미: ${notes}`,origin&&`산지: ${origin}`].filter(Boolean)};
}
