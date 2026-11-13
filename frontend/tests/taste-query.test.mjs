import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseTasteQuery,roastBadge,tasteExamples} from '../src/utils/tasteQuery.js';
import {filterMonthlyBeans} from '../src/utils/monthlyFilters.js';

const g=(acid,body,ferment)=>[{label:'산미',value:acid},{label:'바디감',value:body},{label:'발효도',value:ferment}];
const items=[
 {id:'nutty-low',name:'고소 블렌드',flavors:['구운아몬드','캐러멜'],gauges:g(1,4,1),roast:'Medium #61'},
 {id:'floral-light',name:'에티오피아 꽃',origin:'에티오피아',flavors:['자스민','복숭아'],gauges:g(4,2,2),roast:'Light #92'},
 {id:'berry-ferment',name:'베리 무산소',flavors:['라즈베리','레드와인'],gauges:g(5,3,5),roast:'Light #95'},
 {id:'choco-heavy',name:'다크 블렌드',flavors:['다크 초콜릿','흑설탕'],gauges:g(2,5,1),roast:'Dark #52',darkRoast:true},
 {id:'decaf',name:'디카페인 콜롬비아',flavors:['밀크 초콜릿'],decaf:true,roast:''},
 {id:'no-gauge',name:'지표 없음',flavors:['헤이즐넛']},
];
const ids=(query)=>filterMonthlyBeans(items,{query}).map(x=>x.id);

test('taste phrases read vendor gauges and cup-note families together',()=>{
 assert.deepEqual(ids('산미 적고 고소한'),['nutty-low']);
 assert.deepEqual(ids('꽃향 나는 가벼운'),['floral-light']);
 assert.deepEqual(ids('초콜릿 같은 묵직한'),['choco-heavy']);
 assert.deepEqual(ids('상큼한 베리'),['berry-ferment']);
 assert.deepEqual(ids('발효감 있는 와인 같은'),['berry-ferment']);
 assert.deepEqual(ids('디카페인'),['decaf']);
 assert.deepEqual(ids('다크 로스팅'),['choco-heavy']);
});

test('beans without vendor gauges are left out of gauge conditions but kept for note conditions',()=>{
 assert.ok(!ids('산미 적은').includes('no-gauge'));
 assert.ok(ids('고소한').includes('no-gauge'));
 assert.equal(parseTasteQuery('산미 적은').usesGauges,true);
 assert.equal(parseTasteQuery('고소한').usesGauges,false);
});

test('plain words still behave as text search, and leftover words must also match',()=>{
 assert.deepEqual(ids('에티오피아'),['floral-light']);
 assert.deepEqual(ids('복숭아'),['floral-light']);
 assert.deepEqual(ids('다크 초콜릿'),['choco-heavy']);
 assert.deepEqual(parseTasteQuery('에티오피아 원두 찾아줘').words,['에티오피아']);
 assert.equal(ids('').length,items.length);
});

test('contradicting gauge words do not empty the list, and labels describe what was read',()=>{
 const reading=parseTasteQuery('산미 있고 산미 없는');
 assert.deepEqual(reading.terms.map(t=>t.key),['acid-low']);
 assert.deepEqual(parseTasteQuery('산미 적고 고소한').terms.map(t=>t.label),['산미 낮음','고소한 노트']);
 assert.deepEqual(parseTasteQuery('화이트머스크').terms,[]);
});

test('roast badges come from the vendor roast label only',()=>{
 assert.equal(roastBadge({roast:'Light #92'}),'라이트 로스팅');
 assert.equal(roastBadge({roast:'Medium Light #78'}),'미디엄 라이트 로스팅');
 assert.equal(roastBadge({roast:'Medium Dark #57'}),'미디엄 다크 로스팅');
 assert.equal(roastBadge({roast:'Dark #52'}),'다크 로스팅');
 assert.equal(roastBadge({roast:''}),'');
 assert.equal(roastBadge({roast:'',darkRoast:true}),'다크 로스팅');
});

test('every example chip finds beans in the current November catalog',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../public/data/monthly-picks.json',import.meta.url),'utf8'));
 const nov=data.products.filter(p=>p.month==='2026-11').flatMap(p=>p.items.map(b=>({...b,owner:p})));
 if(!nov.length) return;
 for(const example of tasteExamples) assert.ok(filterMonthlyBeans(nov,{query:example}).length>0,example);
});
