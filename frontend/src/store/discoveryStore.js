import { authStore } from "../store/authStore.js";
export function deviceScope() {
  if(import.meta.env.VITE_USE_REAL_API !== "true") return "trial";
  const user=authStore.user;
  if(!user)throw new Error("개인 자료를 사용하려면 로그인해 주세요.");
  return String(user.memberId || user.member_id || user.id || user.email);
}
const key=kind=>`rr-discovery-${kind}-v1-${encodeURIComponent(deviceScope())}`;
export function readDevice(kind) {
  const raw=localStorage.getItem(key(kind));if(!raw)return [];
  const value=JSON.parse(raw);if(!Array.isArray(value))throw new Error("기기 자료를 읽지 못했습니다. 백업 파일에서 다시 가져와 주세요.");return value;
}
export function saveDevice(kind,items) {
  localStorage.setItem(key(kind),JSON.stringify(items));window.dispatchEvent(new Event("rr-discovery-changed"));
}
export function downloadBackup(beans,music) {
  const blob=new Blob([JSON.stringify({schemaVersion:1,beans,music,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`roast-reverb-inventory-${new Date().toLocaleDateString("sv-SE")}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
