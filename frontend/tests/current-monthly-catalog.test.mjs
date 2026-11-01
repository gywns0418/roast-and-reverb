import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {currentMonthlyCatalog} from '../src/utils/currentMonthlyCatalog.js';

test('only confirmed current sale windows are selectable, inclusive of both boundary days', () => {
  const active = {saleStart:'2026-11-01',saleEnd:'2026-11-30',items:[{id:'a'}]};
  const rows = [active,{...active,saleEnd:'2026-10-31'}, {...active,saleStart:'2026-12-01'}, {...active,saleEnd:null}, {...active,items:[]}];
  assert.deepEqual(currentMonthlyCatalog(rows,'2026-11-01'),[active]);
  assert.deepEqual(currentMonthlyCatalog(rows,'2026-11-30'),[active]);
  assert.deepEqual(currentMonthlyCatalog([active],'2026-12-01'),[]);
  assert.equal(rows.length,5);
});

test('November catalog selects regular only and preserves expired source data', () => {
  const raw = fs.readFileSync(new URL('../public/data/monthly-picks.json',import.meta.url),'utf8');
  const data = JSON.parse(raw);
  const rows = Array.isArray(data) ? data : data.products;
  assert.ok(Array.isArray(rows));
  const before = JSON.stringify(rows);
  assert.deepEqual(currentMonthlyCatalog(rows,'2026-11-01').map(p=>p.edition),['regular']);
  assert.equal(currentMonthlyCatalog(rows,'2026-11-01')[0].items.length,56);
  assert.equal(JSON.stringify(rows),before);
});
