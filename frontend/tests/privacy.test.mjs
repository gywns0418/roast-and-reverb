import test from 'node:test';
import assert from 'node:assert/strict';
import {readPrivacy,privacyDataKeys} from '../src/utils/privacyPreferences.js';
test('unknown, corrupted, and missing privacy preferences never enable external media',()=>{
 for(const raw of [null,'broken','{}','{"version":2,"externalMedia":true}','{"version":1,"externalMedia":"true"}']){
  assert.notEqual(readPrivacy({getItem:()=>raw})?.externalMedia,true);
 }
 assert.equal(readPrivacy({getItem:()=>'כ'}),null);
 assert.equal(readPrivacy({getItem:()=>'{"version":1,"externalMedia":true}'})?.externalMedia,true);
 assert.equal(readPrivacy({getItem:()=>{throw Error('blocked');}}),null);
});
test('deletion stays within the current account and preserves consent, login, and unrelated site data',()=>{
 const keys=['rr-discovery-beans-v1-trial','rr-discovery-draft-first-cup-v1-trial','rr-discovery-beans-v1-42','rr-discovery-beans-v1-user%40example.com','roast-reverb-demo-v1','rr-monthly-favorites-v1','roast-reverb-user','rr-privacy-choice-v1','unrelated'];
 const storage={length:keys.length,key:i=>keys[i]};
 assert.deepEqual(privacyDataKeys(storage,'trial'),keys.slice(0,2).concat(keys.slice(4,6)));
 assert.deepEqual(privacyDataKeys(storage,'user@example.com',false),[keys[3],keys[5]]);
 assert.throws(()=>privacyDataKeys(storage,''));
});
