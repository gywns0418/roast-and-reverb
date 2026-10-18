import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyRoomIndex,eligibleRoomMusic,roomMemory,roomBackup,tasteModel,elapsedRoom,blendRoomIntent,roomMusicPool,roomTracks} from '../src/utils/ritualLogic.js';
import {readRoom,rememberRoom,moveRoomMemory,restoreRoomBackup,saveRoomProfile} from '../src/store/ritualStore.js';
const pair={bean:{id:'b',name:'Test bean',flavors:['citrus'],source:'owned'},music:{id:'m',artist:'Artist',track:'Test track',tags:['piano'],url:'https://evil.test/'}};
const memory=(id,extra={})=>roomMemory({...pair,id,date:'2026-10-14T01:00:00Z',rating:1,features:[1,.5,.8,.7],brewed:true,listened:true,...extra});
test('preference learns only confirmed firsthand ratings, unknown impressions are not measurements',()=>{
 const confirmed=Array.from({length:5},(_,i)=>memory(String(i)));
 assert.equal(tasteModel(confirmed).samples,5);assert.ok(tasteModel(confirmed).weights[0]>0);
 assert.equal(tasteModel(confirmed.map(row=>({...row,listened:false}))).samples,0);
 assert.equal(tasteModel(confirmed.map(row=>({...row,features:[null,null,null,null]}))).samples,0);
 assert.ok(tasteModel(confirmed.map(row=>({...row,rating:-1}))).weights[0]<0);
});
test('clock survives pauses and refresh without claiming listened time or accepting negative elapsed time',()=>{
 assert.equal(elapsedRoom({elapsed:30,startedAt:10000},20000),40);
 assert.equal(elapsedRoom({elapsed:30,startedAt:null},999999),30);
 assert.equal(elapsedRoom({elapsed:30,startedAt:30000},20000),30);
 assert.equal(elapsedRoom({elapsed:0,startedAt:1},99999999),7200);
});
test('personal embeddings shift intent while keeping candidates intact; repeated starter titles are deduplicated',()=>{
 const vectors=[[1,0],[.2,.8],[0,1]];const mixed=blendRoomIntent(vectors,2);
 assert.ok(mixed[0][1]>0);assert.deepEqual(mixed[1],vectors[1]);assert.deepEqual(vectors[0],[1,0]);
 assert.equal(roomMusicPool([...roomTracks,{...roomTracks[0],id:'saved',source:'record'}]).length,roomTracks.length);
});
test('memory backup strips unsafe playback URLs and rejects malformed data before replacing memories',()=>{
 assert.equal(memory('one').music.url,'');assert.throws(()=>roomBackup({schemaVersion:1,memories:[{id:'bad'}],trash:[]}));
 const clean=roomBackup({schemaVersion:1,profile:{name:'Me'},memories:[memory('one')],trash:[]});assert.equal(clean.profile.name,'Me');assert.equal(clean.memories[0].bean.name,'Test bean');
});
test('device memory saves, moves to recoverable storage, restores and merges valid backup without silent loss',()=>{
 const values=new Map();globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};globalThis.window={localStorage,dispatchEvent:()=>{}};
 saveRoomProfile({name:'Me'});rememberRoom(memory('one'));assert.equal(readRoom().memories.length,1);
 moveRoomMemory('one');assert.equal(readRoom().memories.length,0);assert.equal(readRoom().trash.length,1);
 moveRoomMemory('one',true);assert.equal(readRoom().memories.length,1);assert.equal(readRoom().trash.length,0);
 assert.throws(()=>restoreRoomBackup({schemaVersion:1,memories:[{}],trash:[]}));assert.equal(readRoom().memories[0].id,'one');
 restoreRoomBackup({schemaVersion:1,profile:{name:'Restored'},memories:[memory('two')],trash:[]});assert.equal(readRoom().memories.length,2);assert.equal(readRoom().profile.name,'Restored');
});

test('explicit no-vocal requests require known instrumental metadata instead of guessing from an artist',()=>{const unknown={id:'unknown',artist:'Artist',track:'Unknown',tags:[]},instrumental={id:'instrumental',artist:'Artist',track:'Piano',tags:['연주']};assert.deepEqual(eligibleRoomMusic([unknown,instrumental,...roomTracks],'보컬 없는 음악').map(x=>x.id),['instrumental']);assert.equal(eligibleRoomMusic([unknown,...roomTracks],'평소 음악').length,roomTracks.length+1);});

test('familiar-mode uses the nearest invitation while discovery-mode has reproducible daily variation',()=>{assert.equal(dailyRoomIndex('2026-10-14',3,false),0);assert.equal(dailyRoomIndex('2026-10-14',3,true),dailyRoomIndex('2026-10-14',3,true));assert.ok(['2026-10-14','2026-10-15','2026-10-16'].some(day=>dailyRoomIndex(day,3,true)!==0));});
