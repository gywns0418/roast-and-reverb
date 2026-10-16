import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {parse} from '@babel/parser';

function nestedControls(source) {
  const findings=[];
  function walk(node,ancestors=[]) {
    if(!node||typeof node!=='object')return;
    let next=ancestors;
    if(node.type==='JSXElement') {
      const name=node.openingElement.name.name;
      if(['Link','NavLink','a','button'].includes(name)) {
        if(ancestors.length)findings.push(`${ancestors.at(-1)} > ${name} at line ${node.loc.start.line}`);
        next=[...ancestors,name];
      }
    }
    for(const [key,value] of Object.entries(node)) {
      if(['loc','start','end'].includes(key))continue;
      if(Array.isArray(value))value.forEach(child=>walk(child,next));
      else if(value&&typeof value==='object')walk(value,next);
    }
  }
  walk(parse(source,{sourceType:'module',plugins:['jsx']}));
  return findings;
}
test('interactive structure guard catches links inside mapped record links',()=>{
  assert.equal(nestedControls('const view=<section>{rows.map(row=><Link><Link>Room</Link><span>Record</span></Link>)}</section>').length,1);
  assert.equal(nestedControls('const view=<a><button>Save</button></a>').length,1);
  assert.deepEqual(nestedControls('const view=<section><Link>Room</Link>{rows.map(row=><Link><span>Record</span></Link>)}</section>'),[]);
});
test('source JSX has no directly nested navigation links or buttons',()=>{
  const root=fileURLToPath(new URL('../src/',import.meta.url));
  const findings=[];
  function scan(dir){for(const entry of readdirSync(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())scan(file);
    else if(file.endsWith('.jsx'))findings.push(...nestedControls(readFileSync(file,'utf8')).map(message=>`${path.relative(root,file)}: ${message}`));
  }}
  scan(root);
  assert.deepEqual(findings,[],findings.join('\n'));
});
