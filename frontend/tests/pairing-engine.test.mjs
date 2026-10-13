import test from "node:test";
import assert from "node:assert/strict";
import { analyzePairing,trainPreference,decodePairingEvidence,saveFeedback,readPreferences } from "../src/utils/pairingEngine.js";
import { safeColor,colorFamily,hasColor } from "../src/utils/monthlyColors.js";
test('pairing changes with recorded taste and genre, never invents evidence from names',()=>{
 const coffee={tasteNote:'초콜릿, 묵직한 바디'};
 const jazz=analyzePairing({coffee,music:{genre:'Jazz',memo:'베이스'}});
 const ambient=analyzePairing({coffee,music:{genre:'Ambient',memo:'공기감'}});
 assert.notEqual(jazz.pairingScore,ambient.pairingScore);
 assert.equal(decodePairingEvidence(jazz.aiReason).engine,'rr-local-v1');
 assert.throws(()=>analyzePairing({coffee:{beanName:'예가체프'},music:{trackName:'Blue in Green'}}),/맛 노트/);
});
test('zero ratings are observed values and unknown axes are not filled as measurements',()=>{
 const r=analyzePairing({coffee:{acidity:0},music:{genre:'Ambient'}});
 assert.equal(r.evidence.coverage,1);assert.equal(r.evidence.features[1],null);
 assert.ok(r.evidence.coffee.includes('산미 0/5'));
});
test('personal feedback learns locally and deduplicates a saved pairing',()=>{
 const data=new Map();globalThis.localStorage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};
 const features=[.8,.9,.7,.6];const model=saveFeedback('pair1',features,1);
 assert.equal(model.samples,1);assert.ok(model.weights[0]>0);
 assert.throws(()=>saveFeedback('pair1',features,0),/이미/);assert.equal(readPreferences().samples,1);
 assert.ok(trainPreference(null,features,0).weights[0]<0);
 assert.equal(analyzePairing({coffee:{tasteNote:'레몬'},music:{genre:'pop'}},{weights:[0,0,0,0,0],samples:4}).evidence.scoreKind,'특성 유사도');
 assert.equal(analyzePairing({coffee:{tasteNote:'레몬'},music:{genre:'pop'}},{weights:[0,0,0,0,0],samples:5}).evidence.scoreKind,'개인 선호 추정');
 delete globalThis.localStorage;
});
test('vendor hex colors stay exact, unsafe values are rejected and color filters use actual colors',()=>{
 assert.equal(safeColor('6247aa'),'#6247aa');assert.equal(safeColor('url(javascript:x)'),null);
 assert.equal(colorFamily('#6247aa'),'purple');assert.equal(colorFamily('#ffd60a'),'yellow');
 assert.equal(hasColor({flavorColors:['#6247aa']},'purple'),true);assert.equal(hasColor({},'purple'),false);
});

test('rock and post-rock keep distinct genre cues, explicit ratings override textual priors',()=>{
 const coffee={tasteNote:'레몬',acidity:0};
 const rock=analyzePairing({coffee,music:{genre:'Rock'}});
 const post=analyzePairing({coffee,music:{genre:'Post-rock'}});
 assert.ok(rock.evidence.music.includes('rock'));
 assert.equal(post.evidence.music.includes('rock'),false);
 assert.equal(post.evidence.features[0],0.35);
});

test('plain Korean record wording does not invent a rock genre',()=>{
 assert.throws(()=>analyzePairing({coffee:{tasteNote:'레몬'},music:{memo:'오늘 들은 음악을 기록'}}),/맛 노트/);
});
