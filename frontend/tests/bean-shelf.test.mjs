import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBeansMarkdown,validateBeansFile} from '../src/utils/beanInventory.js';
import {shelfBeans,checkedBeanPhotos} from '../src/utils/beanShelf.js';
test('purchase facts survive Markdown and backup; brew observations do not become bag features',()=>{
 const rows=parseBeansMarkdown('## 구매 원두\n### 아주 긴 원두 이름\n- 상태: 보유\n- 구매 날짜: 2026-10-18\n- 구매 용량: 200g\n- 원산지: 에티오피아\n- 농장: 농장 A\n- 생산자: 생산자 B\n- 품종: 74158\n- 가공: 워시드\n- 고도: 2000m\n- 컵노트: 레몬, 자스민\n- 내가 느낀 맛: 씁쓸함\n- 이미지 파일: coffee.jpg');
 const restored=validateBeansFile({schemaVersion:1,beans:rows});const [bag]=shelfBeans(restored);
 assert.equal(bag.purchaseDate,'2026-10-18');assert.equal(bag.imageFile,'coffee.jpg');assert.equal(bag.farm,'농장 A');assert.deepEqual(bag.flavors,['레몬','자스민']);assert.equal(bag.memo,'');assert.equal(bag.brew,'');assert.deepEqual(bag.brewDetails,{});
 assert.throws(()=>parseBeansMarkdown(readFileSync(new URL('../public/templates/bean-purchase.md',import.meta.url),'utf8')));
});
test('bean photos never accept SVG, remote URLs, duplicates or oversized images',()=>{
 assert.throws(()=>checkedBeanPhotos([{id:'bean',data:'data:image/svg+xml;base64,PHN2Zz4='}]));
 assert.throws(()=>checkedBeanPhotos([{id:'bean',data:'https://example.com/image.jpg'}]));
 const photo={id:'bean',data:'data:image/webp;base64,UklGRg=='};
 assert.equal(checkedBeanPhotos([photo])[0].id,'bean');assert.throws(()=>checkedBeanPhotos([photo,photo]));assert.throws(()=>checkedBeanPhotos([{...photo,data:photo.data+'A'.repeat(400000)}]));
});
