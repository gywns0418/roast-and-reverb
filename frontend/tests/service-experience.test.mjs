import test from 'node:test';
import assert from 'node:assert/strict';
import {journeyEntry,journeyProgress} from '../src/utils/journey.js';
import {validateDraft} from '../src/utils/draft.js';
import {collectDeviceBackup,restoreDeviceBackup,parseDeviceBackup,backupKeys} from '../src/utils/deviceBackup.js';
import {safeReturnPath} from '../src/utils/returnPath.js';
const entry=(id,guideId,practiced)=>journeyEntry({id,guideId,practiced,savedAt:'2026-10-16T00:00:00Z',notes:['내가 직접 적은 관찰','','']});
test('reading or planning does not claim practice, duplicate practices count once and goals change next discovery',()=>{
  const plan=entry('1','first-note',false);assert.equal(journeyProgress([plan]).completed,0);
  const practiced=entry('2','first-note',true),repeat=entry('3','first-note',true);
  assert.equal(journeyProgress([plan,practiced,repeat]).completed,1);
  assert.equal(journeyProgress([practiced],'coffee').next.id,'cooling');
  assert.equal(journeyProgress([practiced],'rest').next.id,'body-rhythm');
  assert.throws(()=>journeyEntry({...plan,notes:['','','']}));assert.throws(()=>journeyEntry({...plan,guideId:'invented'}));
});
test('discovery notes and scoped drafts survive backup without authentication fields or fabricated diary records',()=>{
  const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const keys=backupKeys('member-8');storage.setItem(keys['journey-entries'],JSON.stringify([entry('1','first-note',true)]));
  storage.setItem(keys['draft-coffee'],JSON.stringify([{version:1,updatedAt:'2026-10-16',value:{beanName:'My coffee',memo:'unfinished',drinkDate:'2026-10-16'}}]));
  storage.setItem(backupKeys('other')['journey-entries'],'[{"private":"other"}]');storage.setItem('roast-reverb-user','{"token":"private-token"}');
  const backup=collectDeviceBackup(storage,'member-8',false);assert.equal(backup.sections.diary,undefined);assert.ok(!JSON.stringify(backup).includes('private'));
  const destination=new Map(),target={getItem:k=>destination.get(k)??null,setItem:(k,v)=>destination.set(k,v),removeItem:k=>destination.delete(k)};
  assert.equal(restoreDeviceBackup(target,backup,'member-8',false),2);
  assert.equal(JSON.parse(destination.get(keys['draft-coffee']))[0].value.memo,'unfinished');
});
test('malformed or credential-bearing drafts fail before restoring unrelated data',()=>{
  const base={version:1,updatedAt:'2026-10-16',value:{beanName:'Coffee',memo:'',drinkDate:'2026-10-16'}};
  assert.equal(validateDraft(base,'draft-coffee').value.beanName,'Coffee');
  assert.throws(()=>validateDraft({...base,value:{}},'draft-coffee'));
  assert.throws(()=>validateDraft({...base,value:{...base.value,password:'secret'}}));
  assert.throws(()=>parseDeviceBackup({format:'roast-reverb-device',version:1,sections:{'draft-journey':[base]}}));
});
test('authentication returns only to an internal page',()=>{
  assert.equal(safeReturnPath('/coffee/write'),'/coffee/write');
  for(const value of ['https://evil.test','//evil.test','/\\evil.test','/auth/login',null])assert.equal(safeReturnPath(value),'/journey');
});
test('expired authentication drops the credential while retaining identity for scoped drafts',async()=>{
  const values=new Map();let changes=0;
  globalThis.window={localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},dispatchEvent:()=>{changes++;}};
  const {authStore}=await import('../src/store/authStore.js');
  authStore.setUser({memberId:8,email:'qa@example.test',token:'test-only'});authStore.expire();
  assert.equal(authStore.token,null);assert.equal(authStore.user.memberId,8);assert.equal(changes,2);
});
test('a fresh trial does not create fictional coffee, music or listening history',async()=>{
  const values=new Map();globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  const {mockRequest}=await import(`../src/api/mockApi.js?fresh-service=${Date.now()}`);
  assert.deepEqual(await mockRequest('/coffee'),[]);assert.deepEqual(await mockRequest('/music'),[]);assert.deepEqual(await mockRequest('/pairing'),[]);
  assert.equal(values.size,0);
});
