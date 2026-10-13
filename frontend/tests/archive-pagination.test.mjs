import test from "node:test";
import assert from "node:assert/strict";
import { listDiaryRecords } from "../src/utils/diaryRecords.js";

test("archive totals include records beyond the API default page and preserve date filters", async () => {
  const records = Array.from({length:237}, (_,id) => ({id}));
  const calls = [];
  const result = await listDiaryRecords(async params => { calls.push(params); return records.slice(params.offset,params.offset+params.limit); }, {from:"2026-10-01"}, true);
  assert.equal(result.length,237);
  assert.equal(result[236].id,236);
  assert.deepEqual(calls.map(item => item.offset),[0,200]);
  assert.ok(calls.every(item => item.from === "2026-10-01"));
});
test("local diary is requested once because it already returns the entire archive", async () => {
  let calls=0;
  const result=await listDiaryRecords(async () => { calls++; return Array.from({length:400},(_,id)=>({id})); }, {}, false);
  assert.equal(calls,1);
  assert.equal(result.length,400);
});
