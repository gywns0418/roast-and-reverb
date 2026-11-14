import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTasteProfile,tasteMatch,roasteryTried,tasteCardText,verdictOf} from '../src/utils/tasteProfile.js';
import {firstCupPayload} from '../src/utils/firstCup.js';
import {familiesInText} from '../src/utils/tasteQuery.js';

const cup=(id,verdict,memo,extra={})=>({id,date:'2026-11-0'+id,bean:extra.bean||'원두 미기록',roastery:extra.roastery||'',brew:extra.brew||'',memo,brewDetails:verdict?{verdict}:{}});
const records=[
 cup(1,'again','고소하고 끝에 초콜릿 맛이 남았어',{bean:'카카오 크림',roastery:'비로소커피',brew:'핸드드립'}),
 cup(2,'again','헤이즐넛처럼 고소했어',{roastery:'유에프오커피',brew:'핸드드립'}),
 cup(3,'not-mine','꽃향이 너무 강하고 시큼했어',{roastery:'언더빈'}),
 cup(4,'okay','무난했어'),
 cup(5,'','기록만 남긴 잔'),
];

test('profile counts only judged records and the drinker\'s own words',()=>{
 const p=buildTasteProfile(records);
 assert.equal(p.total,5); assert.equal(p.judged,4); assert.equal(p.againCount,2); assert.equal(p.notMineCount,1);
 assert.deepEqual(p.likedFamilies.map(f=>[f.key,f.again]),[['nutty',2],['chocolate',1]]);
 assert.deepEqual(p.dislikedFamilies.map(f=>f.key),['floral']);
 assert.deepEqual(p.unjudged.map(r=>r.id),[5]);
 assert.deepEqual(p.favoriteMethods,[{name:'핸드드립',count:2}]);
 assert.deepEqual(p.againCups.map(r=>r.id),[1,2]);
 assert.equal(p.roasteries.length,3);
});

test('no judgement means no taste: empty profile stays empty instead of guessing',()=>{
 const p=buildTasteProfile([cup(1,'','고소했어'),cup(2,'','초콜릿')]);
 assert.equal(p.judged,0); assert.deepEqual(p.likedFamilies,[]);
 assert.equal(tasteMatch({flavors:['아몬드']},p),null);
 assert.equal(verdictOf({brewDetails:{verdict:'great'}}),'');
});

test('monthly beans resemble my taste only through shared liked notes, never disliked ones',()=>{
 const p=buildTasteProfile(records);
 assert.deepEqual(tasteMatch({flavors:['볶은 아몬드','밀크 초콜릿']},p).shared,['고소한','초콜릿']);
 assert.equal(tasteMatch({flavors:['헤이즐넛','자스민']},p),null,'contains a disliked floral note');
 assert.equal(tasteMatch({flavors:['레몬','자몽']},p),null);
});

test('roastery journey matches names I wrote, and the share card only states counts I made',()=>{
 const p=buildTasteProfile(records);
 assert.equal(roasteryTried(p,'비로소커피'),true);
 assert.equal(roasteryTried(p,'SEY'),false);
 const text=tasteCardText(p);
 assert.match(text,/다시 찾게 되는 맛: 고소한, 초콜릿/);
 assert.match(text,/판단한 한 잔 4잔 · 만나 본 로스터리 3곳/);
});

test('first cup keeps a chosen verdict and drops unknown values',()=>{
 assert.equal(firstCupPayload({note:'좋았어',verdict:'again'},'2026-11-13').brewDetails.verdict,'again');
 assert.equal(firstCupPayload({note:'좋았어',verdict:'best'},'2026-11-13').brewDetails.verdict,undefined);
 assert.equal(firstCupPayload({note:'좋았어'},'2026-11-13').brewDetails.verdict,undefined);
});

test('the same note vocabulary reads both my words and vendor notes',()=>{
 assert.deepEqual(familiesInText('달게 느껴졌고 고소했어'),['nutty','sweet']);
 assert.deepEqual(familiesInText(''),[]);
});
