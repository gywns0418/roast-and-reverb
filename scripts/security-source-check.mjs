import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
const rules=[/sk-proj-[A-Za-z0-9_-]{25,}/,/gh[pousr]_[A-Za-z0-9]{30,}/,/AIza[A-Za-z0-9_-]{30,}/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/];
const hits=[];
for(const file of execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean)){
 if(/\.(?:png|webp|jpg|wav|mp3|pdf)$/.test(file))continue;
 const value=fs.readFileSync(file,'utf8');if(rules.some(rule=>rule.test(value)))hits.push(file);
}
console.log(hits.length?JSON.stringify({possibleCredentialFiles:hits}):'PASS: no known credential pattern in tracked source (not a full secret audit)');
if(hits.length)process.exitCode=1;
