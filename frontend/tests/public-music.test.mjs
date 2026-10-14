import test from 'node:test';
import assert from 'node:assert/strict';
import {createPublicMusicClient,musicBrainzRows,youtubeEmbedRow} from '../src/utils/publicMusicClient.js';
import {mergeMusic,parseMusicLink} from '../src/utils/musicCandidates.js';
const id='12345678-1234-1234-1234-123456789abc';
const mb={count:13,recordings:[{id,title:'Says','artist-credit':[{name:'Nils Frahm'}]}]};
test('a shared watch link with a playlist still imports the selected video',()=>{
  assert.equal(parseMusicLink('https://music.youtube.com/watch?v=jfKfPfyJRdk&list=RDabcdefghijk').kind,'video');
  assert.equal(parseMusicLink('https://www.youtube.com/playlist?list=PLabcdefghijk').kind,'playlist');
});
test('public metadata preserves missing genre and does not mistake a channel for an artist',()=>{
  const song=musicBrainzRows(mb)[0];assert.equal(song.artist,'Nils Frahm');assert.equal(song.genre,'');assert.deepEqual(song.tags,[]);assert.equal(song.url,'');
  assert.equal(musicBrainzRows({recordings:[{id:'../unsafe',title:'bad'}]}).length,0);
  const video=youtubeEmbedRow('jfKfPfyJRdk',{provider_name:'YouTube',type:'video',title:'Study radio',author_name:'Lofi Girl',html:'<script>danger()</script>'});
  assert.equal(video.artist,'');assert.equal(video.channel,'Lofi Girl');assert.equal(video.html,undefined);assert.match(video.metadataSource,/미확인/);
  assert.equal(mergeMusic([video],[video]).length,1);assert.throws(()=>youtubeEmbedRow('jfKfPfyJRdk',{provider_name:'other',type:'video',title:'x',author_name:'y'}));
});
test('search coalesces identical requests, serializes different queries and observes rate spacing',async()=>{
  let calls=0,active=0,max=0;const waits=[],urls=[];
  const client=createPublicMusicClient({locks:null,wait:async ms=>{waits.push(ms);},fetcher:async(url,options)=>{calls++;active++;max=Math.max(max,active);urls.push(url);assert.equal(options.credentials,'omit');await Promise.resolve();active--;return new Response(JSON.stringify(mb));}});
  const [a,b,c]=await Promise.all([client.search('Nils Frahm'),client.search('Nils Frahm'),client.search('Norah Jones')]);
  assert.equal(calls,2);assert.equal(max,1);assert.deepEqual(waits,[1100,1100]);assert.equal(a,b);assert.equal(c.partial,true);assert.match(urls[0],/query=Nils%20Frahm/);
});
test('failed downloads can retry and malformed or large data never becomes a candidate',async()=>{
  let calls=0;const client=createPublicMusicClient({locks:null,wait:async()=>{},fetcher:async()=>{calls++;return calls===1?new Response('busy',{status:503}):new Response(JSON.stringify(mb));}});
  await assert.rejects(client.search('test'),/바쁩니다/);assert.equal((await client.search('test')).items.length,1);assert.equal(calls,2);
  const malformed=createPublicMusicClient({locks:null,wait:async()=>{},fetcher:async()=>new Response('<html>no</html>')});await assert.rejects(malformed.search('test'),/응답 형식/);
  await assert.rejects(client.search('x'.repeat(161)));await assert.rejects(client.video('../bad'));
});
test('single-video lookup uses the official endpoint and ignores remote embed markup',async()=>{
  let calls=0;const client=createPublicMusicClient({fetcher:async url=>{calls++;assert.match(url,/^https:\/\/www.youtube.com\/oembed\?/);return new Response(JSON.stringify({provider_name:'YouTube',type:'video',title:'Live',author_name:'Publisher',html:'<iframe></iframe>'}));}});
  const first=await client.video('jfKfPfyJRdk');assert.equal(first.items[0].channel,'Publisher');assert.equal(first.items[0].artist,'');assert.equal(first.partial,false);await client.video('jfKfPfyJRdk');assert.equal(calls,1);
});
