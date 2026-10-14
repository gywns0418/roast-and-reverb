import test from 'node:test';
import assert from 'node:assert/strict';
import {collectDeviceBackup,restoreDeviceBackup,parseDeviceBackup,backupKeys} from '../src/utils/deviceBackup.js';
import {readApiResponse} from '../src/api/response.js';
const store=()=>{const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
test('unified backup excludes sessions, credentials, another account and file permissions',()=>{
  const storage=store();storage.setItem('roast-reverb-user','{"token":"private"}');
  storage.setItem(backupKeys('trial').beans,'[]');storage.setItem(backupKeys('other-user').beans,'[{"name":"private"}]');
  const backup=collectDeviceBackup(storage);
  assert.deepEqual(Object.keys(backup.sections),['beans']);assert.ok(!JSON.stringify(backup).includes('private'));
});
test('restore validates all sections before any write and rejects unsafe fields',()=>{
  const storage=store();storage.setItem(backupKeys().beans,'[]');
  assert.throws(()=>restoreDeviceBackup(storage,{format:'roast-reverb-device',version:1,sections:{beans:[],unknown:[]}}));
  assert.equal(storage.getItem(backupKeys().beans),'[]');
  assert.throws(()=>parseDeviceBackup({format:'roast-reverb-device',version:1,sections:{beans:[{name:'bean',token:'secret'}]}}));
  assert.throws(()=>parseDeviceBackup({format:'roast-reverb-device',version:1,sections:{'sound-tracks':[{}]}}));
});
test('partial restore retains unrelated sections and rolls back earlier writes on quota failure',()=>{
  const storage=store(),keys=backupKeys();storage.setItem(keys.beans,'[]');storage.setItem(keys.music,'[]');storage.setItem(keys.favorites,'[7]');
  const originalWrite=storage.setItem;storage.setItem=(key,value)=>{if(key===keys.music)throw new Error('QuotaExceededError');originalWrite(key,value);};
  assert.throws(()=>restoreDeviceBackup(storage,{format:'roast-reverb-device',version:1,sections:{beans:[{name:'new'}],music:[]}}),/이전 자료를 유지/);
  assert.equal(storage.getItem(keys.beans),'[]');assert.equal(storage.getItem(keys.favorites),'[7]');
  storage.setItem=originalWrite;assert.equal(restoreDeviceBackup(storage,{format:'roast-reverb-device',version:1,sections:{favorites:[8]}}),1);
  assert.equal(storage.getItem(keys.favorites),'[8]');assert.equal(storage.getItem(keys.music),'[]');
});
test('server mode cannot restore local diary over server records',()=>{
  const storage=store(),diary={coffeeLogs:[],musicLogs:[],pairings:[],collections:[],monthlyPicks:[]};
  assert.throws(()=>restoreDeviceBackup(storage,{format:'roast-reverb-device',version:1,sections:{diary}},'member-1',false),/サーバー|서버/);
  assert.equal(storage.values.size,0);
});
test('API envelopes preserve zero and reject false success and malformed JSON',async()=>{
  assert.equal(await readApiResponse(new Response(JSON.stringify({success:true,data:0}))),0);
  await assert.rejects(readApiResponse(new Response(JSON.stringify({success:false,message:'failed'}))),/failed/);
  await assert.rejects(readApiResponse(new Response('<html>not JSON</html>')),/완료 여부/);
  await assert.rejects(readApiResponse(new Response('<html>bad gateway</html>',{status:502})),/502/);
  assert.equal(await readApiResponse(new Response(null,{status:204})),null);
});
test('failed diary storage rolls back memory and ids; missing details never return another record',async()=>{
  const storage=store();globalThis.localStorage=storage;
  const {mockRequest}=await import('../src/api/mockApi.js?quality=rollback');
  const before=await mockRequest('/coffee');const write=storage.setItem;
  storage.setItem=()=>{throw new Error('quota');};
  await assert.rejects(mockRequest('/coffee',{method:'POST',body:JSON.stringify({beanName:'failed'})}),/quota/);
  assert.deepEqual(await mockRequest('/coffee'),before);
  storage.setItem=write;
  await assert.rejects(mockRequest('/coffee/999999'),/찾을 수/);
  const created=await mockRequest('/music',{method:'POST',body:JSON.stringify({trackName:'Unclassified',artistName:'Test'})});
  assert.equal(created.genre,'');assert.equal(created.tags,'');
});
test('corrupted diary fails closed and cannot overwrite the damaged copy',async()=>{
  const storage=store();storage.setItem('roast-reverb-demo-v1','{damaged');globalThis.localStorage=storage;
  const {mockRequest}=await import('../src/api/mockApi.js?quality=corrupt');
  await assert.rejects(mockRequest('/coffee'),/복구/);
  await assert.rejects(mockRequest('/coffee',{method:'POST',body:'{}'}),/복구/);
  assert.equal(storage.getItem('roast-reverb-demo-v1'),'{damaged');
});
test('device save cannot overwrite unreadable inventory with an empty recovered view',async()=>{
  const storage=store();globalThis.localStorage=storage;globalThis.window={localStorage:storage,dispatchEvent:()=>{}};
  const {saveDevice}=await import('../src/store/discoveryStore.js');
  const key=backupKeys().beans;storage.setItem(key,'{"broken":true}');
  assert.throws(()=>saveDevice('beans',[]),/백업/);
  assert.equal(storage.getItem(key),'{"broken":true}');
});
