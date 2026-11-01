import {organizeCup,soundAdvice} from '../utils/localCompanion.js';
import {request,jsonOptions} from './http.js';
const real=import.meta.env.VITE_USE_REAL_API==='true';
export const companionApi={
  status:()=>real?request('/companion/status'):Promise.resolve({state:'local_rules',configured:true,available:true}),
  organize:(note,signal)=>real?request('/companion/cup',{...jsonOptions('POST',{note}),signal}):Promise.resolve().then(()=>{signal?.throwIfAborted();return organizeCup(note);}),
  chat:(body,signal)=>real?request('/companion/chat',{...jsonOptions('POST',body),signal}):Promise.resolve().then(()=>{signal?.throwIfAborted();return soundAdvice(body);}),
};
