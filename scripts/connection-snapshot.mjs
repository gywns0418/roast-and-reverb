import {readFile,writeFile,mkdir,readdir,lstat,realpath} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parseBeansMarkdown} from '../frontend/src/utils/beanInventory.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),privateRoot=resolve(root,'../coffe_brew_log'),folder=resolve(root,'.local');
const output=resolve(folder,'connection-snapshot.json');
async function beanFiles(directory,depth=0){
  if(depth>4)return [];
  const rows=await readdir(directory,{withFileTypes:true}).catch(error=>{if(error.code==='ENOENT')return [];throw error;});
  const result=[];
  for(const row of rows){if(row.isSymbolicLink()||row.name.startsWith('.')||['node_modules','__pycache__','venv'].includes(row.name))continue;const path=resolve(directory,row.name);if(row.isDirectory())result.push(...await beanFiles(path,depth+1));else if(row.isFile()&&row.name.toLowerCase()==='beans.md')result.push(path);}
  return result.sort();
}
let old={};try{old=JSON.parse(await readFile(output,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
const sources=[];
for(const path of await beanFiles(privateRoot)) {
  const actual=await realpath(path),boundary=relative(privateRoot,actual);if(boundary.startsWith('..')||boundary.includes(':'))throw new Error('연결 원본이 허용된 폴더 밖에 있습니다.');
  const stat=await lstat(path);if(stat.isSymbolicLink()||stat.size>1_000_000)throw new Error('원두 원본의 크기 또는 링크 상태를 확인해 주세요.');
  const content=await readFile(path,'utf8'),hash=createHash('sha256').update(content).digest('hex'),beans=parseBeansMarkdown(content);
  sources.push({kind:'bean-inventory',path:actual,hash,items:beans.length,held:beans.filter(bean=>bean.status==='held').length,changed:old.privateSources?.find(source=>source.path===actual)?.hash!==hash});
}
const catalog=JSON.parse(await readFile(resolve(root,'frontend/public/data/monthly-picks.json'),'utf8'));
if(catalog.schemaVersion!==1||!Array.isArray(catalog.products))throw new Error('월픽 자료 형식을 확인해 주세요.');
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const snapshot={checkedAt:new Date().toISOString(),privateSources:sources,publicCatalog:catalog.products.map(product=>({month:product.month,source:product.sourceUrl,checkedAt:product.sourceCheckedAt,items:product.items.length})),git:{branch:git(['branch','--show-current']),commit:git(['rev-parse','HEAD']),dirty:!!git(['status','--porcelain'])}};
await mkdir(folder,{recursive:true});await writeFile(output,JSON.stringify(snapshot,null,2)+'\n');
// Details stay in ignored local storage; the routine needs only change/status signals.
console.log(JSON.stringify({privateSources:sources.length,changedPrivateSources:sources.filter(source=>source.changed).length,catalogProducts:snapshot.publicCatalog.length,workingTreeDirty:snapshot.git.dirty}));
