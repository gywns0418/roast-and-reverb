import test from 'node:test';
import assert from 'node:assert/strict';
import {firstCupPayload,literalCupFields,quickDraftKey} from '../src/utils/firstCup.js';
import {parseMusicLink} from '../src/utils/musicCandidates.js';
import {brewPlaylist} from '../src/data/brewPlaylist.js';
import {matchedSoundtrack} from '../src/utils/coffeeSoundtrack.js';
test('one sentence saves its exact meaning without inventing a bean, score or listening history',()=>{
 const note='고소하고 끝에 초콜릿 맛이 남았어.';
 const row=firstCupPayload({note,tastes:['초콜릿','자스민'],soundtrack:matchedSoundtrack(brewPlaylist[0])},'2026-10-18');
 assert.equal(row.beanName,'원두 미기록');assert.equal(row.memo,note);assert.equal(row.tasteNote,'초콜릿');assert.equal(row.drinkDate,'2026-10-18');assert.equal(row.brewDetails.soundtrack.listened,false);assert.equal(row.acidity,undefined);assert.equal(row.waterTemp,null);assert.equal(row.brewTime,null);
});
test('AI fields require literal support and drafts are scoped independently',()=>{
 const row=literalCupFields({beanName:'에티오피아',roastery:'모르는 로스터리',brewMethod:'핸드드립',tastes:['레몬','복숭아']},'에티오피아 핸드드립, 레몬 같은 맛');
 assert.deepEqual(row,{beanName:'에티오피아',roastery:'',brewMethod:'핸드드립',tastes:['레몬']});assert.notEqual(quickDraftKey('guest'),quickDraftKey('1'));assert.notEqual(quickDraftKey('1'),quickDraftKey('2'));assert.throws(()=>firstCupPayload({note:' '}));
});
test('curated brewing playlist contains valid distinct official video links',()=>{
 assert.equal(new Set(brewPlaylist.map(x=>parseMusicLink(x.url).id)).size,2);assert.ok(brewPlaylist.every(x=>parseMusicLink(x.url).kind==='video'));
});
