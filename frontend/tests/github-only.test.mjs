import test from 'node:test';
import assert from 'node:assert/strict';
import {organizeCup,soundAdvice} from '../src/utils/localCompanion.js';
test('local organizer only extracts literal user words, never invents a bean or roastery',()=>{
  assert.deepEqual(organizeCup('핸드드립으로 내렸고 초콜릿 맛과 고소한 향이 났어.'),{beanName:'',roastery:'',brewMethod:'핸드드립',tastes:['초콜릿','고소']});
  assert.deepEqual(organizeCup('오늘은 그냥 따뜻했어.').tastes,[]);
  assert.throws(()=>organizeCup(''));
  const answer=soundAdvice({message:'조용하게 숨 고르기, 여운을 길게',settings:{mood:'airy',bpm:90}});
  assert.equal(answer.settings.bpm,65);assert.equal(answer.settings.mood,'airy');assert.equal(answer.settings.space,.85);
  assert.match(answer.reply,/규칙/);
});
test('GitHub notebook persists edits across reload, computes actual counts, and removes orphan pairings',async()=>{
  const data=new Map();globalThis.localStorage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
  const {localRequest:request}=await import('../src/api/mockApi.js?github-only=first');
  const post=(path,body)=>request(path,{method:'POST',body:JSON.stringify(body)});
  assert.deepEqual(await request('/coffee'),[]);
  assert.deepEqual(await request('/admin/members'),[]);
  const coffee=await post('/coffee',{beanName:'내 원두',tasteNote:'초콜릿, 고소함',acidity:2});
  const music=await post('/music',{trackName:'직접 입력',genre:'jazz'});
  const analysis=await post('/pairing/analyze',{coffeeLogId:coffee.coffeeLogId,musicLogId:music.musicLogId});
  assert.match(analysis.aiReason,/rr-local-v1/);
  await post('/pairing',{coffeeLogId:coffee.coffeeLogId,musicLogId:music.musicLogId,...analysis});
  await request(`/coffee/${coffee.coffeeLogId}`,{method:'PUT',body:JSON.stringify({memo:'수정한 감상'})});
  const {localRequest:reloaded}=await import('../src/api/mockApi.js?github-only=reloaded');
  assert.equal((await reloaded('/coffee'))[0].memo,'수정한 감상');
  assert.equal((await reloaded('/coffee/statistics')).avgAcidity,2);
  assert.equal((await reloaded('/admin/dashboard')).coffeeLogCount,1);
  assert.equal((await reloaded('/pairing')).length,1);
  await reloaded(`/coffee/${coffee.coffeeLogId}`,{method:'DELETE'});
  assert.deepEqual(await reloaded('/pairing'),[]);
  await assert.rejects(reloaded('/unknown'),/지원하지/);
  await assert.rejects(reloaded('/auth/login',{method:'POST',body:'{}'}),/가입 없이/);
});
test('monthly note scoring derives from supplied taste words and keeps unknowns unknown',async()=>{
  const {localRequest:request}=await import('../src/api/mockApi.js?github-only=monthly');
  const note=await request('/monthly-picks',{method:'POST',body:JSON.stringify({month:'2026-11',roastery:'직접 입력',rawOptionsText:'초콜릿과 견과\n원두 이름만'})});
  const scored=await request(`/monthly-picks/${note.monthly_pick_id}/score`,{method:'POST'});
  assert.equal(typeof scored.options[0].score,'number');assert.equal(scored.options[1].score,null);
  assert.match(scored.options[0].score_reason,/특성 유사도/);
});

test('a stale tab cannot overwrite records saved or restored by another tab',async()=>{
 const rows=new Map();globalThis.localStorage={getItem:key=>rows.get(key)??null,setItem:(key,value)=>rows.set(key,value)};
 const {localRequest:first}=await import('../src/api/mockApi.js?github-only=tab-one');
 const {localRequest:second}=await import('../src/api/mockApi.js?github-only=tab-two');
 await first('/coffee',{method:'POST',body:JSON.stringify({beanName:'保管'})});
 const saved=rows.get('roast-reverb-demo-v1');
 await assert.rejects(second('/music',{method:'POST',body:JSON.stringify({trackName:'stale'})}),/다른 탭/);
 assert.equal(rows.get('roast-reverb-demo-v1'),saved);
});
