import test from 'node:test';
import assert from 'node:assert/strict';
import {repeatBrew,recipeChanges} from '../src/utils/repeatBrew.js';

test('repeat recipe excludes identity, ratings, consumption and previous observations',()=>{
  const original={id:8,bean:'Test bean',date:'2026.10.01',waterTemp:92,brewTime:150,acidity:5,memo:'old',brewDetails:{doseGrams:16,waterGrams:245,beverageGrams:210,recordedHour:8,aftertaste:'old',nextExperiment:'old',soundtrack:{listened:true},momentNote:'old',grinder:'Test'}};
  const next=repeatBrew(original,'2026-10-17');
  assert.equal(next.drinkDate,'2026-10-17');
  assert.equal(next.tasteNote,'');assert.equal(next.memo,'');
  assert.equal(next.id,undefined);assert.equal(next.acidity,undefined);
  assert.deepEqual(next.brewDetails,{doseGrams:16,waterGrams:245,grinder:'Test'});
  assert.equal(original.brewDetails.beverageGrams,210);
});
test('comparison treats numeric input strings equally and detects added or cleared conditions',()=>{
  const previous={waterTemp:92,grindSize:'51',brewDetails:{doseGrams:16}};
  assert.deepEqual(recipeChanges(previous,{waterTemp:'92',grindSize:'51',brewDetails:{doseGrams:'16'}}),[]);
  const changes=recipeChanges(previous,{waterTemp:'',grindSize:'52',brewDetails:{doseGrams:16,waterGrams:245}});
  assert.equal(changes.length,3);assert.equal(changes[0].before,'92');assert.equal(changes[0].after,'');
});
