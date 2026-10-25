import { authStore } from "../store/authStore.js";
export function deviceScope() {
  if(import.meta.env?.VITE_USE_REAL_API !== "true") return "trial";
  const user=authStore.user;
  if(!user)throw new Error("개인 자료를 사용하려면 로그인해 주세요.");
  return String(user.memberId || user.member_id || user.id || user.email);
}
const key=kind=>`rr-discovery-${kind}-v1-${encodeURIComponent(deviceScope())}`;
export function readDevice(kind) {
  const raw=localStorage.getItem(key(kind));if(!raw)return [];
  let value;try{value=JSON.parse(raw);}catch{throw new Error('기기 자료가 손상되었습니다. 원본 자료를 보존하고 백업에서 복구해 주세요.');}if(!Array.isArray(value))throw new Error("기기 자료를 읽지 못했습니다. 백업 파일에서 다시 가져와 주세요.");return value;
}
export function saveDevice(kind,items) {
  if(!Array.isArray(items))throw new Error('저장할 자료 형식이 올바르지 않습니다.');
  // A page may recover from a failed read with an empty view. Never let that view
  // overwrite the unreadable original; explicit backup restoration is separate.
  readDevice(kind);
  localStorage.setItem(key(kind),JSON.stringify(items));window.dispatchEvent(new Event("rr-discovery-changed"));
}
export function downloadBackup(beans,music) {
  const blob=new Blob([JSON.stringify({schemaVersion:1,beans,music,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`roast-reverb-inventory-${new Date().toLocaleDateString("sv-SE")}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
