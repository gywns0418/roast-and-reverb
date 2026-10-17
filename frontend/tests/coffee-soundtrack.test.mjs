import test from 'node:test';
import assert from 'node:assert/strict';
import {matchedSoundtrack,generatedSoundtrack,readSoundtrack,soundtrackRecords} from '../src/utils/coffeeSoundtrack.js';
import {coffeePayload} from '../src/utils/brewDetails.js';
import {adaptCoffeeLog} from '../src/api/adapters.js';
import {createScore} from '../src/utils/soundStudio.js';

test('a matched song remains unlistened until confirmed, unsafe links never reach the player',()=>{
  const song=matchedSoundtrack({track:'Test track',channel:'Uploader',url:'javascript:alert(1)'});
  assert.equal(song.artist,'');assert.equal(song.channel,'Uploader');assert.equal(song.listened,false);
  assert.ok(song.url.startsWith('https://'));assert.ok(!song.url.startsWith('javascript:'));
  assert.equal(readSoundtrack({...song,listened:'true'}).listened,false);
  assert.equal(readSoundtrack({...song,listened:true}).listened,true);
});
test('cup, recipe and shared note survive server-shaped serialization and an edit together',()=>{
  const song=generatedSoundtrack({version:1,id:'test-sound',title:'Test cup',createdAt:'2026-10-17T00:00:00Z',seed:42,settings:{mood:'airy'}});
  const payload=coffeePayload({beanName:'Test bean',drinkDate:'2026-10-17',brewDetails:{doseGrams:16,soundtrack:song,momentNote:'My own words'}});
  const adapted=adaptCoffeeLog({coffee_log_id:5,bean_name:payload.beanName,drink_date:payload.drinkDate,brew_details:JSON.stringify(payload.brewDetails)});
  const restored=readSoundtrack(adapted.brewDetails.soundtrack);
  assert.deepEqual(createScore(restored.recipe.settings,restored.recipe.seed),createScore(song.recipe.settings,song.recipe.seed));
  assert.equal(adapted.brewDetails.momentNote,'My own words');assert.equal(adapted.brewDetails.doseGrams,16);
  const rows=soundtrackRecords([adapted]);assert.equal(rows[0].path,'/coffee/5');assert.equal(rows[0].listened,false);
  assert.equal(readSoundtrack({...song,recipe:{...song.recipe,seed:-1}}),null);
  assert.equal(readSoundtrack({version:1,kind:'unknown'}),null);
});
