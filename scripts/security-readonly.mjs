import fs from 'node:fs';
const base=process.argv[2]||'https://roast-and-reverb.up.railway.app';
const origin=new URL(base);
if(origin.origin!==base||!(base==='https://roast-and-reverb.up.railway.app'||origin.hostname==='127.0.0.1'))throw Error('Use the authorized origin or isolated localhost');
const checks=[];
async function probe(name,path,accept,options={}){
 const response=await fetch(base+path,{...options,redirect:'manual',signal:AbortSignal.timeout(15000)});
 const passed=accept(response);checks.push({name,status:response.status,passed});return response;
}
await probe('Public health','/healthz',r=>r.status===200);
const page=await probe('Public home','/',r=>r.status===200);
for(const name of ['content-security-policy','x-content-type-options','x-frame-options','referrer-policy','permissions-policy','cross-origin-opener-policy',...(origin.protocol==='https:'?['strict-transport-security']:[])])checks.push({name:`Header ${name}`,passed:!!page.headers.get(name)});
for(const path of ['/api/coffee','/api/music','/api/pairing','/api/collection','/api/members/me','/api/admin/dashboard','/.env','/.git/config','/h2-console','/actuator/env'])await probe(`Anonymous denied: ${path}`,path,r=>[401,403,404].includes(r.status));
await probe('Invalid bearer denied','/api/coffee',r=>r.status===401,{headers:{Authorization:'Bearer security-audit-invalid'}});
await probe('Untrusted CORS denied','/api/coffee',r=>r.status===403&&!r.headers.get('access-control-allow-origin'),{method:'OPTIONS',headers:{Origin:'https://security-audit.invalid','Access-Control-Request-Method':'GET'}});
if(origin.protocol==='https:')await probe('Local development origin denied in production','/api/coffee',r=>r.status===403&&!r.headers.get('access-control-allow-origin'),{method:'OPTIONS',headers:{Origin:'http://localhost:5173','Access-Control-Request-Method':'GET'}});
const report={testedAt:new Date().toISOString(),base,mode:'read-only GET/OPTIONS; no accounts, writes, crawling or brute force',checks};
if(process.env.SECURITY_REPORT_PATH)fs.writeFileSync(process.env.SECURITY_REPORT_PATH,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(checks.some(c=>!c.passed))process.exitCode=1;
