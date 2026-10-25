import {request,jsonOptions} from './http.js';
const real=import.meta.env.VITE_USE_REAL_API==='true';
export const companionApi={
  status:()=>real?request('/companion/status'):Promise.resolve({state:'server_offline',configured:false,available:false}),
  organize:(note,signal)=>real?request('/companion/cup',{...jsonOptions('POST',{note}),signal}):Promise.reject(new Error('AI 정리는 서버 연결이 필요합니다. 입력한 문장 그대로 카드를 만들 수 있어요.')),
  chat:(body,signal)=>real?request('/companion/chat',{...jsonOptions('POST',body),signal}):Promise.reject(new Error('AI 대화는 서버 연결이 필요합니다. 기기 내 음악 만들기는 계속 사용할 수 있어요.')),
};
