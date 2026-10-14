import test from 'node:test';
import assert from 'node:assert/strict';
import {readLinkedBeanFile,reconcileLinkedBeans} from '../src/store/beanFileStore.js';
import {coffeeMusicBrief} from '../src/utils/coffeeMusicBrief.js';
function link(content,permission='granted'){return {handle:{queryPermission:async()=>permission,getFile:async()=>({size:content.length,text:async()=>content})},ids:[],hash:''};}
test('linked file rereads original changes and permission loss never reads or writes the file',async()=>{
 const first=await readLinkedBeanFile(link('### QA\n- 상태: 보유\n- 남은 양: 약 80g'));
 const same=await readLinkedBeanFile({...link('### QA\n- 상태: 보유\n- 남은 양: 약 80g'),hash:first.hash});assert.equal(same.incoming,null);
 const changed=await readLinkedBeanFile({...link('### QA\n- 상태: 소진'),hash:first.hash});assert.equal(changed.incoming[0].status,'exhausted');assert.notEqual(changed.hash,first.hash);
 let read=false;const denied=await readLinkedBeanFile({handle:{queryPermission:async()=> 'prompt',getFile:async()=>{read=true;}}});assert.equal(denied.permission,false);assert.equal(read,false);
 await assert.rejects(()=>readLinkedBeanFile(link('invalid file')));
});
test('removed linked beans are retained as unknown while manual beans and current data survive',()=>{
 const next=reconcileLinkedBeans([{id:'old',status:'held'},{id:'manual',status:'held'},{id:'kept',remaining:'old'}],[{id:'kept',remaining:'new',status:'held'}],['old','kept']);
 assert.equal(next.find(x=>x.id==='old').status,'unknown');assert.equal(next.find(x=>x.id==='manual').status,'held');assert.equal(next.find(x=>x.id==='kept').remaining,'new');
});
test('music brief reflects stated coffee notes and does not pretend to create an audio file',()=>{
 assert.throws(()=>coffeeMusicBrief({}));const a=coffeeMusicBrief({cupNotes:'citrus',originCountry:'Ethiopia'}),b=coffeeMusicBrief({cupNotes:'chocolate',originCountry:'Brazil'});
 assert.notEqual(a.prompt,b.prompt);assert.ok(a.prompt.includes('Ethiopia'));assert.ok(a.prompt.includes('No imitation'));assert.equal(a.audio,undefined);
});
