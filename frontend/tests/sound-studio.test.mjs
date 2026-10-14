import test from 'node:test';
import assert from 'node:assert/strict';
import {createScore,soundSettings,settingsForCoffee,applySoundCommand,parseSoundBackup,encodeWave,validateSoundRecipe} from '../src/utils/soundStudio.js';

test('same recipe recreates the score, new seed changes the melody',()=>{
  assert.deepEqual(createScore({},123),createScore({},123));
  assert.notDeepEqual(createScore({},123).notes,createScore({},124).notes);
  const score=createScore({},123);assert.ok(score.duration>40&&score.duration<80);
  assert.ok(score.notes.every(n=>n.time>=0&&n.time+n.duration<score.duration&&n.gain>0&&n.gain<.2));
});
test('tempo changes timings while preserving melodic pitches',()=>{
  const slow=createScore({bpm:60},10),fast=createScore({bpm:100},10);
  assert.deepEqual(slow.notes.map(n=>n.midi),fast.notes.map(n=>n.midi));
  assert.ok(slow.duration>fast.duration);
});
test('piano-only removes all other layers; missing settings are bounded',()=>{
  const settings=applySoundCommand('피아노만',{});
  assert.ok(createScore(settings,3).notes.every(n=>n.kind==='piano'));
  assert.equal(soundSettings({bpm:Infinity,mood:'__proto__'}).bpm,76);
  assert.equal(soundSettings({bpm:500,mood:'__proto__',space:-2}).bpm,110);
  assert.equal(soundSettings({space:Infinity}).space,.45);
  assert.equal(applySoundCommand('조금 느리게',{bpm:56}).bpm,56);
  assert.throws(()=>applySoundCommand('내일 날씨 알려줘',{}),/연결 준비/);
  assert.throws(()=>applySoundCommand('리듬 없이 하지 마',{}),/연결 준비/);
});
test('coffee timbre uses provided notes, never infers culture from origin',()=>{
  assert.equal(settingsForCoffee({flavors:['자스민']}).mood,'airy');
  assert.equal(settingsForCoffee({flavors:['아카시아','복숭아','감귤']}).mood,'airy');
  assert.equal(settingsForCoffee({flavors:['복숭아','감귤']}).mood,'bright');
  assert.equal(settingsForCoffee({cupNotes:'citrus'}).mood,'bright');
  assert.deepEqual(settingsForCoffee({origin:'Brazil'}),settingsForCoffee({origin:'Kenya'}));
});
test('backup validation rejects bad versions, duplicate ids, excessive tracks and seeds',()=>{
  const track={version:1,id:'x',title:'my cup',createdAt:'2026-10-15T00:00:00Z',seed:42,settings:{}};
  const backup={format:'roast-reverb-sounds',version:1,tracks:[track]};
  assert.equal(parseSoundBackup(backup)[0].seed,42);
  assert.throws(()=>parseSoundBackup({...backup,tracks:[track,track]}));
  assert.throws(()=>parseSoundBackup({...backup,tracks:Array(25).fill(track)}));
  assert.throws(()=>validateSoundRecipe({...track,version:2}));
  assert.throws(()=>validateSoundRecipe({...track,seed:-1}));
  assert.throws(()=>validateSoundRecipe({...track,createdAt:'broken'}));
  assert.equal(validateSoundRecipe({...track,settings:{bpm:1e9}}).settings.bpm,110);
});
test('WAV has correct stereo layout, length and bounded signed PCM samples',()=>{
  const wave=encodeWave([new Float32Array([1,-1,.5]),new Float32Array([2,NaN,-2])],32000),v=new DataView(wave);
  assert.equal(new TextDecoder().decode(new Uint8Array(wave,0,4)),'RIFF');
  assert.equal(v.getUint32(4,true),wave.byteLength-8);assert.equal(v.getUint16(22,true),2);
  assert.equal(v.getUint32(24,true),32000);assert.equal(v.getUint32(40,true),12);
  assert.equal(v.getInt16(44,true),32767);assert.equal(v.getInt16(46,true),32767);
  assert.equal(v.getInt16(48,true),-32768);assert.equal(v.getInt16(50,true),0);
  assert.equal(v.getInt16(54,true),-32768);
  assert.throws(()=>encodeWave([new Float32Array(1),new Float32Array(2)],32000));
});
