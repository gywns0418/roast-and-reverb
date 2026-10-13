import test from 'node:test';
import assert from 'node:assert/strict';
import {parseBeansMarkdown,beanStatus,mergeBeans,validateBeansFile} from '../src/utils/beanInventory.js';
import {parseMusicLink,parseMusicLines,mergeMusic} from '../src/utils/musicCandidates.js';
import {rankDiscovery,cosine} from '../src/utils/discoveryRanking.js';
test('inventory preserves unknown quantities and excludes tasting sections without inventing dates',()=>{
 const rows=parseBeansMarkdown('## 보유\n### Test bean\n- 상태: 거의 소진\n- 남은 양: 약 80g 추정\n- 로스터리: Test\n## 시음\n### Not inventory\n- 상태: 보유');
 assert.equal(rows.length,1);assert.equal(rows[0].status,'held');assert.equal(rows[0].remainingBasis,'estimated');assert.equal(rows[0].roastDate,'');
 assert.equal(beanStatus('소진 (완료)'),'exhausted');assert.equal(beanStatus('배송 중'),'pending');assert.equal(beanStatus(''),'unknown');
 assert.equal(mergeBeans(rows,rows).length,1);assert.equal(validateBeansFile({schemaVersion:1,beans:rows})[0].remaining,'약 80g 추정');
});
test('music imports reject unsafe links and preserve candidates at capacity',()=>{
 assert.equal(parseMusicLink('https://music.youtube.com/watch?v=abcdefghijk').kind,'video');
 for(const url of ['http://youtube.com/watch?v=abcdefghijk','https://youtube.com.evil.test/watch?v=abcdefghijk','https://user@youtube.com/watch?v=abcdefghijk'])assert.throws(()=>parseMusicLink(url));
 assert.throws(()=>parseMusicLines('Artist\tTrack\t\thttps://evil.test/'));
 assert.equal(parseMusicLines('Artist\tTrack')[0].genre,'');
 const previous=Array.from({length:250},(_,i)=>({id:String(i)}));assert.throws(()=>mergeMusic(previous,[{id:'new'}]));assert.equal(previous.length,250);
});
test('discovery excludes exhausted beans and avoided genres, with explicit semantic ranking',()=>{
 const beans=[{id:'held',name:'Test',source:'owned',status:'held',flavors:['citrus']},{id:'empty',name:'Old',source:'owned',status:'exhausted'}];
 const music=[{id:'j',track:'J',genre:'Jazz'},{id:'p',track:'P',genre:'Piano',source:'external'}];
 const rows=rankDiscovery({beans,music,situation:'재즈 말고 차분한 음악',vectors:[[1,0],[1,0],[0,1],[0,1],[1,0]]});
 assert.equal(rows.length,1);assert.equal(rows[0].bean.id,'held');assert.equal(rows[0].music.id,'p');assert.equal(rows[0].semantic,1);assert.equal(cosine([0,0],[1,0]),0);
});
