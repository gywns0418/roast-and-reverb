import test from 'node:test';
import assert from 'node:assert/strict';
import {readLinkedBeanFile,linkedInventorySignature,linkedInventoryNeedsRepair,reconcileLinkedBeans} from '../src/store/beanFileStore.js';
import {createSemanticClient} from '../src/utils/semanticClient.js';
test('unchanged source repairs a restored or missing linked shelf, preserving manual beans',async()=>{
  const content='### QA source\n- 상태: 보유\n- 남은 양: 약 80g';
  const handle={queryPermission:async()=> 'granted',getFile:async()=>({size:content.length,text:async()=>content})};
  const first=await readLinkedBeanFile({handle,hash:''});
  const synchronized=reconcileLinkedBeans([],first.incoming,[]);
  const ids=first.incoming.map(row=>row.id),link={handle,hash:first.hash,ids,inventorySignature:linkedInventorySignature(synchronized,ids)};
  assert.equal(linkedInventoryNeedsRepair(synchronized,link),false);
  assert.equal(linkedInventoryNeedsRepair([],link),true);
  const repair=await readLinkedBeanFile(link,true);assert.equal(repair.hash,first.hash);assert.ok(repair.incoming.length);
  const next=reconcileLinkedBeans([{id:'manual',name:'Manual QA',status:'held'}],repair.incoming,ids);
  assert.equal(next.find(row=>row.id==='manual').name,'Manual QA');assert.equal(linkedInventoryNeedsRepair(next,link),false);
});
function fakeWorker(){return {messages:[],stopped:false,postMessage(message){this.messages.push(message);},terminate(){this.stopped=true;}};}
test('late failure of a retired semantic worker cannot terminate its replacement',async()=>{
  const workers=[];const embed=createSemanticClient({createWorker:()=>{const worker=fakeWorker();workers.push(worker);return worker;}});
  const first=embed(['first']);const rejection=assert.rejects(first,/브라우저/);workers[0].onerror();await rejection;
  const next=embed(['next']);workers[0].onerror();assert.equal(workers[1].stopped,false);
  workers[1].onmessage({data:{id:workers[1].messages[0].id,vectors:[[1,0]]}});assert.deepEqual(await next,[[1,0]]);
});
test('postMessage failure rejects immediately without waiting for a model timeout',async()=>{
  const healthy=fakeWorker();let first=true;
  const embed=createSemanticClient({createWorker:()=>{if(first){first=false;return {...fakeWorker(),postMessage(){throw new Error('DataCloneError');}};}return healthy;}});
  await assert.rejects(embed(['test']),/전달하지 못/);await assert.rejects(embed([null]),/입력/);
  const recovered=embed(['retry']);healthy.onmessage({data:{id:healthy.messages[0].id,vectors:[[0,1]]}});assert.deepEqual(await recovered,[[0,1]]);
});
test('timeout retires the shared worker and settles every owned pending request',async()=>{
  const worker=fakeWorker(),embed=createSemanticClient({createWorker:()=>worker,timeoutMs:10});
  const results=await Promise.allSettled([embed(['one']),embed(['two'])]);assert.ok(results.every(result=>result.status==='rejected'));assert.equal(worker.stopped,true);
});
