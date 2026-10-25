import test from 'node:test';
import assert from 'node:assert/strict';
import {playlistLink,personalMusic} from '../src/utils/brewMusic.js';
import {parseDeviceBackup} from '../src/utils/deviceBackup.js';
test('playlist sharing strips unrelated parameters and never accepts credentials or private history shortcuts',()=>{
 const link=playlistLink('https://music.youtube.com/watch?v=BzYnNdJhZQw&list=PL1234567890ABCDE&authuser=1');assert.equal(link.kind,'playlist');assert.equal(link.url,'https://www.youtube.com/playlist?list=PL1234567890ABCDE');
 for(const url of ['https://user:secret@youtube.com/playlist?list=PL1234567890ABCDE','https://evil.test/playlist?list=PL1234567890ABCDE','https://music.youtube.com/playlist?list=LM','https://youtube.com/playlist?list=HL'])assert.throws(()=>playlistLink(url));
 const backup={format:'roast-reverb-device',version:1,sections:{'youtube-playlist':[{url:link.url}]}};assert.equal(parseDeviceBackup(backup)['youtube-playlist'][0].url,link.url);
 assert.throws(()=>parseDeviceBackup({...backup,sections:{'youtube-playlist':[{url:'https://evil.test'}]}}));
});
test('personal candidates are only supplied records; duplicate URLs merge and unsafe media cannot reach playback',()=>{
 const records=[{track:'내 곡',artist:'나',url:'https://youtu.be/BzYnNdJhZQw'},{track:'다른 곡',artist:'나',url:'javascript:alert(1)'}];
 const rows=personalMusic(records,[{track:'내 곡',artist:'나',url:'https://music.youtube.com/watch?v=BzYnNdJhZQw'}]);assert.equal(rows.length,2);assert.equal(rows[1].url,'');assert.ok(rows.every(x=>x.listened===undefined&&x.playCount===undefined));assert.deepEqual(personalMusic([],[]),[]);
});
