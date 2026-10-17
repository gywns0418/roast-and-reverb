import test from 'node:test';
import assert from 'node:assert/strict';
import {createLoadingController} from '../src/utils/loadingController.js';
function clock(){let time=0,id=0;const jobs=new Map();const controller=createLoadingController({now:()=>time,schedule:(fn,ms)=>{jobs.set(++id,{fn,due:time+ms});return id;},cancel:key=>jobs.delete(key)});return {controller,advance(ms){time+=ms;for(const [key,job] of [...jobs])if(job.due<=time){jobs.delete(key);job.fn();}}};}
test('quick work holds the overlay until two seconds, without delaying the work itself',()=>{
 const {controller:c,advance}=clock();const finish=c.acquire({title:'loading'});advance(50);finish();advance(1949);assert.equal(c.getSnapshot().visible,true);advance(1);assert.equal(c.getSnapshot().visible,false);finish();assert.equal(c.getSnapshot().visible,false);
});
test('slow and overlapping requests never disappear at a fixed two-second timeout',()=>{
 const {controller:c,advance}=clock();const first=c.acquire({title:'first'});advance(3000);const second=c.acquire({title:'second'});second();assert.equal(c.getSnapshot().title,'first');first();assert.equal(c.getSnapshot().visible,false);
});
test('new request cancels a pending hide and remains visible until it finishes',()=>{
 const {controller:c,advance}=clock();const first=c.acquire({});advance(100);first();advance(1000);const second=c.acquire({});advance(2000);assert.equal(c.getSnapshot().visible,true);second();assert.equal(c.getSnapshot().visible,false);
});
