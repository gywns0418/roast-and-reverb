import test from 'node:test';
import assert from 'node:assert/strict';
import {filterMonthlyBeans,groupMonthlyBeans} from '../src/utils/monthlyFilters.js';
const items=[
 {id:'a',name:'꽃 향 원두',nameEnglish:'Floral Ethiopia',category:'single origin',origin:'에티오피아',flavors:['재스민'],flavorColors:['#8056b5'],availability:'available',decaf:false},
 {id:'b',name:'디카페인 원두',category:'blend',flavors:['초콜릿'],flavorColors:['#95704e'],availability:'available',decaf:true},
 {id:'c',name:'판매 종료 원두',category:'single origin',flavorColors:['#8056b5'],availability:'available',owner:{saleEnd:'2000-01-01'}},
 {id:'d',name:'아직 분류 없음',availability:'unknown'},
];
test('monthly search, category, color, availability and decaf filters compose without changing source records',()=>{
 const original=JSON.stringify(items);
 assert.deepEqual(filterMonthlyBeans(items,{category:'single origin',color:'purple',query:'  ETHIOPIA ',available:true,hideDecaf:true}).map(x=>x.id),['a']);
 assert.deepEqual(filterMonthlyBeans(items,{category:'blend',color:'purple'}),[]);
 assert.deepEqual(filterMonthlyBeans(items,{hideDecaf:true}).map(x=>x.id),['a','c','d']);
 assert.deepEqual(filterMonthlyBeans(items,{color:'brown'}).map(x=>x.id),['b']);
 assert.equal(JSON.stringify(items),original);
});
test('cleared filters restore every candidate, including missing metadata, while sale dates override availability',()=>{
 assert.equal(filterMonthlyBeans(items,{}).length,4);
 assert.deepEqual(filterMonthlyBeans(items,{available:true}).map(x=>x.id),['a','b']);
 assert.deepEqual(filterMonthlyBeans(items,{query:'재스민'}).map(x=>x.id),['a']);
});
test('group headings keep each candidate exactly once with an explicit unclassified group',()=>{
 const groups=groupMonthlyBeans([...items,{id:'e',category:'new-vendor-category'}]);
 assert.deepEqual(groups.map(x=>x.group.label),['하우스 블렌드','싱글','미분류']);
 assert.equal(groups.flatMap(x=>x.items).length,5);
 assert.deepEqual(groups.at(-1).items.map(x=>x.id),['d','e']);
});
