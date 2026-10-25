import test from 'node:test';
import assert from 'node:assert/strict';
import {catalogAvailability} from '../src/utils/catalogAvailability.js';
test('sale dates override stale inventory and the final sale day remains inclusive',()=>{
 const product={saleStart:'2026-10-01',saleEnd:'2026-10-18'},bean={availability:'available'};
 assert.equal(catalogAvailability(product,bean,'2026-10-19'),'ended');
 assert.equal(catalogAvailability(product,bean,'2026-10-18'),'available');
 assert.equal(catalogAvailability(product,bean,'2026-09-30'),'upcoming');
 assert.equal(catalogAvailability(product,{availability:'unknown'},'2026-10-10'),'unknown');
 assert.equal(bean.availability,'available');
});
