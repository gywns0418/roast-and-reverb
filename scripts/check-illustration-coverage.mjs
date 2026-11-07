import {readFile,stat} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {currentMonthlyCatalog,koreaToday} from '../frontend/src/utils/currentMonthlyCatalog.js';
import {beanIllustration,needsBlendIllustration} from '../frontend/src/utils/beanIllustration.js';

const today=process.argv.find(value=>value.startsWith('--today='))?.slice(8)||koreaToday();
if(!/^\d{4}-\d{2}-\d{2}$/.test(today))throw new Error('Expected --today=YYYY-MM-DD');
const catalog=JSON.parse(await readFile(resolve('frontend/public/data/monthly-picks.json'),'utf8'));
const imageRoot=resolve('frontend/public/images');
const pending=[],files=new Set(['beans/common-bean.webp']);
const editions=currentMonthlyCatalog(catalog.products,today).map(product=>{
  let individual=0;
  for(const bean of product.items){
    const art=beanIllustration(bean);files.add(art.file);
    if(art.kind==='flavor')individual++;
    if(needsBlendIllustration(bean))pending.push({edition:product.edition,month:product.month,id:bean.id,name:bean.name,flavors:bean.flavors||[]});
  }
  return {edition:product.edition,month:product.month,total:product.items.length,individual,common:product.items.length-individual};
});
for(const file of files){
  const path=resolve(imageRoot,file),inside=relative(imageRoot,path);
  if(inside.startsWith('..'+sep)||inside==='..'||!inside||!(await stat(path)).isFile())throw new Error('Missing or unsafe artwork: '+file);
}
console.log(JSON.stringify({today,policy:'unspecialty blend only; all other categories share common bean art',editions,pending},null,2));
if(pending.length)process.exitCode=2;
