import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {beanIllustration,needsBlendIllustration} from '../src/utils/beanIllustration.js';

const catalog=JSON.parse(fs.readFileSync(new URL('../public/data/monthly-picks.json',import.meta.url),'utf8'));
test('individual flavor art is limited to unspecialty blends; other categories share bean art',()=>{
  const current=catalog.products.find(p=>p.month==='2026-11'&&p.edition==='regular');
  const blend=current.items.find(b=>b.category==='unspecialty blend');
  assert.equal(beanIllustration(blend).kind,'flavor');
  assert.equal(beanIllustration({...blend,category:'blend'}).file,'beans/common-bean.webp');
  for(const category of ['single origin','specialty single origin','drip bag','blend',undefined])assert.equal(beanIllustration({...blend,category}).kind,'coffee');
  assert.equal(beanIllustration({...blend,id:'catalog-'+blend.id}).kind,'flavor');
});
test('new or changed blend notes require review for regular/global/small; never invent flavor imagery',()=>{
  const blend=catalog.products.find(p=>p.month==='2026-11'&&p.edition==='regular').items.find(b=>b.category==='unspecialty blend');
  for(const edition of ['regular','global','small']){
    assert.equal(needsBlendIllustration({...blend,edition,flavors:['changed source note']}),true);
    assert.equal(needsBlendIllustration({...blend,edition}),false);
    assert.equal(needsBlendIllustration({id:'new',category:'unspecialty blend',edition,flavors:['레몬']}),true);
  }
  assert.equal(beanIllustration({name:'https://example.com/private.png'}).file,'beans/common-bean.webp');
});
test('all current card assets and three guide illustrations exist; original vendor colors stay intact',()=>{
  const before=JSON.stringify(catalog);
  for(const bean of catalog.products.flatMap(p=>p.items)){
    const art=beanIllustration(bean);
    assert.ok(fs.statSync(new URL('../public/images/'+art.file,import.meta.url)).size>0);
    if(bean.category!=='unspecialty blend')assert.equal(art.kind,'coffee');
  }
  for(const name of ['cup','music','save'])assert.ok(fs.existsSync(new URL(`../public/images/guide-${name}.webp`,import.meta.url)));
  assert.equal(JSON.stringify(catalog),before);
});

test('a newly published global blend without public notes keeps common art until reviewed',()=>{
 const bean={id:'new-global',category:'unspecialty blend',flavors:[],flavorColors:['#9d0208']};
 assert.equal(beanIllustration(bean).file,'beans/common-bean.webp');
 assert.equal(needsBlendIllustration(bean),true);
 assert.deepEqual(bean.flavors,[]);
});
