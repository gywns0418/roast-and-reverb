// Keeps credentials in backend process environment, never in Vite or command arguments.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const jar=path.join(root,'backend/target/roast-and-reverb-backend-0.1.0.jar');
if(!fs.existsSync(jar))throw new Error('Build backend first: mvn -f backend/pom.xml package');
const line=fs.readFileSync(path.join(root,'.env.local'),'utf8').split(/\r?\n/).find(row=>/^OPENAI_API_KEY\s*=/.test(row));
const key=line?.slice(line.indexOf('=')+1).trim().replace(/^['"]|['"]$/g,'');
if(!key||!key.startsWith('sk-'))throw new Error('The approved .env.local destination needs OPENAI_API_KEY.');
const env={...process.env,OPENAI_API_KEY:key,JWT_SECRET:randomBytes(48).toString('base64')};
fs.mkdirSync(path.join(root,'.local/ai-server'),{recursive:true});
const runtimeDir=fs.mkdtempSync(path.join(root,'.local/ai-server/runtime-'));
const runtimeJar=path.join(runtimeDir,'server.jar');
fs.copyFileSync(jar,runtimeJar);
const java=process.env.JAVA_HOME?path.join(process.env.JAVA_HOME,'bin/java.exe'):'java';
const backend=spawn(java,['-jar',runtimeJar,'--server.address=127.0.0.1','--server.port=8080','--spring.sql.init.mode=always','--spring.sql.init.data-locations=classpath:production-data.sql',`--spring.datasource.url=jdbc:h2:file:${root.replaceAll('\\','/')}/.local/ai-server/diary;MODE=MySQL;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=MEMBER,BODY;WRITE_DELAY=0`],{cwd:root,env,windowsHide:true,stdio:['ignore','ignore','ignore']});
const frontendEnv={...process.env,VITE_USE_REAL_API:'true',VITE_API_BASE_URL:'/api'};
for(const name of Object.keys(frontendEnv))if(/API_KEY|TOKEN|SECRET/i.test(name))delete frontendEnv[name];
const frontend=spawn(process.execPath,[path.join(root,'frontend/node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','5184','--strictPort'],{cwd:path.join(root,'frontend'),env:frontendEnv,windowsHide:true,stdio:['ignore','pipe','pipe']});
// Vite path is absolute because the child cwd is the frontend directory.
frontend.on('error',()=>{console.error('Frontend could not start.');backend.kill();});
backend.on('error',()=>{console.error('Backend could not start; check Java 17+.');frontend.kill();});
frontend.stdout.pipe(process.stdout);frontend.stderr.pipe(process.stderr);
let stopping=false;
function stop(){if(stopping)return;stopping=true;backend.kill();frontend.kill();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
backend.on('exit',()=>{if(!stopping){console.error('Backend stopped.');stop();}});
frontend.on('exit',()=>{if(!stopping)stop();});
console.log('Local AI screen: http://127.0.0.1:5184/#/studio (sign in / create your account).');
